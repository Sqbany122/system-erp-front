import axios from "axios";
import { useQuery } from "react-query";
import { Comment } from "../../types/comment";

const fetchComments = async (orderId: string): Promise<Comment[]> => {
    const { data } = await axios.post("/orders/single/getcomments", {orderId});
    return data;
};

export function useComments(orderId: string) {
    return useQuery("comments", () => fetchComments(orderId));
}