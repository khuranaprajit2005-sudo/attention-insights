/**
 * Thin analytics abstraction.
 *
 * Prototype 2: events are still buffered in memory for local debugging, and
 * are additionally persisted server-side (analytics_events) through a server
 * function. No numbers are fabricated anywhere.
 */

import { logAnalyticsEvent } from "./attention.functions";
import { getSessionToken } from "./session";

export type AnalyticsEvent =
  | "landing_view"
  | "username_submitted"
  | "analysis_started"
  | "analysis_completed"
  | "analysis_failed"
  | "free_result_viewed"
  | "checkout_started"
  | "payment_started"
  | "payment_success"
  | "payment_failed"
  | "report_viewed"
  | "share_clicked";

type Props = Record<string, string | number | boolean | undefined>;

const buffer: Array<{ event: AnalyticsEvent; props?: Props; at: number }> = [];

function sink(event: AnalyticsEvent, props?: Props) {
  buffer.push({ event, ...(props ? { props } : {}), at: Date.now() });
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, props ?? {});
  }

  const { analysisId, ...rest } = (props ?? {}) as Props & { analysisId?: string };
  void logAnalyticsEvent({
    data: {
      event,
      props: rest,
      sessionToken: getSessionToken(),
      analysisId: analysisId ?? null,
    },
  }).catch(() => {
    /* analytics must never break the journey */
  });
}

export function track(event: AnalyticsEvent, props?: Props) {
  sink(event, props);
}

export function getTrackedEvents() {
  return [...buffer];
}
