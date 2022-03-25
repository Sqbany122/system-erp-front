import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { updateOne } from "../../core/utils/crudUtils";
import { Pipeline } from "../types/pipeline";

const updatePipeline = async (pipeline: Pipeline): Promise<Pipeline> => {
    const { data } = await axios.put("pipelines", pipeline);
    return data;
}

export function useUpdatePipeline() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updatePipeline, {
    onSuccess: (pipeline: Pipeline) => {
      queryClient.setQueryData<Pipeline[]>(["pipelines"], (oldPipelines) => 
        updateOne(oldPipelines, pipeline)
      );
    },
  });


  return { isUpdating: isLoading, updatePipeline: mutateAsync };
}