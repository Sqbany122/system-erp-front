import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { changeOne } from "../../../core/utils/crudUtils";
import { Pipeline } from "../../types/pipeline";
import { File } from "../../types/file";

const addFile = async (file: File): Promise<Pipeline> => {
    const formData = new FormData();
    formData.append('file', file.file);
    formData.append('pipeline', file.pipeline);
    formData.append('file_description', file.file_description);
    const config = {
      headers: {
        'Content-type': 'multipart/form-data'
      }
    }
    const { data } = await axios.post("/pipelines/single/addfile", formData, config);
    console.log(data);
    return data;
};

export function useAddFile() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addFile, {
    onSuccess: (pipeline: Pipeline) => {
      queryClient.setQueryData<Pipeline>(["singlePipeline"], () => 
      changeOne(pipeline)
      );
    },
  });

  return { isAddingFile: isLoading, addFile: mutateAsync };
}