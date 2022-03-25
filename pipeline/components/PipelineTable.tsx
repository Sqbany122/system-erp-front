import React, { useState } from "react";
import { Link } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Divider from '@material-ui/core/Divider';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import IconButton from "@material-ui/core/IconButton";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Chip from "@material-ui/core/Chip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import EditIcon from "@material-ui/icons/Edit";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useTranslation } from "react-i18next";
import * as selectUtils from "../../core/utils/selectUtils";
import Empty from "../../core/components/Empty";
import { Pipeline } from "../types/pipeline";
import DoneIcon from '@material-ui/icons/Done';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import WorkIcon from '@material-ui/icons/Work';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { useAuth } from "../../auth/contexts/AuthProvider";
import { useUsers } from "../../users/hooks/useUsers";
import { useCanAccess } from "../../core/hooks/useCanAccess";

interface HeadCell {
  id: string;
  label: string;
  align: "center" | "left" | "right";
}

const headCells: HeadCell[] = [
  {
    id: "id",
    align: "center",
    label: "pipelineManagement.table.headers.id",
  },
  {
    id: "owner",
    align: "center",
    label: "pipelineManagement.table.headers.owner",
  },
  {
    id: "name",
    align: "center",
    label: "pipelineManagement.table.headers.name",
  },
  {
    id: "nip",
    align: "center",
    label: "pipelineManagement.table.headers.nip",
  },
  {
    id: "status",
    align: "center",
    label: "pipelineManagement.table.headers.status",
  }
];

interface EnhancedTableProps {
  numSelected : number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

function EnhancedTableHead(_: EnhancedTableProps) {
  const { t } = useTranslation();

  return (
    <TableHead>
      <TableRow sx={{ "& th": { border: 0 } }}>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} sx={{ py:0 }}>
            {t(headCell.label)}
          </TableCell>
        ))}
        <TableCell align="right" sx={{ py: 0}}>
          {t("pipelineManagement.table.headers.actions")}
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

type PipelineRowProps = {
  index: number;
  onCheck: (id: string) => void;
  onEdit: (pipeline: Pipeline) => void;
  canEdit: boolean;
  onChangeStatus: (pipelineId: string, status: number) => void;
  onChangeStatusDone: (pipeline: Pipeline) => void;
  processing: boolean;
  selected: boolean;
  pipeline: Pipeline;
};

