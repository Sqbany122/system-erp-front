import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { File } from '../types/file';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

type FilesComponentProps = {
    files?: File[];
}

const FilesComponent = ({
    files = []
}: FilesComponentProps) => {
    
    return (
        <React.Fragment>
            <Box>
                <Grid container spacing={2}>
                    {files && (
                        files.map(file => (
                            <Grid item xs={2} sm={2} md={2} sx={{ minWidth: 250, maxHeight: 200, minHeight: 200, textAlign: 'center', mb: 5 }}>
                                <Box sx={{ borderRadius: '.50rem', height: '100%', width: '100%', boxShadow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightgrey' }}>
                                    {file.extension == "png" || file.extension == "jpg" || file.extension == "jpeg" ? (
                                        <img style={{ width: '100%', objectFit: 'none', height: '100%', borderRadius: '.50rem' }} src={process.env.REACT_APP_BACKEND_URL + "/image/" + file.path} />
                                    ) : (
                                        <InsertDriveFileIcon sx={{ fontSize: '7rem' }}/>
                                    )}
                                </Box>
                                <Tooltip title={file.original_name}>
                                    <Typography sx={{ mt: 1 }}>
                                        {file.original_name && (
                                            file.original_name.length > 20 ? (
                                                <b>{file.original_name.substring(0, 13) + "..." + " (" + file.extension.toUpperCase() + ")"}</b>
                                            ) : (
                                                <b>{file.original_name + " (" + file.extension.toUpperCase() + ")"}</b>
                                            )
                                        )}
                                    </Typography>
                                </Tooltip>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Box>
        </React.Fragment>
    )
}

export default FilesComponent;