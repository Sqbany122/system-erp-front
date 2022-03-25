import React, { useState } from 'react';
import { useParams } from 'react-router-dom'
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import { useTranslation } from "react-i18next";
import { useFiles } from '../hooks/useFiles';
import FilesComponent from '../components/FilesComponent';

const FilesManagement = () => {
    const { model, id } = useParams();
    const { t } = useTranslation();
    const { data } = useFiles(id, model);

    return (
        <React.Fragment>
            <AdminAppBar>
                <AdminToolbar goBack={true} title={t("filesManagement.toolbar.title")} />
            </AdminAppBar>
            <FilesComponent 
                files={data}
            />
        </React.Fragment>
    )
}

export default FilesManagement;