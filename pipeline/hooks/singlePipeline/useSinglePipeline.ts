import axios from "axios";
import { useQuery } from "react-query";
import { Pipeline } from "../../types/pipeline";

const fetchSinglePipeline = async (pipelineId: string): Promise<Pipeline> => {
    const { data } = await axios.post("/pipelines/single", {pipelineId});
    return data;
};

export function useSinglePipeline(pipelineId: string) {
    return useQuery("singlePipeline", () => fetchSinglePipeline(pipelineId));
}