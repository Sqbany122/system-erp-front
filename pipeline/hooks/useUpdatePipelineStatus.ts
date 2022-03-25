import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { updateOne } from "../../core/utils/crudUtils";
import { Pipeline } from "../types/pipeline";

const updatePipelineStatus = async (pipelineStatus): Promise<Pipeline> => {
    const { data } = await axios.post("/pipelines/change/status", pipelineStatus);
    return data;
}

export function useUpdatePipelineStatus() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updatePipelineStatus, {
    onSuccess: (pipelines: Pipeline) => {
      queryClient.setQueryData<Pipeline[]>(["pipelines"], (oldPipelines) => 
        updateOne(oldPipelines, pipelines)
      );
    },
  });


  return { isChangingStatus: isLoading, updatePipelineStatus: mutateAsync };
}