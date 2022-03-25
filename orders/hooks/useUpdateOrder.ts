import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { updateOne } from "../../core/utils/crudUtils";
import { Order } from "../types/order";

const updateOrder = async (order: Order): Promise<Order> => {
    const { data } = await axios.put("orders", order);
    return data;
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updateOrder, {
    onSuccess: (order: Order) => {
      queryClient.setQueryData<Order[]>(["orders"], (oldOrders) => 
        updateOne(oldOrders, order)
      );
    },
  });


  return { isUpdating: isLoading, updateOrder: mutateAsync };
}