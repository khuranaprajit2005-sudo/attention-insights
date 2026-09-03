/**
 * Server-side execution path for AttentionAI (Prototype 2 foundation).
 *
 * Everything that decides access lives here and runs on the server:
 *  - the analysis engine run + result persistence
 *  - payment records and (demo) verification
 *  - entitlement grants
 *  - report release
 *
 * The browser is never trusted to say a payment succeeded, an entitlement
 * exists, or a report is unlocked.
 *
 * NOTE: server-only modules are imported INSIDE handlers so they never enter
 * the client bundle.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { validateUsername } from "./analysis/validation";
import { PRICE_IN_PAISE, type PaymentMethod } from "./payments/pricing";
import type { FreeReport, ReportAccessResponse } from "./analysis/types";

/** Generic, non-leaking error surfaced to users. */
class SafeError extends Error {}

function safeFail(message: string): never {
  throw new SafeError(message);
}

/** Log details server-side, return a generic message to the caller. */
function handleUnexpected(context: string, error: unknown): never {
  console.error(`[attention:${context}]`, error);
  if (error instanceof SafeError) throw error;
  throw new SafeError("Something went wrong on our side. Please try again.");
}

const uuid = z.string().uuid();
const tokenSchema = z.string().min(20).max(200);

async function server() {
  const [{ supabaseAdmin }, crypto] = await Promise.all([
    import("@/integrations/supabase/client.server"),
    import("crypto"),
  ]);
  const hashToken = (token: string) =>
    crypto.createHash("sha256").update(token).digest("hex");
  return { supabaseAdmin, hashToken, randomToken: () => crypto.randomBytes(32).toString("hex") };
}

/** Resolve the session for an incoming token; never creates one implicitly. */
async function requireSession(
  ctx: Awaited<ReturnType<typeof server>>,
  token: string | null | undefined,
): Promise<string> {
  if (!token) safeFail("Your session has expired. Please start a new analysis.");
  const { data, error } = await ctx.supabaseAdmin
    .from("analysis_sessions")
    .select("id")
    .eq("token_hash", ctx.hashToken(token))
    .maybeSingle();
  if (error) throw error;
  if (!data) safeFail("Your session has expired. Please start a new analysis.");
  return data.id;
}

/** Load an analysis and assert it belongs to the calling session. */
async function requireOwnedAnalysis(
  ctx: Awaited<ReturnType<typeof server>>,
  analysisId: string,
  sessionId: string,
) {
  const { data, error } = await ctx.supabaseAdmin
    .from("analyses")
    .select("id, username, session_id")
    .eq("id", analysisId)
    .maybeSingle();
  if (error) throw error;
  // Same generic message whether the analysis is missing or owned by someone
  // else, so the response cannot be used to probe for other people's IDs.
  if (!data || data.session_id !== sessionId) safeFail("This analysis is not available.");
  return data;
}

