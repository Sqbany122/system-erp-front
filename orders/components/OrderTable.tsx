import React, { useState } from "react";
import { Link } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Divider from '@material-ui/core/Divider';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import IconButton from "@material-ui/core/IconButton";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Chip from "@material-ui/core/Chip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import EditIcon from "@material-ui/icons/Edit";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useTranslation } from "react-i18next";
import * as selectUtils from "../../core/utils/selectUtils";
import Empty from "../../core/components/Empty";
import ActionsMenu from "./ActionsMenu";
import { Order } from "../types/order";
import { useChangeOrderStatus } from "../hooks/useChangeOrderStatus";
import Typography from "@material-ui/core/Typography";
import { useTheme } from "@material-ui/core/styles";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { useProjects } from "../../projects/hooks/useProjects";

interface HeadCell {
  id: string;
  label: string;
  align: "center" | "left" | "right";
}

const headCells: HeadCell[] = [
  {
    id: "id",
    align: "center",
    label: "orderManagement.table.headers.id",
  },
  {
    id: "owner",
    align: "center",
    label: "orderManagement.table.headers.owner",
  },
  {
    id: "date",
    align: "center",
    label: "orderManagement.table.headers.date",
  },
  {
    id: "name",
    align: "center",
    label: "orderManagement.table.headers.name",
  },
  {
    id: "price",
    align: "center",
    label: "orderManagement.table.headers.price",
  },
  {
    id: "priority",
    align: "center",
    label: "orderManagement.table.headers.priority",
  },
  {
    id: "project",
    align: "center",
    label: "orderManagement.table.headers.project",
  },
  {
    id: "category",
    align: "center",
    label: "orderManagement.table.headers.category",
  },
  {
    id: "status",
    align: "center",
    label: "orderManagement.table.headers.status",
  }
];

interface EnhancedTableProps {
  numSelected : number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

function EnhancedTableHead({
  onSelectAllClick,
  numSelected,
  rowCount,
}: EnhancedTableProps) {
  const { t } = useTranslation();

  return (
    <TableHead>
      <TableRow sx={{ "& th": { border: 0 } }}>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} sx={{ py:0 }}>
            {t(headCell.label)}
          </TableCell>
        ))}
        <TableCell align="right" sx={{ py: 0}}>
          {t("orderManagement.table.headers.actions")}
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

type OrderRowProps = {
  index: number;
  onCheck: (id: string) => void;
  onEdit: (order: Order) => void;
  onAcceptStatus: (order: Order) => void;
  canChangeStatus: boolean;
  canEdit: boolean;
  processing: boolean;
  selected: boolean;
  order: Order;
};

