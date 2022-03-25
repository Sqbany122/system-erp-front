import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { changeOne } from "../../../core/utils/crudUtils";
import { Comment } from "../../types/comment";
import { Pipeline } from "../../types/pipeline";

const addComment = async (comment: Comment): Promise<Pipeline> => {
    const { data } = await axios.post("/pipelines/single/addcomment", comment);
    return data;
};

export function useAddComment() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addComment, {
    onSuccess: (pipeline: Pipeline) => {
      queryClient.setQueryData<Pipeline>(["singlePipeline"], () => 
        changeOne(pipeline)
      );
    },
  });

  return { isAddingComment: isLoading, addComment: mutateAsync };
}