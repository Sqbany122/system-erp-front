import React from 'react';
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon"
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from "@material-ui/icons/Edit";
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import { useTranslation } from "react-i18next";
import Divider from '@material-ui/core/Divider';
import { Order } from '../types/order';

type ActionsMenuProps = {
    onStatusChange?: (orderId: string, status: string) => void;
    onAcceptStatus?: (order: Order) => void;
    status: string,
    order: Order,
};
  
const ActionsMenu = ({
    onStatusChange,
    onAcceptStatus,
    status,
    order,
}: ActionsMenuProps) => {
    const { t } = useTranslation();

    const Test = () => {
        if (status === "is_waiting" && onStatusChange && onAcceptStatus) {
            return(
                <>
                    <Divider sx={{ my: 0.5 }} />
                    <MenuItem 
                        onClick={() => onAcceptStatus(order)}
                        sx={{ my: 1, py: 1 }}
                    >
                        <ListItemIcon>
                            <DoneIcon />
                        </ListItemIcon>{" "}
                        {t("common.status.accept")}
                    </MenuItem>
                    <MenuItem 
                        onClick={() => onStatusChange(order.id, "for_edit")}
                        sx={{ my: 1, py: 1 }}
                    >
                        <ListItemIcon>
                            <EditIcon />
                        </ListItemIcon>{" "}
                        {t("common.status.for_edit")}
                    </MenuItem>
                    <MenuItem 
                        onClick={() => onStatusChange(order.id, "rejected")}
                        sx={{ my: 1, py: 1 }}
                    >
                        <ListItemIcon>
                            <CloseIcon />
                        </ListItemIcon>{" "}
                        {t("common.status.reject")}
                    </MenuItem>
                </>
            )
        } else if (status === "accepted" && onStatusChange) {
            return(
                <>
                    <Divider sx={{ my: 0.5 }} />
                    <MenuItem 
                        onClick={() => onStatusChange(order.id, "paid_by_bank_transfer")}
                        sx={{ my: 1, py: 1 }}
                    >
                        <ListItemIcon>
                            <AccountBalanceIcon />
                        </ListItemIcon>{" "}
                        {t("common.status.paid_by_bank_transfer")}
                    </MenuItem>
                    <MenuItem 
                        onClick={() => onStatusChange(order.id, "paid_in_cash")}
                        sx={{ my: 1, py: 1 }}
                    >
                        <ListItemIcon>
                            <AttachMoneyIcon />
                        </ListItemIcon>{" "}
                        {t("common.status.paid_in_cash")}
                    </MenuItem>
                    <MenuItem 
                        onClick={() => onStatusChange(order.id, "ready_to_pickup")}
                        sx={{ my: 1, py: 1 }}
                    >
                        <ListItemIcon>
                            <BusinessCenterIcon />
                        </ListItemIcon>{" "}
                        {t("common.status.ready_to_pickup")}
                    </MenuItem>
                    <MenuItem 
                        onClick={() => onStatusChange(order.id, "for_edit")}
                        sx={{ my: 1, py: 1 }}
                    >
                        <ListItemIcon>
                            <EditIcon />
                        </ListItemIcon>{" "}
                        {t("common.status.for_edit")}
                    </MenuItem>
                    <MenuItem 
                        onClick={() => onStatusChange(order.id, "rejected")}
                        sx={{ my: 1, py: 1 }}
                    >
                        <ListItemIcon>
                            <CloseIcon />
                        </ListItemIcon>{" "}
                        {t("common.status.reject")}
                    </MenuItem>
                </>
            )
        } else if (status === "for_edit" && onStatusChange && onAcceptStatus) {
            return (
                <>
                    <Divider sx={{ my: 0.5 }} />
                    <MenuItem 
                        onClick={() => onAcceptStatus(order)}
                        sx={{ my: 1, py: 1 }}
                    >
                        <ListItemIcon>
                            <DoneIcon />
                        </ListItemIcon>{" "}
                        {t("common.status.accept")}
                    </MenuItem>
                </>
            )
        } else if (status === "ready_to_pickup" && onStatusChange) {
            return (
                <>
                    <Divider sx={{ my: 0.5 }} />
                    <MenuItem 
                        onClick={() => onStatusChange(order.id, "paid_by_bank_transfer")}
                        sx={{ my: 1, py: 1 }}
                    >
                        <ListItemIcon>
                            <AccountBalanceIcon />
                        </ListItemIcon>{" "}
                        {t("common.status.paid_by_bank_transfer")}
                    </MenuItem>
                    <MenuItem 
                        onClick={() => onStatusChange(order.id, "paid_in_cash")}
                        sx={{ my: 1, py: 1 }}
                    >
                        <ListItemIcon>
                            <AttachMoneyIcon />
                        </ListItemIcon>{" "}
                        {t("common.status.paid_in_cash")}
                    </MenuItem>
                    <MenuItem 
                        onClick={() => onStatusChange(order.id, "rejected")}
                        sx={{ my: 1, py: 1 }}
                    >
                        <ListItemIcon>
                            <CloseIcon />
                        </ListItemIcon>{" "}
                        {t("common.status.reject")}
                    </MenuItem>
                </>
            )
        } else if (status === "rejected" && onStatusChange && onAcceptStatus) {
            return(
                <>
                    <Divider sx={{ my: 0.5 }} />
                    <MenuItem 
                        onClick={() => onAcceptStatus(order)}
                        sx={{ my: 1, py: 1 }}
                    >
                        <ListItemIcon>
                            <DoneIcon />
                        </ListItemIcon>{" "}
                        {t("common.status.accept")}
                    </MenuItem>
                    <MenuItem 
                        onClick={() => onStatusChange(order.id, "for_edit")}
                        sx={{ my: 1, py: 1 }}
                    >
                        <ListItemIcon>
                            <EditIcon />
                        </ListItemIcon>{" "}
                        {t("common.status.for_edit")}
                    </MenuItem>
                </>
            )
        } else {
            return(
                null
            )
        }
      }

    return (
       <Test />
    )
}

export default ActionsMenu;