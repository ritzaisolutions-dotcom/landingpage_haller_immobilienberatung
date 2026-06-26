import type { Besichtigungsslot, Inserat, Lead } from "./index";

export type BookingContact = {
  name: string;
  email: string;
  telefon: string;
};

export type PageState =
  | { kind: "invalid" }
  | { kind: "expired" }
  | { kind: "already_booked"; slot: Besichtigungsslot; lead: Lead }
  | { kind: "ready"; lead: Lead; inserat: Inserat; slots: Besichtigungsslot[] };

export type BookTerminResult =
  | { ok: true }
  | {
      ok: false;
      error:
        | "invalid_token"
        | "expired"
        | "already_booked"
        | "slot_taken"
        | "config"
        | "unknown";
    };
