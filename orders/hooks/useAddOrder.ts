import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { addOne } from "../../core/utils/crudUtils";
import { Order } from "../types/order";

const addOrder = async (order: Order): Promise<Order> => {
  const { data } = await axios.post("/orders", order);
  console.log(data);
  return data;
};

export function useAddOrder() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addOrder, {
    onSuccess: (order: Order) => {
      queryClient.setQueryData<Order[]>(["orders"], (oldOrders) => 
        addOne(oldOrders, order)
      );
    },
  });

  return { isAdding: isLoading, addOrder: mutateAsync };
}