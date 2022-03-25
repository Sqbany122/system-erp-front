import axios from "axios";
import { useQuery } from "react-query";
import { Order } from "../types/order";

const fetchOrders = async (): Promise<Order[]> => {
    const { data } = await axios.post("/getorders");
    return data;
};

export function useOrders() {
    return useQuery("orders", () => fetchOrders());
}