async function hasEntitlement(
  ctx: Awaited<ReturnType<typeof server>>,
  analysisId: string,
  sessionId: string,
): Promise<boolean> {
  const { data, error } = await ctx.supabaseAdmin
    .from("entitlements")
    .select("id")
    .eq("analysis_id", analysisId)
    .eq("session_id", sessionId)
    .is("revoked_at", null)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

/* ------------------------------------------------------------------ */
/* 1. Start an analysis — runs the engine server-side and persists it. */
/* ------------------------------------------------------------------ */

export const startAnalysis = createServerFn({ method: "POST" })
  .inputValidator((input: { username: string; sessionToken?: string | null }) =>
    z
      .object({ username: z.string().max(60), sessionToken: tokenSchema.nullish() })
      .parse(input),
  )
  .handler(async ({ data }): Promise<{ analysisId: string; sessionToken: string }> => {
    try {
      const validation = validateUsername(data.username);
      if (!validation.ok || !validation.username) {
        safeFail(validation.error ?? "Please enter a valid username.");
      }
      const username = validation.username;

      const ctx = await server();
      const { runAnalysis } = await import("./analysis/engine.server");

      // Reuse the caller's session when the token is valid, otherwise mint one.
      let sessionId: string | null = null;
      let sessionToken = data.sessionToken ?? null;
      if (sessionToken) {
        const { data: existing } = await ctx.supabaseAdmin
          .from("analysis_sessions")
          .select("id")
          .eq("token_hash", ctx.hashToken(sessionToken))
          .maybeSingle();
        sessionId = existing?.id ?? null;
      }
      if (!sessionId) {
        sessionToken = ctx.randomToken();
        const { data: created, error } = await ctx.supabaseAdmin
          .from("analysis_sessions")
          .insert({ token_hash: ctx.hashToken(sessionToken) })
          .select("id")
          .single();
        if (error) throw error;
        sessionId = created.id;
      }

      const { data: analysis, error: analysisError } = await ctx.supabaseAdmin
        .from("analyses")
        .insert({ session_id: sessionId, username, status: "running" })
        .select("id")
        .single();
      if (analysisError) throw analysisError;

      const result = runAnalysis(username);
      const [previewAccount, ...lockedAccounts] = result.topAccounts;
      if (!previewAccount) safeFail("Something went wrong on our side. Please try again.");

      const freePayload = {
        username: result.username,
        score: result.score,
        tier: result.tier,
        dimensions: {
          engagement: result.dimensions.engagement,
          recency: result.dimensions.recency,
          frequency: result.dimensions.frequency,
          consistency: result.dimensions.consistency,
        },
        momentumPercent: result.momentumPercent,
        signalCount: result.signalCount,
        // Only the initial of the ranked #1 account is ever exposed pre-payment.
        topInitial: previewAccount.name.charAt(0).toUpperCase(),
        topScore: previewAccount.score,
        lockedAccountCount: lockedAccounts.length,
      };

      const { error: resultError } = await ctx.supabaseAdmin.from("analysis_results").insert({
        analysis_id: analysis.id,
        score: result.score,
        dimensions: result.dimensions as unknown as never,
        free_payload: freePayload as unknown as never,
        paid_payload: result as unknown as never,
      });
      if (resultError) throw resultError;

      await ctx.supabaseAdmin
        .from("analyses")
        .update({ status: "complete" })
        .eq("id", analysis.id);

      await ctx.supabaseAdmin.from("analytics_events").insert({
        session_id: sessionId,
        analysis_id: analysis.id,
        event: "analysis_completed",
        props: { username },
      });

      return { analysisId: analysis.id, sessionToken: sessionToken! };
    } catch (error) {
      handleUnexpected("startAnalysis", error);
    }
  });

/* ---------------------------------------------------- */
/* 2. Free result — teaser payload only, never the paid. */
/* ---------------------------------------------------- */

export const getFreeResult = createServerFn({ method: "POST" })
  .inputValidator((input: { analysisId: string; sessionToken?: string | null }) =>
    z.object({ analysisId: uuid, sessionToken: tokenSchema.nullish() }).parse(input),
  )
  .handler(async ({ data }): Promise<FreeReport> => {
    try {
      const ctx = await server();
      const sessionId = await requireSession(ctx, data.sessionToken);
      await requireOwnedAnalysis(ctx, data.analysisId, sessionId);

      const { data: row, error } = await ctx.supabaseAdmin
        .from("analysis_results")
        .select("free_payload")
        .eq("analysis_id", data.analysisId)
        .maybeSingle();
      if (error) throw error;
      if (!row) safeFail("This analysis is not available.");

      const unlocked = await hasEntitlement(ctx, data.analysisId, sessionId);

      // Tolerate free payloads written by the earlier prototype shape, while
      // guaranteeing no paid identity data is forwarded to the browser.
      const fp = row.free_payload as unknown as Record<string, unknown>;
      const legacyPreview = fp["previewAccount"] as { handle?: string; score?: number } | undefined;
      const topInitial =
        (fp["topInitial"] as string | undefined) ??
        (legacyPreview?.handle?.replace(/^@/, "").charAt(0) ?? "").toUpperCase() ??
        "";
      const topScore =
        (fp["topScore"] as number | undefined) ?? legacyPreview?.score ?? (fp["score"] as number);

      return {
        analysisId: data.analysisId,
        username: fp["username"] as string,
        score: fp["score"] as number,
        tier: fp["tier"] as FreeReport["tier"],
        dimensions: fp["dimensions"] as FreeReport["dimensions"],
        momentumPercent: fp["momentumPercent"] as number,
        signalCount: fp["signalCount"] as number,
        topInitial,
        topScore,
        lockedAccountCount: (fp["lockedAccountCount"] as number | undefined) ?? 0,
        unlocked,
        isDemoData: true,
      };
    } catch (error) {
      handleUnexpected("getFreeResult", error);
    }
  });

/* ------------------------------------------------------------------ */
/* 3. Demo payment — creates a payment record, verifies it server-side */
/*    and grants the entitlement. NOT production verification.         */
/* ------------------------------------------------------------------ */

export const payForReport = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      analysisId: string;
      sessionToken?: string | null;
      method: PaymentMethod;
      simulateFailure?: boolean;
    }) =>
      z
        .object({
          analysisId: uuid,
          sessionToken: tokenSchema.nullish(),
          method: z.enum(["upi", "card", "netbanking"]),
          simulateFailure: z.boolean().optional(),
        })
        .parse(input),
  )
  .handler(async ({ data }): Promise<{ status: "paid" } | { status: "failed"; error: string }> => {
    try {
      const ctx = await server();
      const sessionId = await requireSession(ctx, data.sessionToken);
      await requireOwnedAnalysis(ctx, data.analysisId, sessionId);

      if (await hasEntitlement(ctx, data.analysisId, sessionId)) return { status: "paid" };

      const { createDemoOrder, captureDemoPayment, verifyDemoPayment, DEMO_PROVIDER } =
        await import("./payments/demoPaymentService.server");

      const order = createDemoOrder(PRICE_IN_PAISE);

      const { data: payment, error: paymentError } = await ctx.supabaseAdmin
        .from("payments")
        .insert({
          analysis_id: data.analysisId,
          session_id: sessionId,
          provider: DEMO_PROVIDER,
          provider_order_id: order.providerOrderId,
          method: data.method,
          amount_in_paise: PRICE_IN_PAISE,
          status: "created",
        })
        .select("id")
        .single();
      if (paymentError) throw paymentError;

      // The QA failure switch is only honoured in development.
      const forceFailure = Boolean(data.simulateFailure) && process.env["NODE_ENV"] !== "production";
      const capture = captureDemoPayment(order, data.method, { forceFailure });
      const verified = verifyDemoPayment(capture, order, PRICE_IN_PAISE);

      if (!verified) {
        const reason =
          capture.failureReason ?? "We could not complete the payment. Please try again.";
        await ctx.supabaseAdmin
          .from("payments")
          .update({ status: "failed", failure_reason: reason })
          .eq("id", payment.id);
        await ctx.supabaseAdmin.from("analytics_events").insert({
          session_id: sessionId,
          analysis_id: data.analysisId,
          event: "payment_failed",
          props: { method: data.method },
        });
        return { status: "failed", error: reason };
      }

      await ctx.supabaseAdmin
        .from("payments")
        .update({
          status: "verified",
          provider_payment_id: capture.providerPaymentId ?? null,
          verified_at: new Date().toISOString(),
        })
        .eq("id", payment.id);

      const { error: entitlementError } = await ctx.supabaseAdmin.from("entitlements").insert({
        analysis_id: data.analysisId,
        session_id: sessionId,
        payment_id: payment.id,
      });
      if (entitlementError) throw entitlementError;

      await ctx.supabaseAdmin.from("analytics_events").insert({
        session_id: sessionId,
        analysis_id: data.analysisId,
        event: "payment_success",
        props: { method: data.method },
      });

      return { status: "paid" };
    } catch (error) {
      handleUnexpected("payForReport", error);
    }
  });

