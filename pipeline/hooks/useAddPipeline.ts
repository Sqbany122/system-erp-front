import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { addOne } from "../../core/utils/crudUtils";
import { Pipeline } from "../types/pipeline";

const addPipeline = async (pipeline: Pipeline): Promise<Pipeline> => {
  const { data } = await axios.post("/pipelines", pipeline);
  return data;
};

export function useAddPipeline() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addPipeline, {
    onSuccess: (pipeline: Pipeline) => {
      queryClient.setQueryData<Pipeline[]>(["pipelines"], (oldPipelines) => 
        addOne(oldPipelines, pipeline)
      );
    },
  });

  return { isAdding: isLoading, addPipeline: mutateAsync };
}