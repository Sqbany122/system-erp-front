import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { addOne } from "../../../core/utils/crudUtils";
import { File } from "../../types/file";

const addFile = async (file: File): Promise<File> => {
    const formData = new FormData();
    formData.append('file', file.file);
    formData.append('order', file.order);
    formData.append('file_description', file.file_description);
    const config = {
      headers: {
        'Content-type': 'multipart/form-data'
      }
    }
    const { data } = await axios.post("/orders/single/addfile", formData, config);
    console.log(data);
    return data;
};

export function useAddFile() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addFile, {
    onSuccess: (file: File) => {
      queryClient.setQueryData<File[]>(["files"], (oldFiles) => 
        addOne(oldFiles, file)
      );
    },
  });

  return { isAdding: isLoading, addFile: mutateAsync };
}