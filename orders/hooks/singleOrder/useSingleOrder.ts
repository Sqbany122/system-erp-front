import axios from "axios";
import { useQuery } from "react-query";
import { Order } from "../../types/order";

const fetchSingleOrder = async (orderId: string): Promise<Order> => {
    const { data } = await axios.post("/orders/single", {orderId});
    return data;
};

export function useSingleOrder(orderId: string) {
    return useQuery("singleOrder", () => fetchSingleOrder(orderId));
}