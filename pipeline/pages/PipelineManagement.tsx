import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import React, { useState } from 'react';
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import ConfirmDialog from "../../core/components/ConfirmDialog";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import { useTranslation } from "react-i18next";
import { useAddPipeline } from "../hooks/useAddPipeline";
import { useUpdatePipeline } from "../hooks/useUpdatePipeline";
import { usePipelines } from "../hooks/usePipelines";
import { useUpdatePipelineStatus } from "../hooks/useUpdatePipelineStatus";
import PipelineTable from "../components/PipelineTable";
import PipelineDialog from "../components/PipelineDialog";
import PipelineStatusChangeDialog from "../components/PipelineStatusChangeDialog";
import { Pipeline } from "../types/pipeline";
import Tooltip from '@material-ui/core/Tooltip';
import { useCanAccess } from "../../core/hooks/useCanAccess";
import { Navigate } from "react-router-dom";

const PipelineManagement = () => {
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const [openConfirmChangeStatusDialog, setOpenConfirmChangeStatusDialog] = useState(false);
  const [openPipelineDialog, setOpenPipelineDialog] = useState(false);
  const [openPipelineChangeStatusDialog, setOpenPipelineChangeStatusDialog] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [statusChanged, setStatusChanged] = useState([] as any);
  const [pipelineUpdated, setPipelineUpdated] = useState<Pipeline | undefined>(undefined);

  const { addPipeline, isAdding } = useAddPipeline();
  const { isUpdating, updatePipeline } = useUpdatePipeline();
  const { isChangingStatus, updatePipelineStatus } = useUpdatePipelineStatus();

  const { data } = usePipelines();

  const tooltipAddPipeline = t("tooltip.add");

  // permissions
  const canAccessAddPipeline = useCanAccess("pipelines_add");
  const canAccessEditPipeline = useCanAccess("pipelines_edit");

  const processing = isAdding || isUpdating || isChangingStatus;

  const handleAddPipeline = async (pipeline: Partial<Pipeline>) => {
    addPipeline(pipeline as Pipeline)
      .then(() => {
        snackbar.success(
          t("pipelineManagement.notifications.addSuccess", {
            pipeline: `${pipeline.name}`,
          })
        );
        setOpenPipelineDialog(false);
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  const handleUpdatePipeline = async (pipeline: Pipeline) => {
    updatePipeline(pipeline)
      .then(() => {
        snackbar.success(
          t("pipelineManagement.notifications.updateSuccess", {
            pipeline: `${pipeline.name}`,
          })
        );
        setOpenPipelineDialog(false);
      })
      .catch(() => {
        snackbar.error(t("common.errors.unexpected.subTitle"));
      });
  };

  // add and update pipeline dialog
  const handleClosePipelineDialog = () => {
    setPipelineUpdated(undefined);
    setOpenPipelineDialog(false);
  }

  const handleOpenPipelineDialog = (pipeline?: Pipeline) => {
    setPipelineUpdated(pipeline);
    setOpenPipelineDialog(true);
  };

  // changes status dialog
  const handleClosePipelineChangeStatusDialog = () => {
    setOpenPipelineChangeStatusDialog(false);
  }

  const handleOpenPipelineChangeStatusDialog = (pipeline?: Pipeline) => {
    setPipelineUpdated(pipeline);
    setOpenPipelineChangeStatusDialog(true);
  };

  const handleSelectedChange = (newSelected: string[]) => {
    setSelected(newSelected);
  };

  const handleChangeStatus = () => {
    updatePipelineStatus(statusChanged)
    .then(() => {
      snackbar.success(
        t("pipelineManagement.notifications.changeStatusSuccess")
      );
      setOpenConfirmChangeStatusDialog(false);
    })
    .catch(() => {
      snackbar.error(t("common.errors.unexpected.subTitle"));
    });
  }

  const handleCloseConfirmStatusChangeDialog = () => {
    setOpenConfirmChangeStatusDialog(false);
  };

  const handleOpenConfirmStatusChangeDialog = (pipelineId: string, status: number) => {
    setStatusChanged({pipelineId: pipelineId, status: status});
    setOpenConfirmChangeStatusDialog(true);
  };

  if (!useCanAccess('pipelines')) {
    return <Navigate to="/403" />
  }

  return(
    <React.Fragment>
      <AdminAppBar>
        <AdminToolbar title={t("pipelineManagement.toolbar.title")}>
            {canAccessAddPipeline && (
              <Tooltip title={tooltipAddPipeline}>
                <Fab
                  aria-label="logout"
                  color="primary"
                  disabled={processing}
                  onClick={() => handleOpenPipelineDialog()}
                  size="small"
                  sx={{ mr: 2 }}
                >
                  <AddIcon />
                </Fab>
              </Tooltip>
            )}
        </AdminToolbar>
      </AdminAppBar>
      <PipelineTable
        processing={processing}
        onEdit={handleOpenPipelineDialog}
        canEdit={canAccessEditPipeline}
        onSelectedChange={handleSelectedChange}
        onChangeStatus={handleOpenConfirmStatusChangeDialog}
        onChangeStatusDone={handleOpenPipelineChangeStatusDialog}
        selected={selected}
        pipelines={data}
      />
      <ConfirmDialog
        description={t("pipelineManagement.confirmations.changeStatus")}
        pending={processing}
        onClose={handleCloseConfirmStatusChangeDialog}
        onConfirm={handleChangeStatus}
        open={openConfirmChangeStatusDialog}
        title={t("common.confirmation")}
      />
      {openPipelineDialog && (
        <PipelineDialog
          onAdd={handleAddPipeline}
          onClose={handleClosePipelineDialog}
          onUpdate={handleUpdatePipeline}
          open={openPipelineDialog}
          processing={processing}
          pipeline={pipelineUpdated}
        />
      )}
      {openPipelineChangeStatusDialog && (
        <PipelineStatusChangeDialog
            onClose={handleClosePipelineChangeStatusDialog}
            open={openPipelineChangeStatusDialog}
            processing={processing}
            pipeline={pipelineUpdated}
          />
      )}
    </React.Fragment>
  );
}


export default PipelineManagement;