const OrderRow = ({
  index,
  onCheck,
  onEdit,
  onAcceptStatus,
  canChangeStatus,
  canEdit,
  processing,
  selected,
  order,
}: OrderRowProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const snackbar = useSnackbar();
  const theme = useTheme();

  const projects = useProjects();

  const openActions = Boolean(anchorEl);
  const { changeOrderStatus } = useChangeOrderStatus();
  const rowNumber = index + 1;

  const handleOpenActions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseActions = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleCloseActions();
    onEdit(order);
  };

  const handleChangeStatus = (orderId: string, status: string) => {
    handleCloseActions();
    changeOrderStatus({orderId, status})
      .then(() => {
        snackbar.success(
          t("orderManagement.notifications.statusChangeSuccess", {
            order: `${order.name}`,
          })
        );
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  const handleChangePriority = (order: Order) => {
    handleCloseActions();
    onAcceptStatus(order);
  }
  
  let orderColor;
  
  if (order.priority >= "6" && order.priority <= "8") {
    orderColor = theme.palette.success.main;
  } else if (order.priority >= "9" && order.priority <= "10") {
    orderColor = theme.palette.error.main;
  } else {
    orderColor = "background.paper";
  }

  return (
    <TableRow
      aria-checked={selected}
      tabIndex={-1}
      key={order.id}
      selected={selected}
      sx={{ "& td": { bgcolor: orderColor, border: 0} }}
    >
      <TableCell 
        align="center"
        sx={{ borderTopLeftRadius: "1rem", borderBottomLeftRadius: "1rem"}}
      >{rowNumber}</TableCell>
      <TableCell align="center">{order.owner}</TableCell>
      <TableCell align="center">{order.created_at}</TableCell>
      <TableCell align="center">{order.name}</TableCell>
      <TableCell align="center">
        <Typography component="div">
          {order.price + " PLN"}
        </Typography>
        {order.orginal_price && (
          <Typography component="div">
            {"(" + order.orginal_price + " " + order.currency_name +")"}
          </Typography>
        )}
      </TableCell>
      <TableCell align="center">{order.priority}</TableCell>
      <TableCell align="center">
        {!projects.isLoading && projects.data && (
          projects?.data.filter(project => project.id == order.project).map(filtered => filtered.name) + 
          " (" + (order.project_group ? order.project_group : t("common.none")) + ")"
        )}
        </TableCell>
      <TableCell align="center">{order.order_category}</TableCell>
      <TableCell align="center">
        <Chip color="primary" label={t("orderManagement.statuses." + order.status)} />
      </TableCell>
      <TableCell
        align="right"
        sx={{ borderTopRightRadius: "1rem", borderBottomRightRadius: "1rem"}}
      >
        <IconButton
          id="user-row-menu-button"
          aria-label="order actions"
          aria-controls="order-row-menu"
          aria-haspopup="true"
          aria-expanded={openActions ? "true" : "false"}
          disabled={processing}
          onClick={handleOpenActions}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="user-row-menu"
          anchorEl={anchorEl}
          aria-labelledby="user-row-menu-button"
          open={openActions}
          onClose={handleCloseActions}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          >
            <MenuItem
              component={Link}
              to={ "/admin/orders/info/" + order.id }
              sx={{ my: 1, py: 1 }}
            >
              <ListItemIcon>
                  <ArrowForwardIosIcon />
              </ListItemIcon>{" "}
              {t("common.open")}
            </MenuItem>
            {canChangeStatus && (
              <ActionsMenu 
                onStatusChange={handleChangeStatus}
                onAcceptStatus={handleChangePriority}
                status={order.status}
                order={order}
              />
            )}
            {canEdit && (
              <>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem 
                  onClick={handleEdit}
                  sx={{ my: 1, py: 1 }}
                >
                  <ListItemIcon>
                    <EditIcon />
                  </ListItemIcon>{" "}
                  {t("common.edit")}
                </MenuItem>
              </>
            )}
          </Menu>
      </TableCell>
    </TableRow>
  );
};

type OrderTableProps = {
  processing: boolean;
  onEdit: (order: Order) => void;
  onSelectedChange: (selected: string[]) => void;
  onAcceptStatus: (order: Order) => void;
  canChangeStatus: boolean;
  canEdit: boolean;
  selected: string[];
  type: string[];
  orders?: Order[];
};

const OrderTable = ({
  onEdit,
  onSelectedChange,
  onAcceptStatus,
  canChangeStatus,
  canEdit,
  processing,
  selected,
  type = [],
  orders = [],
}: OrderTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = selectUtils.selectAll(orders);
      onSelectedChange(newSelecteds);
      return;
    }
    onSelectedChange([]);
  };

  const handleClick = (id: string) => {
    let newSelected: string[] = selectUtils.selectOne(selected, id);
    onSelectedChange(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;
  const checkType = type[0] !== "all" ? (orders.filter(order => type.includes(order.status))) : ([1]);

  if (orders.length === 0 || checkType.length === 0) {
    return <Empty title="Nie ma żadnych zapotrzebowań" />;
  }
  return(
    <React.Fragment>
      <TableContainer>
        <Table
          aria-labelledby="tableTitle"
          sx={{
            minWidth: 600,
            borderCollapse: "separate",
            borderSpacing: "0 1rem",
          }}
        >
          <EnhancedTableHead
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={orders.length}
          />
          <TableBody>
              {orders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .filter(order => type.includes(order.status) || type[0] === "all")
                .map((order, index) => (
                  <OrderRow
                    index={index}
                    key={order.id}
                    onCheck={handleClick}
                    onEdit={onEdit}
                    onAcceptStatus={onAcceptStatus}
                    canChangeStatus={canChangeStatus}
                    canEdit={canEdit}
                    processing={processing}
                    selected={isSelected(order.id)}
                    order={order}
                  />
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={orders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </React.Fragment>
  );
};

export default OrderTable;