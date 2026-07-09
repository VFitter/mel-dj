/** E.164 phone number for direct contact CTAs. */
export const CONTACT_PHONE_E164 = "+16476759837";

/** Digits only, with country code — for wa.me / t.me links. */
export const CONTACT_PHONE_DIGITS = "16476759837";

/** Human-readable display format. */
export const CONTACT_PHONE_DISPLAY = "(647) 675-9837";

export const CONTACT_LINKS = {
  call: `tel:${CONTACT_PHONE_E164}`,
  whatsapp: `https://wa.me/${CONTACT_PHONE_DIGITS}`,
  telegram: `https://t.me/+${CONTACT_PHONE_DIGITS}`,
} as const;
