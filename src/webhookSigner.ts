import crypto from "crypto";

const SIGNING_KEY = "k8Jx2Qv9mTzP4wLr7NcB1hYdE6sUa3FgW0oXtVi5ZqRb";

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
