import axios from "axios";
import { useQuery } from "react-query";
import { Pipeline } from "../types/pipeline";

const fetchPipelines = async (): Promise<Pipeline[]> => {
    const { data } = await axios.post("/getpipelines");
    return data;
};

export function usePipelines() {
    return useQuery("pipelines", () => fetchPipelines());
}