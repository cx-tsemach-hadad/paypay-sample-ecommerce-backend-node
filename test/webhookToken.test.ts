import request from "supertest";
import { Server } from "../src";
import { signOrderWebhook, verifyOrderWebhook } from "../src/webhookSigner";

describe("order webhook tokens", () => {
    afterAll(() => Server.close());

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

    it("returns a verifiable token from the route", async () => {
        const res = await request(Server).get("/webhook-token/order-77");
        expect(res.status).toEqual(200);
        expect(verifyOrderWebhook(res.body.token)).toBe(true);
    });
});
