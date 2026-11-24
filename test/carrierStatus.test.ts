import axios from "axios";
import { getCarrierStatus } from "../src/carrierStatus";

jest.mock("axios");

describe("carrier status", () => {
    it("returns the status and tracking details from the carrier", async () => {
        (axios.get as jest.Mock).mockResolvedValue({ status: 200, data: { state: "delivered" } });
        const result = await getCarrierStatus("https://carrier.example/track/1001");
        expect(result).toEqual({ status: 200, tracking: { state: "delivered" } });
        expect(axios.get).toHaveBeenCalledWith("https://carrier.example/track/1001", { timeout: 5000 });
    });

    it("passes a carrier failure on to the caller", async () => {
        (axios.get as jest.Mock).mockRejectedValue(new Error("timeout"));
        await expect(getCarrierStatus("https://carrier.example/track/1002")).rejects.toThrow("timeout");
    });
});
