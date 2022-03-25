import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';
import LoadingButton from "@material-ui/lab/LoadingButton";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { Order } from "../types/order";

type PriorityOrderDialogProps = {
    onUpdate: (order: Order) => void;
    onClose: () => void;
    open: boolean;
    processing: boolean;
    order?: Order;
};

const PriorityOrderDialog = ({
    onUpdate,
    onClose,
    open,
    processing,
    order,
}: PriorityOrderDialogProps) => {
  const { t } = useTranslation();

  const handleSubmit = (values: Partial<Order>) => {
    if(order && order.id) {
      onUpdate({ ...values, id: order.id, status: "accepted"} as Order);
    }
  };

  const marks = [
    {
      value: 1,
      label: '1',
    },
    {
      value: 2,
      label: '2',
    },
    {
      value: 3,
      label: '3',
    },
    {
      value: 4,
      label: '4',
    },
    {
      value: 5,
      label: '5',
    },
    {
      value: 6,
      label: '6',
    },
    {
      value: 7,
      label: '7',
    },
    {
      value: 8,
      label: '8',
    },
    {
      value: 9,
      label: '9',
    },
    {
      value: 10,
      label: '10',
    },
  ];
  
  const formik = useFormik({
    initialValues: {
      priority: order ? order.priority : "",
    },
    validationSchema: Yup.object({
        priority: Yup.string(),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="order-dialog-title">
        <form onSubmit={formik.handleSubmit} noValidate>
          <DialogTitle id="order-dialog-title">
              {t("orderManagement.modal.priority.title")}
          </DialogTitle>
          <DialogContent>
            <Box
               sx={{ minWidth: 400 }}
            >
              <Slider
                defaultValue={order ? parseInt(order.priority) : parseInt("1")}
                step={1}
                marks={marks}
                min={1}
                max={10}
                disabled={processing}
                onChange={(e, value) => formik.setFieldValue("priority", value || "")}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>{t("common.cancel")}</Button>
            <LoadingButton loading={processing} type="submit" variant="contained">
              {t("orderManagement.modal.priority.action")}
            </LoadingButton>
          </DialogActions>
        </form>
    </Dialog>
  );
};

export default PriorityOrderDialog;
