import React from 'react';
import { useParams } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar"
import Loader from "../../core/components/Loader";
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Chip from "@material-ui/core/Chip";
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import FileUploadIcon from '@material-ui/icons/FileUpload';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Comment } from "../types/comment";
import { File } from "../types/file";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { useSingleOrder } from "../hooks/singleOrder/useSingleOrder";
import { useComments } from "../hooks/singleOrder/useComments";
import { useProjects } from "../../projects/hooks/useProjects";
import { useAddComment } from "../hooks/singleOrder/useAddComment";
import { useFiles } from "../hooks/singleOrder/useFiles";
import { useAddFile } from "../hooks/singleOrder/useAddFile";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import DownloadIcon from '@material-ui/icons/Download';
import IconButton from '@material-ui/core/IconButton';
import { useCanAccess } from '../../core/hooks/useCanAccess';

const SingleOrderManagement = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const snackbar = useSnackbar();
    const { data, isFetching } = useSingleOrder(id);
    const { addComment } = useAddComment();
    const { addFile } = useAddFile();
    const comments = useComments(id);
    const files = useFiles(id);
    const projects = useProjects();
    const tooltipDownload = t("tooltip.download");

    const handleSubmit = (values: Partial<Comment>, {resetForm}) => {
        addComment({...values, order: id} as Comment)
            .then(() => {
                resetForm({})
                snackbar.success(
                    t("singleOrderManagement.notifications.addSuccess")
                );
            })
            .catch(() => {
                snackbar.error(t("common.errors.unexpected.subTitle"));
        });
    };

    const handleSubmitFile = (values: Partial<File>, {resetForm}) => {
        addFile({...values, order: id} as File)
            .then(() => {
                resetForm({})
                snackbar.success(
                    t("singleOrderManagement.notifications.addSuccess")
                );
            })
            .catch(() => {
                snackbar.error(t("common.errors.unexpected.subTitle"));
            });
    };

    const formik = useFormik({
        initialValues: {
          comment: "",
        },
        validationSchema: Yup.object({
          comment: Yup.string().required(t("common.validations.required")),
        }),
        onSubmit: handleSubmit,
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

    const downloadFile = (fileName) => {
        window.location.href = "http://127.0.0.1:8000/files/order_files/" + fileName;
    }

    const can_access_add_comment = useCanAccess('orders_add_comment');
    const can_access_add_file = useCanAccess('orders_add_file');

    if (isFetching && comments.isFetching && files.isFetching) {
        return(
            <Loader />
        )
    } else {
        return(
            <React.Fragment>
                <AdminAppBar>
                    <AdminToolbar goBack={true} title={t("singleOrderManagement.toolbar.title") +  " #" + data?.id} />
                </AdminAppBar>
                <Box sx={{ width: '100%', height: '100%' }}>
                    <Grid container spacing={4}>
                        <Grid item xs={6}>
                            <Paper sx={{ p: 2, minHeight: 300 }}>
                                <Typography sx={{ mb: 2, fontSize: '1.5rem' }}><b>{t("singleOrderManagement.grid_title.contracting_authority") + ":"}</b></Typography>
                                <Typography sx={{ m: 1 }}>
                                    <b>{t("singleOrderManagement.ordering_data.contracting_authority")}:</b> {data?.owner}
                                </Typography>
                                <Typography sx={{ m: 1 }}>
                                    <b>{t("singleOrderManagement.ordering_data.email")}:</b> {data?.email}
                                </Typography>
                                <Typography sx={{ m: 1 }}>
                                    <b>{t("singleOrderManagement.ordering_data.date_add")}:</b> {data?.created_at}
                                </Typography>
                                <Typography sx={{ m: 1 }}>
                                    <b>{t("singleOrderManagement.ordering_data.edit_date")}:</b> {data?.updated_at}
                                </Typography>
                                <Typography sx={{ m: 1 }}>
                                    <b>{t("singleOrderManagement.ordering_data.status")}:</b> <Chip color="primary" label={t("orderManagement.statuses." + data?.status)} />
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>                       
                            <Paper sx={{ p: 2, minHeight: 300 }}>
                            <Typography sx={{ mb: 2, fontSize: '1.5rem' }}><b>{t("singleOrderManagement.grid_title.order_data") + ":"}</b></Typography>
                                <Typography sx={{ m: 1 }}>
                                    <b>{t("singleOrderManagement.order_data.order_category")}:</b> {data?.order_category}
                                </Typography>
                                <Typography sx={{ m: 1 }}>
                                    <b>{t("singleOrderManagement.order_data.project")}:</b>{" "}
                                    {!projects.isLoading && projects.data && (
                                        projects.data.filter(project => project.id == data?.project).map(filtered => filtered.name)
                                    )}
                                </Typography>
                                <Typography sx={{ m: 1 }}>
                                    <b>{t("singleOrderManagement.order_data.name")}:</b> {data?.name}
                                </Typography>
                                <Typography sx={{ m: 1 }}>
                                    <b>{t("singleOrderManagement.order_data.description")}:</b> {data?.description}
                                </Typography>
                                <Typography sx={{ m: 1 }}>
                                    <b>{t("singleOrderManagement.order_data.price")}:</b> {data?.orginal_price ? (
                                            data?.price + " PLN (" + data?.orginal_price + " " + data?.currency_name + ")"
                                        ) : (
                                            data?.price + " " + data?.currency_name
                                        )}
                                </Typography>
                                <Typography sx={{ m: 1 }}>
                                    <b>{t("singleOrderManagement.order_data.priority")}:</b> {data?.priority}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper sx={{ p: 2 }}>
                            <Typography sx={{ mb: 2, fontSize: '1.5rem' }}><b>{t("singleOrderManagement.grid_title.comments") + ":"}</b></Typography>
                                {!comments.isLoading && comments.data && comments.data.length !== 0 ? (
                                    <Box sx={{ mb: 3, px: 1 }}>
                                        {comments.data.map((comment, index, {length}) => (
                                            <Box>
                                                <Typography sx={{ fontWeight: 600, mb: 0.5 }}>{comment.owner} - {comment.created_at}</Typography>
                                                <Typography sx={{ px: 1 }}>{comment.comment}</Typography>
                                                {index + 1 !== length && (
                                                    <Divider sx={{ my: 1 }} />
                                                )}
                                            </Box>
                                        ))}
                                    </Box>
                                ) : (
                                    <Box sx={{ mb: 2, px: 1 }}>
                                        Brak komentarzy
                                    </Box>
                                )}
                                {can_access_add_comment && (
                                    <form onSubmit={formik.handleSubmit} noValidate>
                                        <TextField
                                            placeholder={t("singleOrderManagement.placeholders.add_comment")}
                                            multiline
                                            id="comment"
                                            name="comment"
                                            value={formik.values.comment}
                                            rows={4}
                                            fullWidth
                                            sx={{ mb: 2 }}
                                            onChange={formik.handleChange}
                                        />
                                        <LoadingButton type="submit" variant="contained">
                                            {t("orderManagement.modal.add.action")}
                                        </LoadingButton>
                                    </form>
                                )}
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper sx={{ p: 2 }}>
                            <Typography sx={{ mb: 2, fontSize: '1.5rem' }}><b>{t("singleOrderManagement.grid_title.files") + ":"}</b></Typography>
                                <Grid sx={{ mt: 1, mb: 2 }} item xs={12}>
                                    {!files.isLoading && files.data && files.data.length !== 0 ? (
                                        <List>
                                            {files.data.map(file => (
                                                <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                    <FolderIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={file.file_description + " (" + file.file_extension + ")"}
                                                    secondary={file.owner}
                                                />
                                                <Tooltip title={tooltipDownload}>
                                                    <IconButton 
                                                        edge="end" 
                                                        onClick={() => downloadFile(file.file_path)}
                                                    >
                                                        <DownloadIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                </ListItem>
                                            ))}
                                        </List>
                                    ) : (
                                        <Box sx={{ mb: 2, px: 1 }}>
                                            Brak plików
                                        </Box>
                                    )}
                                </Grid>
                                {can_access_add_file && (
                                    <form onSubmit={formikUploadFile.handleSubmit} noValidate>
                                        <TextField
                                            placeholder={t("singleOrderManagement.placeholders.file_description")}
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
                                        <label htmlFor="file">
                                            <Button variant="contained" component="span">
                                                <FileUploadIcon sx={{ mr: 1 }} /> {t("common.upload")}
                                            </Button>
                                        </label>
                                        <LoadingButton sx={{ ml: 2 }} type="submit" variant="contained">
                                            {t("orderManagement.modal.add.action")}
                                        </LoadingButton>
                                    </form> 
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </React.Fragment>
        ) 
    }   
}

export default SingleOrderManagement;