import React from 'react';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { AdditionalInfo } from "../types/additional_info";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";

type PipelineAdditionalInfoDialogProps = {
    open: boolean;
    onClose: () => void;
    onUpdate: (additionalInfo: Partial<AdditionalInfo>) => void;
    pipelineId: string;
    processing: boolean;
    additionalInfo?: AdditionalInfo;
};

const PipelineAdditionalInfo = ({
    open,
    onClose,
    onUpdate,
    pipelineId,
    processing,
    additionalInfo,
}: PipelineAdditionalInfoDialogProps) => {
    const { t } = useTranslation();
    const snackbar = useSnackbar();

    const handleSubmit = (values: Partial<AdditionalInfo>) => {
        onUpdate({...values, pipeline: pipelineId} as AdditionalInfo);
    };

    const formik = useFormik({
    initialValues: {
        contact_person: additionalInfo ? additionalInfo.contact_person : "",
        phone: additionalInfo ? additionalInfo.phone : "",
        email: additionalInfo ? additionalInfo.email : "",
        address: additionalInfo ? additionalInfo.address : "",
        city: additionalInfo ? additionalInfo.city : "",
        postal_code: additionalInfo ? additionalInfo.postal_code : "",
        note: additionalInfo ? additionalInfo.note : "",
    },
    validationSchema: Yup.object({
        contact_person: Yup.string().nullable(),
        phone: Yup.string().nullable(),
        email: Yup.string().email(t("common.validations.email")).nullable(),
        address: Yup.string().nullable(),
        city: Yup.string().nullable(),
        postal_code: Yup.string().nullable(),
        note: Yup.string().nullable(),
    }),
    onSubmit: handleSubmit,
    });

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="pipeline-dialog-title">
            <form onSubmit={formik.handleSubmit} noValidate>
                <DialogTitle id="pipeline-dialog-title">
                    {t("pipelineManagement.modal.edit.additional_info")}
                </DialogTitle>
                <DialogContent>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="contact_person"
                    label={t("singlePipelineManagement.pipeline_additional_data.contact_person")}
                    name="contact_person"
                    autoFocus
                    value={formik.values.contact_person}
                    onChange={formik.handleChange}
                    error={formik.touched.contact_person && Boolean(formik.errors.contact_person)}
                    helperText={formik.touched.contact_person && formik.errors.contact_person}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="phone"
                    label={t("singlePipelineManagement.pipeline_additional_data.phone")}
                    name="phone"
                    autoFocus
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label={t("singlePipelineManagement.pipeline_additional_data.email")}
                    name="email"
                    autoFocus
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.contact_person && formik.errors.email}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="address"
                    label={t("singlePipelineManagement.pipeline_additional_data.address")}
                    name="address"
                    autoFocus
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={formik.touched.address && Boolean(formik.errors.address)}
                    helperText={formik.touched.address && formik.errors.address}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="city"
                    label={t("singlePipelineManagement.pipeline_additional_data.city")}
                    name="city"
                    autoFocus
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    helperText={formik.touched.city && formik.errors.city}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="postal_code"
                    label={t("singlePipelineManagement.pipeline_additional_data.postal_code")}
                    name="postal_code"
                    autoFocus
                    value={formik.values.postal_code}
                    onChange={formik.handleChange}
                    error={formik.touched.postal_code && Boolean(formik.errors.postal_code)}
                    helperText={formik.touched.postal_code && formik.errors.postal_code}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="note"
                    label={t("singlePipelineManagement.pipeline_additional_data.note")}
                    name="note"
                    autoFocus
                    multiline
                    rows={4}
                    value={formik.values.note}
                    onChange={formik.handleChange}
                    error={formik.touched.note && Boolean(formik.errors.note)}
                    helperText={formik.touched.note && formik.errors.note}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={onClose}>{t("common.cancel")}</Button>
                <LoadingButton type="submit" loading={processing} variant="contained">
                    {t("pipelineManagement.modal.edit.action")}
                </LoadingButton>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default PipelineAdditionalInfo;