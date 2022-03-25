import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import React, { useState } from 'react';
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { useTranslation } from "react-i18next";
import { useAddOrder } from "../hooks/useAddOrder";
import { useUpdateOrder } from "../hooks/useUpdateOrder";
import { useOrders } from "../hooks/useOrders";
import { useAcceptOrder } from "../hooks/useAcceptOrder";
import OrderTable from "../components/OrderTable";
import OrderDialog from "../components/OrderDialog";
import { Order } from "../types/order";
import PriorityOrderDialog from "../components/PriorityOrderDialog";
import { useCanAccess } from "../../core/hooks/useCanAccess";
import { Navigate } from "react-router-dom";

interface OrderProps {
  type: string[]
};

const OrderManagement = ({
  type,
}: OrderProps) => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [orderUpdated, setOrderUpdated] = useState<Order | undefined>(undefined);
  const [openPriorityOrderDialog, setOpenPriorityOrderDialog] = useState(false);

  const { addOrder, isAdding } = useAddOrder();
  const { isUpdating, updateOrder } = useUpdateOrder();
  const { acceptOrder } = useAcceptOrder();
  
  const canAccessAddOrder = useCanAccess('orders_add');
  const canAccessEditOrder = useCanAccess('orders_edit');
  const canAccessChangeOrdersStatus = useCanAccess('orders_change_status');

  const { data } = useOrders();

  const processing = isAdding || isUpdating;

  const handleAddOrder = async (order: Partial<Order>) => {
    addOrder(order as Order)
      .then(() => {
        snackbar.success(
          t("orderManagement.notifications.addSuccess", {
            order: `${order.name}`,
          })
        );
        setOpenOrderDialog(false);
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  const handleUpdateOrder = async (order: Order) => {
    updateOrder(order)
      .then(() => {
        snackbar.success(
          t("orderManagement.notifications.updateSuccess", {
            order: `${order.name}`,
          })
        );
        setOpenOrderDialog(false);
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  const handleUpdateOrderPriority = async (order: Order) => {
    acceptOrder(order)
      .then(() => {
        snackbar.success(
          t("orderManagement.notifications.statusChangeSuccess", {
            order: `${order.name}`,
          })
        );
        setOpenPriorityOrderDialog(false);
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  const handleCloseOrderDialog = () => {
    setOrderUpdated(undefined);
    setOpenOrderDialog(false);
  }

  const handleOpenOrderDialog = (order?: Order) => {
    setOrderUpdated(order);
    setOpenOrderDialog(true);
  };

  const handleSelectedChange = (newSelected: string[]) => {
    setSelected(newSelected);
  };

  const handleOpenPriorityOrderDialog = (order?: Order) => {
    setOrderUpdated(order);
    setOpenPriorityOrderDialog(true);
  };

  const handleClosePriorityOrderDialog  = () => {
    setOrderUpdated(undefined);
    setOpenPriorityOrderDialog(false);
  }

  if (!useCanAccess('orders')) {
    return <Navigate to="/403" />
  }

  return(
    <React.Fragment>
      <AdminAppBar>
        <AdminToolbar title={t("orderManagement.toolbar.title")}>
          {canAccessAddOrder && (
            <Fab
              aria-label="logout"
              color="primary"
              disabled={processing}
              onClick={() => handleOpenOrderDialog()}
              size="small"
              sx={{ mr: 2 }}
            >
              <AddIcon />
            </Fab>
          )}
        </AdminToolbar>
      </AdminAppBar>
      <OrderTable
        processing={processing}
        onEdit={handleOpenOrderDialog}
        onAcceptStatus={handleOpenPriorityOrderDialog}
        onSelectedChange={handleSelectedChange}
        selected={selected}
        canChangeStatus={canAccessChangeOrdersStatus}
        canEdit={canAccessEditOrder}
        type={type}
        orders={data}
      />
      {openOrderDialog && (
        <OrderDialog
          onAdd={handleAddOrder}
          onClose={handleCloseOrderDialog}
          onUpdate={handleUpdateOrder}
          open={openOrderDialog}
          processing={processing}
          order={orderUpdated}
        />
      )}
      {openPriorityOrderDialog && (
        <PriorityOrderDialog 
          onUpdate={handleUpdateOrderPriority}
          onClose={handleClosePriorityOrderDialog}
          open={openPriorityOrderDialog}
          processing={processing}
          order={orderUpdated}
        />
      )}
    </React.Fragment>
  );
}


export default OrderManagement;
