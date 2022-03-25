import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { updateOne } from "../../core/utils/crudUtils";
import { Order } from "../types/order";

const acceptOrder = async (order: Order): Promise<Order> => {
    const { data } = await axios.put("/orders/accept", order);
    return data;
}

export function useAcceptOrder() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(acceptOrder, {
    onSuccess: (order: Order) => {
      queryClient.setQueryData<Order[]>(["orders"], (oldOrders) => 
        updateOne(oldOrders, order)
      );
    },
  });


  return { isUpdating: isLoading, acceptOrder: mutateAsync };
}