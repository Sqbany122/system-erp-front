import axios from "axios";
import { useQuery } from "react-query";
import { File } from "../../types/file";

const fetchFiles = async (orderId: string): Promise<File[]> => {
    const { data } = await axios.post("/orders/single/getfiles", {orderId});
    return data;
};

export function useFiles(orderId: string) {
    return useQuery("files", () => fetchFiles(orderId));
}