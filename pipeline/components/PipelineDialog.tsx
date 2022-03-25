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
import { Pipeline } from "../types/pipeline";

type RoleDialogProps = {
  onAdd: (pipeline: Partial<Pipeline>) => void;
  onClose: () => void;
  onUpdate: (pipeline: Pipeline) => void;
  open: boolean;
  processing: boolean;
  pipeline?: Pipeline;
};

const PipelineDialog = ({
  onAdd,
  onClose,
  onUpdate,
  open,
  processing,
  pipeline,
}: RoleDialogProps) => {
  const { t } = useTranslation();

  const editMode = Boolean(pipeline && pipeline.id);

  const handleSubmit = (values: Partial<Pipeline>) => {
    if(pipeline && pipeline.id) {
      onUpdate({ ...values, id: pipeline.id } as Pipeline);
    } else {
      onAdd(values);
    }
  };

  
  const formik = useFormik({
    initialValues: {
      nip: pipeline ? pipeline.name : "",
    },
    validationSchema: Yup.object({
      nip: Yup.string().required(t("common.validations.required")),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="pipeline-dialog-title">
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="pipeline-dialog-title">
          {editMode
            ? t("pipelineManagement.modal.edit.title")
            : t("pipelineManagement.modal.add.title")}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            id="nip"
            label={t("pipelineManagement.form.nip.label")}
            name="nip"
            autoFocus
            disabled={processing}
            value={formik.values.nip}
            onChange={formik.handleChange}
            error={formik.touched.nip && Boolean(formik.errors.nip)}
            helperText={formik.touched.nip && formik.errors.nip}
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
    </Dialog>
  );
};

export default PipelineDialog;
