import axios from "axios";

export const getCarrierStatus = async (url: string) => {
    const response = await axios.get(url, { timeout: 5000 });
    return { status: response.status, tracking: response.data };
};
