import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Autocomplete from '@material-ui/core/Autocomplete';
import LoadingButton from "@material-ui/lab/LoadingButton";
import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { Order } from "../types/order";
import { useCurrencies } from "../../currencies/hooks/useCurrencies";
import { useProjects } from "../../projects/hooks/useProjects";
import { useOrdersCategories } from "../../orders_categories/hooks/useOrdersCategories";
import Paper from "@material-ui/core/Paper";
import { useCanAccess } from "../../core/hooks/useCanAccess";

type RoleDialogProps = {
  onAdd: (order: Partial<Order>) => void;
  onClose: () => void;
  onUpdate: (order: Order) => void;
  open: boolean;
  processing: boolean;
  order?: Order;
};

const OrderDialog = ({
  onAdd,
  onClose,
  onUpdate,
  open,
  processing,
  order,
}: RoleDialogProps) => {
  const { t } = useTranslation();
  const currencies = useCurrencies();
  const projects = useProjects();
  const categories = useOrdersCategories();

  const editMode = Boolean(order && order.id);

  const handleSubmit = (values: Partial<Order>) => {
    categories.data?.map(category => (
      values.order_category === category.name && (
        values.order_category = category.id
      )
    ))

    if(order && order.id) {
      onUpdate({ ...values, id: order.id } as Order);
    } else {
      onAdd(values);
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
      name: order ? order.name : "",
      description: order ? order.description : "",
      price: order ? (order.orginal_price ? order.orginal_price : order.price) : "",
      currency: order ? order.currency: "",
      priority: order ? order.priority: "",
      project: order ? order.project : "",
      order_category: order ? order.order_category : "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("common.validations.required")),
      description: Yup.string().required(t("common.validations.required")),
      price: Yup.string().required(t("common.validations.required")),
      currency: Yup.string().required(t("common.validations.required")),
      project: Yup.string().required(t("common.validations.required")),
      order_category: Yup.string().required(t("common.validations.required")),
    }),
    onSubmit: handleSubmit,
  });

  const can_access_change_priority = useCanAccess('orders_change_priority');

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="order-dialog-title">
      {!projects.isLoading && !currencies.isLoading && !categories.isLoading && projects.data && currencies.data && categories.data && (
        <form onSubmit={formik.handleSubmit} noValidate>
          <DialogTitle id="order-dialog-title">
            {editMode
              ? t("orderManagement.modal.edit.title")
              : t("orderManagement.modal.add.title")}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label={t("orderManagement.form.name.label")}
              name="name"
              autoFocus
              disabled={processing}
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label={t("orderManagement.form.description.label")}
              name="description"
              disabled={processing}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="number"
              id="price"
              label={t("orderManagement.form.price.label")}
              name="price"
              disabled={processing}
              value={formik.values.price}
              onChange={formik.handleChange}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
            />
            <TextField
              margin="normal"
              required
              id="currency"
              fullWidth
              select
              label={t("orderManagement.form.currency.label")}
              name="currency"
              disabled={processing}
              value={formik.values.currency}
              onChange={formik.handleChange}
              error={formik.touched.currency && Boolean(formik.errors.currency)}
              helperText={formik.touched.currency && formik.errors.currency}
            >
              {currencies.data.map((currency) => (
                <MenuItem 
                  key={currency.id} 
                  value={currency.id}
                  sx={{ my: 1 }}
                >
                  {currency.name}
                </MenuItem>
              ))}
            </TextField>
            <Autocomplete
              fullWidth
              options={projects.data}
              PaperComponent={({ children }) => (
                <Paper 
                  style={{ boxShadow: "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)" }}
                >
                  {children}
                </Paper>
              )}
              defaultValue={projects.data.find(v => v.id === formik.values.project && (v.id))}
              onChange={(e, value) => formik.setFieldValue("project", value?.id || "")}
              getOptionLabel={(option) => option.name.toString()}
              sx={{ mt: 2 }}
              renderInput={
                (params) => 
                <TextField 
                  {...params} 
                  id="company" 
                  name="company" 
                  required
                  value={formik.values.project}
                  error={formik.touched.project && Boolean(formik.errors.project)}
                  helperText={formik.touched.project && formik.errors.project}
                  label={t("orderManagement.form.project.label")} 
                />
              }
            />
            <Autocomplete
              fullWidth
              options={categories.data}
              PaperComponent={({ children }) => (
                <Paper 
                  style={{ boxShadow: "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)" }}
                >
                  {children}
                </Paper>
              )}
              defaultValue={categories.data.find(v => v.name === formik.values.order_category && (v.id))}
              onChange={(e, value) => formik.setFieldValue("order_category", value?.id || "")}
              getOptionLabel={(option) => option.name.toString()}
              sx={{ mt: 3, mb: 1 }}
              renderInput={
                (params) => 
                <TextField 
                  {...params} 
                  id="order_category" 
                  name="order_category" 
                  required
                  value={formik.values.order_category}
                  error={formik.touched.order_category && Boolean(formik.errors.order_category)}
                  helperText={formik.touched.order_category && formik.errors.order_category}
                  label={t("orderManagement.form.category.label")} 
                />
              }
            />
            {editMode && can_access_change_priority && (
              <Box sx={{ mt: 3, px: 1 }}>
                <Typography id="input-slider" gutterBottom>
                {t("orderManagement.form.priority.label")} 
                </Typography>
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
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>{t("common.cancel")}</Button>
            <LoadingButton loading={processing} type="submit" variant="contained">
              {editMode
                ? t("orderManagement.modal.edit.action")
                : t("orderManagement.modal.add.action")}
            </LoadingButton>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
};

export default OrderDialog;
