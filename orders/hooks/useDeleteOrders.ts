import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { removeMany } from "../../core/utils/crudUtils";
import { Order } from "../types/order";

const deleteOrders = async (orderIds: string[]): Promise<string[]> => {
    const { data } = await axios.delete("/orders", { data: orderIds});
    return data;
};

export function useDeleteOrders() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(deleteOrders, {
    onSuccess: (orderIds: string[]) => {
      queryClient.setQueryData<Order[]>(["orders"], (oldOrders) => 
      removeMany(oldOrders, orderIds)
      );
    },
  });

  return { isDeleting: isLoading, deleteOrders: mutateAsync };
}