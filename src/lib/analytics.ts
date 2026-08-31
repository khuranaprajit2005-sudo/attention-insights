/**
 * Thin analytics abstraction. Prototype 1 logs to the console + an in-memory
 * buffer; swap the `sink` for PostHog (or any provider) later.
 */

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
  buffer.push({ event, props, at: Date.now() });
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, props ?? {});
  }
}

export function track(event: AnalyticsEvent, props?: Props) {
  sink(event, props);
}

export function getTrackedEvents() {
  return [...buffer];
}
