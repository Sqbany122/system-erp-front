import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { changeOne } from "../../../core/utils/crudUtils";
import { Pipeline } from "../../types/pipeline";
import { AdditionalInfo } from "../../types/additional_info";

const updatePipelineAdditionalInfo = async (additional_info: AdditionalInfo): Promise<Pipeline> => {
    const { data } = await axios.post("/pipelines/single/additional_info/update", additional_info);
    return data;
}

export function useUpdatePipelineAdditionalInfo() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updatePipelineAdditionalInfo, {
    onSuccess: (pipeline: Pipeline) => {
      queryClient.setQueryData<Pipeline>(["singlePipeline"], () => 
        changeOne(pipeline)
      );
    },
  });


  return { isUpdating: isLoading, updatePipelineAdditionalInfo: mutateAsync };
}