/* -------------------------------------------------------------- */
/* 4. Full report — released only when a valid entitlement exists. */
/* -------------------------------------------------------------- */

export const getFullReport = createServerFn({ method: "POST" })
  .inputValidator((input: { analysisId: string; sessionToken?: string | null }) =>
    z.object({ analysisId: uuid, sessionToken: tokenSchema.nullish() }).parse(input),
  )
  .handler(async ({ data }): Promise<ReportAccessResponse> => {
    try {
      const ctx = await server();
      const sessionId = await requireSession(ctx, data.sessionToken);
      await requireOwnedAnalysis(ctx, data.analysisId, sessionId);

      if (!(await hasEntitlement(ctx, data.analysisId, sessionId))) {
        return { unlocked: false };
      }

      const { data: row, error } = await ctx.supabaseAdmin
        .from("analysis_results")
        .select("paid_payload")
        .eq("analysis_id", data.analysisId)
        .maybeSingle();
      if (error) throw error;
      if (!row) safeFail("This report is not available.");

      await ctx.supabaseAdmin.from("analytics_events").insert({
        session_id: sessionId,
        analysis_id: data.analysisId,
        event: "report_viewed",
      });

      return {
        unlocked: true,
        report: { ...(row.paid_payload as never as object), analysisId: data.analysisId } as never,
      };
    } catch (error) {
      handleUnexpected("getFullReport", error);
    }
  });

/* ------------------------------------------- */
/* 5. Persistent analytics for journey events. */
/* ------------------------------------------- */

export const logAnalyticsEvent = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      event: string;
      props?: Record<string, unknown>;
      sessionToken?: string | null;
      analysisId?: string | null;
    }) =>
      z
        .object({
          event: z.string().min(1).max(64),
          props: z.record(z.unknown()).optional(),
          sessionToken: tokenSchema.nullish(),
          analysisId: uuid.nullish(),
        })
        .parse(input),
  )
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    try {
      const ctx = await server();
      let sessionId: string | null = null;
      if (data.sessionToken) {
        const { data: session } = await ctx.supabaseAdmin
          .from("analysis_sessions")
          .select("id")
          .eq("token_hash", ctx.hashToken(data.sessionToken))
          .maybeSingle();
        sessionId = session?.id ?? null;
      }
      await ctx.supabaseAdmin.from("analytics_events").insert({
        session_id: sessionId,
        analysis_id: sessionId ? (data.analysisId ?? null) : null,
        event: data.event,
        props: (data.props ?? {}) as never,
      });
      return { ok: true };
    } catch (error) {
      // Analytics must never break the user journey.
      console.error("[attention:logAnalyticsEvent]", error);
      return { ok: false };
    }
  });
