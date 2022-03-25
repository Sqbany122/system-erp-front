import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { updateOne } from "../../core/utils/crudUtils";
import { Order } from "../types/order";

const changeOrderStatus = async ({orderId, status}: {orderId: string, status: string}): Promise<Order> => {
    const { data } = await axios.put("/orders/status/change", { orderId, status });
    return data;
}

export function useChangeOrderStatus() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(changeOrderStatus, {
    onSuccess: (order: Order) => {
      queryClient.setQueryData<Order[]>(["orders"], (oldOrders) => 
        updateOne(oldOrders, order)
      );
    },
  });


  return { isUpdating: isLoading, changeOrderStatus: mutateAsync };
}