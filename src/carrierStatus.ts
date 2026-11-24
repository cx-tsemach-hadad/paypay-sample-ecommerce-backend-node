import axios from "axios";

// Fixed carrier base URLs, keyed by carrier identifier (the carrier host name).
const CARRIER_BASE_URLS: ReadonlyMap<string, string> = new Map([["carrier.example", "https://carrier.example"]]);

export const getCarrierStatus = async (url: string) => {
    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        throw new Error("invalid carrier url");
    }
    const baseUrl = CARRIER_BASE_URLS.get(parsed.hostname.toLowerCase());
    if (parsed.protocol !== "https:" || baseUrl === undefined) {
        throw new Error("unknown carrier");
    }
    const response = await axios.get(`${baseUrl}${parsed.pathname}`, { timeout: 5000 });
    return { status: response.status, tracking: response.data };
};
