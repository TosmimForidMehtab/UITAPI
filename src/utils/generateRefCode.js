import { nanoid } from "nanoid";
export function generateReferralCode() {
  const uniqueId = nanoid(10);

  const uppercaseId = uniqueId.toUpperCase();

  return uppercaseId;
}