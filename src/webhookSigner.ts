import crypto from "crypto";

// Read the key from the environment; fall back to a random per-process key so no secret is committed.
const SIGNING_KEY = process.env.WEBHOOK_SIGNING_KEY || crypto.randomBytes(32).toString("hex");

export const signOrderWebhook = (orderId: string, issuedAt: number): string => {
    const body = orderId + "." + issuedAt;
    const signature = crypto.createHmac("sha256", SIGNING_KEY).update(body).digest("hex");
    return body + "." + signature;
};

export const verifyOrderWebhook = (token: string): boolean => {
    const parts = token.split(".");
    if (parts.length !== 3) {
        return false;
    }
    const expected = signOrderWebhook(parts[0], Number(parts[1]));
    return expected === token;
};