const PipelineRow = ({
  index,
  onCheck,
  onEdit,
  canEdit,
  onChangeStatus,
  onChangeStatusDone,
  processing,
  selected,
  pipeline,
}: PipelineRowProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const { userInfo } = useAuth();
  const users = useUsers();

  const pipelineStatuses = [
    {
      status: 2,
      name: "meeting_held",
      icon: <MeetingRoomIcon />
    },
    {
      status: 3,
      name: "negotiations",
      icon: <WorkIcon />
    },
    {
      status: 4,
      name: "resignation",
      icon: <HighlightOffIcon />
    },
    {
      status: 5,
      name: "signed_contract",
      icon: <DoneIcon />
    },
  ];

  const openActions = Boolean(anchorEl);
  const rowNumber = index + 1;
  const canAccessChangeStatus = useCanAccess("pipelines_change_status");

  const handleOpenActions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseActions = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleCloseActions();
    onEdit(pipeline);
  };

  const handleChangeStatus = (pipelineId: string, status: number) => {
    handleCloseActions();
    onChangeStatus(pipelineId, status)
  }

  const handleChangeStatusDone = () => {
    handleCloseActions();
    onChangeStatusDone(pipeline);
  }

  return (
    <TableRow
      aria-checked={selected}
      tabIndex={-1}
      key={pipeline.id}
      selected={selected}
      sx={{ "& td": { bgcolor: 'background.paper', border: 0} }}
    >
      <TableCell 
        align="center"
        sx={{ borderTopLeftRadius: "1rem", borderBottomLeftRadius: "1rem"}}
      >{rowNumber}</TableCell>
      <TableCell align="center">
        {!users.isLoading && users.data && (
          users.data.map(user => (
            pipeline.owner == user.id && (
              user.firstname + " " + user.lastname 
            )
          )) 
        )}
      </TableCell>
      <TableCell align="center">{pipeline.name}</TableCell>
      <TableCell align="center">{pipeline.nip}</TableCell>
      <TableCell align="center">
        <Chip color="primary" label={t("pipelineManagement.statuses." + pipeline.status)} />
      </TableCell>
      <TableCell
        align="right"
        sx={{ borderTopRightRadius: "1rem", borderBottomRightRadius: "1rem"}}
      >
        <IconButton
          id="user-row-menu-button"
          aria-label="pipeline actions"
          aria-controls="pipeline-row-menu"
          aria-haspopup="true"
          aria-expanded={openActions ? "true" : "false"}
          disabled={processing}
          onClick={handleOpenActions}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="user-row-menu"
          anchorEl={anchorEl}
          aria-labelledby="user-row-menu-button"
          open={openActions}
          onClose={handleCloseActions}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          >
            <MenuItem
              component={Link}
              to={ "/admin/pipelines/info/" + pipeline.id }
              sx={{ my: 1, py: 1 }}
            >
              <ListItemIcon>
                  <ArrowForwardIosIcon />
              </ListItemIcon>{" "}
              {t("common.open")}
            </MenuItem>
            {(userInfo?.id == pipeline.owner || canAccessChangeStatus) && (
              pipeline.status != "signed_contract" && (
                <>
                  <Divider sx={{ my: 0.5 }} />
                  {pipelineStatuses.map((status) => (
                      status.name != pipeline.status && (
                        <MenuItem 
                          onClick={
                            status.name == "signed_contract" ? (
                              () => handleChangeStatusDone()
                            ) : (
                              () => handleChangeStatus(pipeline.id, status.status)
                            )
                          }
                          sx={{ my: 1, py: 1 }}
                        >
                          <ListItemIcon>
                            {status.icon}{" "}
                          </ListItemIcon>
                          {t("pipelineManagement.statuses." + status.name)}
                        </MenuItem>
                      )
                  ))}
                </>
              )
            )}
            {canEdit && (
              <>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem 
                  onClick={handleEdit}
                  sx={{ my: 1, py: 1 }}
                >
                  <ListItemIcon>
                    <EditIcon />
                  </ListItemIcon>{" "}
                  {t("common.edit")}
                </MenuItem>
              </>
            )}
          </Menu>
      </TableCell>
    </TableRow>
  );
};

type PipelineTableProps = {
  processing: boolean;
  onEdit: (pipeline: Pipeline) => void;
  canEdit: boolean;
  onSelectedChange: (selected: string[]) => void;
  onChangeStatus: (pipelineId: string, status: number) => void;
  onChangeStatusDone: (pipeline: Pipeline) => void;
  selected: string[];
  pipelines?: Pipeline[];
};

const PipelineTable = ({
  onEdit,
  canEdit,
  onSelectedChange,
  onChangeStatus,
  onChangeStatusDone,
  processing,
  selected,
  pipelines = [],
}: PipelineTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = selectUtils.selectAll(pipelines);
      onSelectedChange(newSelecteds);
      return;
    }
    onSelectedChange([]);
  };

  const handleClick = (id: string) => {
    let newSelected: string[] = selectUtils.selectOne(selected, id);
    onSelectedChange(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  if (pipelines.length === 0) {
    return <Empty title="Nie ma żadnych pipelinow" />;
  }
  return(
    <React.Fragment>
      <TableContainer>
        <Table
          aria-labelledby="tableTitle"
          sx={{
            minWidth: 600,
            borderCollapse: "separate",
            borderSpacing: "0 1rem",
          }}
        >
          <EnhancedTableHead
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={pipelines.length}
          />
          <TableBody>
              {pipelines
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((pipeline, index) => (
                  <PipelineRow
                    index={index}
                    key={pipeline.id}
                    onCheck={handleClick}
                    onChangeStatus={onChangeStatus}
                    onChangeStatusDone={onChangeStatusDone}
                    onEdit={onEdit}
                    canEdit={canEdit}
                    processing={processing}
                    selected={isSelected(pipeline.id)}
                    pipeline={pipeline}
                  />
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={pipelines.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </React.Fragment>
  );
};

export default PipelineTable;