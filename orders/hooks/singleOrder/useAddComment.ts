import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { addOne } from "../../../core/utils/crudUtils";
import { Comment } from "../../types/comment";

const addComment = async (comment: Comment): Promise<Comment> => {
    const { data } = await axios.post("/orders/single/addcomment", comment);
    return data;
};

export function useAddComment() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addComment, {
    onSuccess: (comment: Comment) => {
      queryClient.setQueryData<Comment[]>(["comments"], (oldComments) => 
        addOne(oldComments, comment)
      );
    },
  });

  return { isAdding: isLoading, addComment: mutateAsync };
}