import axios from "axios";
import { useQuery } from "react-query";
import { File } from "../types/file";

const fetchFiles = async (id: string, model: string): Promise<File[]> => {
    const { data } = await axios.post("/files", {id, model});
    return data;
};

export function useFiles(id: string, model: string) {
    return useQuery("files", () => fetchFiles(id, model));
}