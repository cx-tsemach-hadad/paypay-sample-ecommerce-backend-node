import { signOrderWebhook, verifyOrderWebhook } from "../src/webhookSigner";

describe("order webhook tokens", () => {
    it("signs an order id with a hex signature that verifies", () => {
        const token = signOrderWebhook("order-1001", 1700000000000);
        const parts = token.split(".");
        expect(parts[0]).toEqual("order-1001");
        expect(parts[1]).toEqual("1700000000000");
        expect(parts[2]).toMatch(/^[0-9a-f]{64}$/);
        expect(verifyOrderWebhook(token)).toBe(true);
    });

    it("rejects a token whose order id was changed", () => {
        const token = signOrderWebhook("order-1001", 1700000000000);
        expect(verifyOrderWebhook(token.replace("order-1001", "order-2002"))).toBe(false);
    });
});
