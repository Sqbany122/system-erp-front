import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import Autocomplete from '@material-ui/core/Autocomplete';
import { Pipeline } from "../types/pipeline";
import { useUsers } from "../../users/hooks/useUsers";
import { useCompanies } from "../../companies/hooks/useCompanies";
import { useUpdatePipelineStatus } from "../hooks/useUpdatePipelineStatus";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";

type ChangeStatusDialogProps = {
  onClose: () => void;
  open: boolean;
  processing: boolean;
  pipeline?: Pipeline;
};

const PipelineChangeStatusDialog = ({
  onClose,
  open,
  processing,
  pipeline,
}: ChangeStatusDialogProps) => {
  const { t } = useTranslation();
  const snackbar = useSnackbar();
  const users = useUsers();
  const companies = useCompanies();
  const { isChangingStatus, updatePipelineStatus } = useUpdatePipelineStatus();

  processing = isChangingStatus;

  const editMode = Boolean(pipeline && pipeline.id);


  const handleSubmit = (values) => {
    updatePipelineStatus({...values, pipelineId: pipeline?.id, status: 5})
    .then(() => {
      snackbar.success(
        t("pipelineManagement.notifications.changeStatusSuccess")
      );
      onClose();
    })
    .catch(() => {
      snackbar.error(t("common.errors.unexpected.subTitle"));
    });
  };

  
  const formik = useFormik({
    initialValues: {
      company: "",
      owner: "",
    },
    validationSchema: Yup.object({
      company: Yup.string().required(t("common.validations.required")),
      owner: Yup.string().required(t("common.validations.required")),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="pipeline-dialog-title">
      {!users.isLoading && !companies.isLoading && users.data && companies.data && (
        <form onSubmit={formik.handleSubmit} noValidate>
          <DialogTitle id="pipeline-dialog-title">
            {editMode
              ? t("pipelineManagement.modal.edit.title")
              : t("pipelineManagement.modal.add.title")}
          </DialogTitle>
          <DialogContent>
            <Autocomplete
              disablePortal
              fullWidth
              options={companies.data}
              defaultValue={companies.data.find(v => v.name === formik.values.company && (v.id))}
              onChange={(e, value) => formik.setFieldValue("company", value?.id || "")}
              getOptionLabel={(option) => option.name.toString()}
              sx={{ mb: 3, minWidth: 350 }}
              renderInput={
                (params) => 
                <TextField 
                  {...params} 
                  id="company" 
                  name="company" 
                  required
                  value={formik.values.company}
                  error={formik.touched.company && Boolean(formik.errors.company)}
                  helperText={formik.touched.company && formik.errors.company}
                  label={t("projectManagement.form.company.label")} 
                />
              }
            />
            <Autocomplete
              disablePortal
              fullWidth
              options={users.data}
              defaultValue={users.data.find(v => v.id === formik.values.owner && (v.id))}
              onChange={(e, value) => formik.setFieldValue("owner", value?.id || "")}
              getOptionLabel={(option) => option.firstname.toString() + " " + option.lastname.toString()}
              sx={{ mt: 1, minWidth: 350 }}
              renderInput={
                (params) => 
                <TextField 
                  {...params} 
                  id="owner" 
                  name="owner" 
                  required
                  value={formik.values.owner}
                  error={formik.touched.owner && Boolean(formik.errors.owner)}
                  helperText={formik.touched.owner && formik.errors.owner}
                  label={t("projectManagement.form.owner.label")} 
                />
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>{t("common.cancel")}</Button>
            <LoadingButton loading={processing} type="submit" variant="contained">
              {editMode
                ? t("pipelineManagement.modal.edit.action")
                : t("pipelineManagement.modal.add.action")}
            </LoadingButton>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
};

export default PipelineChangeStatusDialog;
