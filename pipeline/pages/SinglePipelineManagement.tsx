import React, { useState } from 'react';
import { useParams } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import Loader from "../../core/components/Loader";
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Chip from "@material-ui/core/Chip";
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FileUploadIcon from '@material-ui/icons/FileUpload';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Comment } from "../types/comment";
import { File } from "../types/file";
import EditIcon from "@material-ui/icons/Edit";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { useSinglePipeline } from "../hooks/singlePipeline/useSinglePipeline";
import { useAddComment } from "../hooks/singlePipeline/useAddComment";
import { useFiles } from "../hooks/singlePipeline/useFiles";
import { useAddFile } from "../hooks/singlePipeline/useAddFile";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import DownloadIcon from '@material-ui/icons/Download';
import IconButton from '@material-ui/core/IconButton';
import PipelineAdditionalInfo from '../components/PipelineAdditionalInfoDialog';
import { useUpdatePipelineAdditionalInfo } from "../hooks/singlePipeline/useUpdatePipelineAdditionalInfo";
import { useCanAccess } from '../../core/hooks/useCanAccess';
import { useUsers } from "../../users/hooks/useUsers";
import { AdditionalInfo } from "../types/additional_info";

const SinglePipelineManagement = () => {
    const [openPipelineAdditionalInfoDialog, setOpenPipelineAdditionalInfoDialog] = useState(false);
    const { id } = useParams();
    const { t } = useTranslation();
    const { isFetching, data } = useSinglePipeline(id);
    const { isAddingComment, addComment } = useAddComment();
    const { isAddingFile, addFile } = useAddFile();
    const { isUpdating, updatePipelineAdditionalInfo } = useUpdatePipelineAdditionalInfo();
    const snackbar = useSnackbar();

    const files = useFiles(id);
    const users = useUsers();

    // tooltips for buttons
    const tooltipEdit = t("tooltip.edit");
    const tooltipDownload = t("tooltip.download");

    // check if any fetch is in progress
    const processing = isUpdating || isAddingFile || isAddingComment;

    // permissions
    const canAccessEditSinglePipeline = useCanAccess('pipelines_single_edit');
    const canAccessAddComment = useCanAccess('pipelines_single_add_comment');
    const canAccessAddFile = useCanAccess('pipelines_single_add_file');
    const canAccessDownloadFile = useCanAccess('pipelines_single_download_file');

    // handle open and close AdditionalInfo dialog
    const handleOpenEditAdditionalInfo = () => {
        setOpenPipelineAdditionalInfoDialog(true);
    }

    const handleCloseEditAdditionalInfo = () => {
        setOpenPipelineAdditionalInfoDialog(false);
    }

    const handleSubmitEditAdditionalInfo = (values: Partial<AdditionalInfo>) => { // edit additional info handler
        updatePipelineAdditionalInfo(values as AdditionalInfo)
        .then(() => {
            snackbar.success(
                t("singlePipelineManagement.notifications.updateAdditionalInfoSuccess")
            );
            handleCloseEditAdditionalInfo();
        })
        .catch(() => {
            snackbar.error(t("common.errors.unexpected.subTitle"));
        });
    }

    const handleSubmitComment = (values: Partial<Comment>, {resetForm}) => { // add comment handler
        addComment({...values, pipeline: id} as Comment)
            .then(() => {
                resetForm({})
                snackbar.success(
                    t("singlePipelineManagement.notifications.addCommentSuccess")
                );
            })
            .catch(() => {
                snackbar.error(t("common.errors.unexpected.subTitle"));
        });
    };

    const handleSubmitFile = (values: Partial<File>, {resetForm}) => { // add file handler
        addFile({...values, pipeline: id} as File)
            .then(() => {
                resetForm({})
                snackbar.success(
                    t("singlePipelineManagement.notifications.addFileSuccess")
                );
            })
            .catch(() => {
                snackbar.error(t("common.errors.unexpected.subTitle"));
        });
    };

    const formik = useFormik({
        initialValues: {
          comment: "",
          private: false,
        },
        validationSchema: Yup.object({
          comment: Yup.string().required(t("common.validations.required")),
          private: Yup.string().nullable(),
        }),
        onSubmit: handleSubmitComment,
    });

    const formikUploadFile = useFormik({
        initialValues: {
          file: "",
          file_description: "",
        },
        validationSchema: Yup.object({
          file: Yup.string().required(t("common.validations.required")),
          file_description: Yup.string().required(t("common.validations.required")),
        }),
        onSubmit: handleSubmitFile,
    });

    const downloadFile = (fileName) => { // download single file function
        window.location.href = "http://127.0.0.1:8000/files/pipeline_files/" + fileName;
    }

    if (isFetching && files.isFetching) {
        return(
            <Loader />
        )
    } else {
        return(
            <React.Fragment>
                <AdminAppBar>
                    <AdminToolbar goBack={true} title={t("singlePipelineManagement.toolbar.title") +  " #" + data?.id} />
                </AdminAppBar>
                <Box sx={{ width: '100%', height: '100%' }}>
                    <Grid container spacing={4}>
                        <Grid item xs={6}>
                            <Paper sx={{ p: 2, minHeight: 320 }}>
                                <Typography sx={{ mb: 2, fontSize: '1.5rem' }}><b>{t("singlePipelineManagement.grid_title.company_info") + ":"}</b></Typography>
                                <Typography sx={{ m: 1 }}>
                                    <b>{t("singlePipelineManagement.pipeline_data.company_name")}:</b> {data?.name}
                                </Typography>
                                <Typography sx={{ m: 1 }}>
                                    <b>{t("singlePipelineManagement.pipeline_data.street")}:</b> {data?.gus_data ? (data.gus_data.Ulica) : ("")}
                                </Typography>
                                <Typography sx={{ m: 1 }}>
                                    <b>{t("singlePipelineManagement.pipeline_data.city")}:</b> {data?.gus_data ? (data.gus_data.Miejscowosc) : ("")}
                                </Typography>
                                <Typography sx={{ m: 1 }}>
                                    <b>{t("singlePipelineManagement.pipeline_data.postal_code")}:</b> {data?.gus_data ? (data.gus_data.KodPocztowy) : ("")}
                                </Typography>
                                <Typography sx={{ m: 1 }}>
                                    <b>{t("singlePipelineManagement.pipeline_data.nip")}:</b> {data?.nip}
                                </Typography>
                                <Typography sx={{ m: 1 }}>
                                    <b>{t("singlePipelineManagement.pipeline_data.regon")}:</b> {data?.gus_data ? (data.gus_data.Regon) : ("")}
                                </Typography>
                                <Typography sx={{ m: 1 }}>
                                    <b>{t("singlePipelineManagement.pipeline_data.status")}:</b> 
                                    <Chip 
                                        color="primary" 
                                        label={t("pipelineManagement.statuses." + data?.status)} 
                                        sx={{ ml: 1 }}
                                    />
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>                       
                            <Paper sx={{ p: 2, minHeight: 320 }}>
                            <Box>
                                <Typography sx={{ mb: 2, fontSize: '1.5rem', width: '100%' }}>
                                    <b>{t("singlePipelineManagement.grid_title.company_additional_info") + ":"}</b>
                                {canAccessEditSinglePipeline && (    
                                    <Tooltip title={tooltipEdit}>    
                                        <IconButton
                                            sx={{ float: 'right' }}
                                            onClick={handleOpenEditAdditionalInfo}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                </Typography>
                            </Box>
                                {data?.additional_info && (
                                    <>
                                        <Typography sx={{ m: 1 }}>
                                            <b>{t("singlePipelineManagement.pipeline_additional_data.contact_person")}:</b>{" "}
                                            {data.additional_info.contact_person ? (
                                                data.additional_info.contact_person
                                            ) : ("")}
                                        </Typography>
                                        <Typography sx={{ m: 1 }}>
                                            <b>{t("singlePipelineManagement.pipeline_additional_data.phone")}:</b>{" "}
                                            {data.additional_info.phone ? (
                                                data.additional_info.phone
                                            ) : ("")}
                                        </Typography>
                                        <Typography sx={{ m: 1 }}>
                                            <b>{t("singlePipelineManagement.pipeline_additional_data.email")}:</b>{" "}
                                            {data.additional_info.email ? (
                                                data.additional_info.email
                                            ) : ("")}
                                        </Typography>
                                        <Typography sx={{ m: 1 }}>
                                            <b>{t("singlePipelineManagement.pipeline_additional_data.address")}:</b>{" "}
                                            {data.additional_info.address ? (
                                                data.additional_info.address
                                            ) : ("")}
                                        </Typography>
                                        <Typography sx={{ m: 1 }}>
                                            <b>{t("singlePipelineManagement.pipeline_additional_data.city")}:</b>{" "}
                                            {data.additional_info.city ? (
                                                data.additional_info.city
                                            ) : ("")}
                                        </Typography>
                                        <Typography sx={{ m: 1 }}>
                                            <b>{t("singlePipelineManagement.pipeline_additional_data.postal_code")}:</b>{" "}
                                            {data.additional_info.postal_code ? (
                                                data.additional_info.postal_code
                                            ) : ("")}
                                        </Typography>
                                        <Typography sx={{ m: 1 }}>
                                            <b>{t("singlePipelineManagement.pipeline_additional_data.note")}:</b>{" "}
                                            {data.additional_info.note ? (
                                                data.additional_info.note
                                            ) : ("")}
                                        </Typography>
                                    </>
                                )}
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper sx={{ p: 2 }}>
                            <Typography sx={{ mb: 2, fontSize: '1.5rem' }}><b>{t("singlePipelineManagement.grid_title.comments") + ":"}</b></Typography>
                                {data?.comments ? (
                                    <Box sx={{ mb: 3, px: 1 }}>
                                        {data.comments.map((comment, index, {length}) => (
                                            <Box>
                                                <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    {comment.owner} - {comment.created_at} 
                                                    {comment.private == "1" && (
                                                        <Chip 
                                                            label={t("singlePipelineManagement.comments.private")} 
                                                            color="primary" 
                                                            sx={{ ml: 2 }}
                                                        />
                                                    )}
                                                </Typography>
                                                <Typography sx={{ px: 1 }}>{comment.comment}</Typography>
                                                {index + 1 !== length && (
                                                    <Divider sx={{ my: 1 }} />
                                                )}
                                            </Box>
                                        ))}
                                    </Box>
                                ) : (
                                    <Box sx={{ mb: 2, px: 1 }}>
                                        {t("singlePipelineManagement.comments.no_comments")} 
                                    </Box>
                                )}
                                {canAccessAddComment && (
                                    <form onSubmit={formik.handleSubmit} noValidate>
                                        <TextField
                                            placeholder={t("singlePipelineManagement.placeholders.add_comment")}
                                            multiline
                                            id="comment"
                                            name="comment"
                                            value={formik.values.comment}
                                            rows={4}
                                            fullWidth
                                            sx={{ mb: 1 }}
                                            onChange={formik.handleChange}
                                        />
                                        <FormGroup>
                                            <FormControlLabel 
                                            control={
                                            <Checkbox 
                                                value={formik.values.private}
                                                id="private"
                                                name="private"
                                                onChange={formik.handleChange}
                                                inputProps={{ 'aria-label': 'controll' }}
                                            />
                                            } 
                                            sx={{ mb: 2 }}
                                            label={t("singlePipelineManagement.comments.private_comment")}
                                            />
                                        </FormGroup>
                                        <LoadingButton type="submit" loading={processing} variant="contained">
                                            {t("pipelineManagement.modal.add.action")}
                                        </LoadingButton>
                                    </form>
                                )}
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper sx={{ p: 2 }}>
                            <Typography sx={{ mb: 2, fontSize: '1.5rem' }}><b>{t("singlePipelineManagement.grid_title.files") + ":"}</b></Typography>
                                <Grid sx={{ mt: 1, mb: 2 }} item xs={12}>
                                    {data?.files ? (
                                        <List>
                                            {data?.files.map(file => (
                                                <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                    <FolderIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={file.file_description + " (" + file.file_extension + ")"}
                                                    secondary={
                                                        !users.isLoading && users.data && (
                                                            users.data.map(user => (
                                                                file.owner == user.id && (
                                                                user.firstname + " " + user.lastname 
                                                                )
                                                            )) 
                                                        )
                                                    }
                                                />
                                                {canAccessDownloadFile && (
                                                    <Tooltip title={tooltipDownload}>
                                                        <IconButton 
                                                            edge="end" 
                                                            onClick={() => downloadFile(file.file_path)}
                                                        >
                                                            <DownloadIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                </ListItem>
                                            ))}
                                        </List>
                                    ) : (
                                        <Box sx={{ mb: 2, px: 1 }}>
                                            {t("singlePipelineManagement.files.no_files")} 
                                        </Box>
                                    )}
                                </Grid>
                                {canAccessAddFile && (
                                    <form onSubmit={formikUploadFile.handleSubmit} noValidate>
                                        <TextField
                                            placeholder={t("singlePipelineManagement.placeholders.file_description")}
                                            multiline
                                            id="file_description"
                                            name="file_description"
                                            value={formikUploadFile.values.file_description}
                                            rows={2}
                                            fullWidth
                                            sx={{ mb: 2 }}
                                            onChange={formikUploadFile.handleChange}
                                        />
                                        <input
                                            accept="*"
                                            id="file"
                                            name="file"
                                            type="file"
                                            onChange={(event) => {
                                                formikUploadFile.setFieldValue("file", (event.currentTarget.files ? event.currentTarget.files[0] : ""))
                                            }}
                                            style={{ display: 'none' }}
                                        />
                                        <span></span>
                                        <label htmlFor="file">
                                            <Button variant="contained" component="span">
                                                <FileUploadIcon sx={{ mr: 1 }} /> {t("common.upload")}
                                            </Button>
                                        </label>
                                        <LoadingButton sx={{ ml: 2 }} type="submit" loading={processing} variant="contained">
                                            {t("pipelineManagement.modal.add.action")}
                                        </LoadingButton>
                                    </form> 
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
                {openPipelineAdditionalInfoDialog &&
                    <PipelineAdditionalInfo 
                        open={openPipelineAdditionalInfoDialog}
                        onClose={handleCloseEditAdditionalInfo}
                        onUpdate={handleSubmitEditAdditionalInfo}         
                        pipelineId={id}     
                        processing={processing}   
                        additionalInfo={data?.additional_info}
                    /> 
                }
            </React.Fragment>
        ) 
    }   
}

export default SinglePipelineManagement;