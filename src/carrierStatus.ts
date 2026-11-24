import axios from "axios";

const ALLOWED_CARRIER_HOSTS = (process.env.CARRIER_ALLOWED_HOSTS || "carrier.example")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

const assertAllowedCarrierUrl = (url: string): void => {
    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        throw new Error("invalid carrier url");
    }
    if (parsed.protocol !== "https:" || !ALLOWED_CARRIER_HOSTS.includes(parsed.hostname.toLowerCase())) {
        throw new Error("carrier host not allowed");
    }
};

export const getCarrierStatus = async (url: string) => {
    assertAllowedCarrierUrl(url);
    const response = await axios.get(url, { timeout: 5000 });
    return { status: response.status, tracking: response.data };
};
