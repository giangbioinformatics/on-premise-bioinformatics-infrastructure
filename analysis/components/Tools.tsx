// standard imports
import React, { useState, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
	MaterialReactTable,
	useMaterialReactTable,
	type MRT_ColumnDef,
	type MRT_Row,
	type MRT_RowSelectionState,
} from "material-react-table";
import { Tooltip, IconButton, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDate } from "../../../../X-project-new/client/src/libs/date";
// module imports
import Loading from "../../../../X-project-new/client/src/components/Loading";
import AddTool from "./AddTool";
import EditTool from "./EditTool";
import { useNotification } from "../../../../X-project-new/client/src/components/useNotification";
// project imports
import { Tool } from "../../../../X-project-new/client/src/features/analysis/types/AnalysisType";
import { AnalysisContext } from "../../../../X-project-new/client/src/features/analysis/contexts/AnalysisContext";

const Tools: React.FC = () => {
	const navigate = useNavigate();
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string | undefined>
	>({});
	const columns = useMemo<MRT_ColumnDef<Tool>[]>(
		() => [
			{
				accessorKey: "name",
				header: "Name",
				size: 50,
				muiEditTextFieldProps: {
					required: true,
					error: !!validationErrors?.name,
					helperText: validationErrors?.name,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							name: undefined,
						}),
				},
			},
			{
				accessorKey: "state",
				header: "State",
				size: 50,
				muiEditTextFieldProps: {
					required: true,
					error: !!validationErrors?.state,
					helperText: validationErrors?.state,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							state: undefined,
						}),
				},
			},
			{
				accessorFn: (row) =>
					row.created_at ? formatDate(row.created_at) : null,
				id: "created_at",
				header: "Created at",
				enableEditing: false,
				filterVariant: "date",
				filterFn: "fuzzy",
				sortingFn: "datetime",
				Cell: ({ cell }) => <>{cell.getValue<Date>()}</>,
				Header: ({ column }) => <em>{column.columnDef.header}</em>,
				muiFilterTextFieldProps: {
					sx: {
						minWidth: "50px",
					},
				},
				size: 50,
			},
			{
				accessorFn: (row) =>
					row.updated_at ? formatDate(row.updated_at) : null,
				id: "updated_at",
				header: "Updated at",
				enableEditing: false,
				filterVariant: "date",
				filterFn: "fuzzy",
				sortingFn: "datetime",
				Cell: ({ cell }) => <>{cell.getValue<Date>()}</>,
				Header: ({ column }) => <em>{column.columnDef.header}</em>,
				muiFilterTextFieldProps: {
					sx: {
						minWidth: "50px",
					},
				},
				size: 50,
			},
			{
				accessorKey: "description",
				header: "Description",
				size: 400,
				muiEditTextFieldProps: {
					required: true,
					error: !!validationErrors?.description,
					helperText: validationErrors?.description,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							description: undefined,
						}),
				},
			},
		],
		[]
	);
	const { showNotification } = useNotification();

	// CRUD operations
	const {
		toolState: { toolLoading, tools },
		fetchTools,
		deleteTool,
		findTool,
	} = useContext(AnalysisContext);

	const openDeleteConfirmModal = async (row: MRT_Row<Tool>) => {
		if (!row.original.id) {
			showNotification("Tool not found", "error");
			return;
		} else {
			const res = await deleteTool(row.original.id);
			if (res.status === 204) {
				showNotification("Tool deleted successfully", "success");
				return;
			}
		}
	};

	// Fetch tools
	useEffect(() => {
		fetchTools();
	}, []);

	const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
	const table = useMaterialReactTable({
		columns,
		data: tools,
		enableEditing: true,
		initialState: { showColumnFilters: true, showGlobalFilter: true },
		paginationDisplayMode: "pages",
		muiSearchTextFieldProps: {
			size: "small",
			variant: "outlined",
			color: "info",
		},
		muiPaginationProps: {
			color: "standard",
			rowsPerPageOptions: [10, 20, 30],
			shape: "rounded",
			variant: "outlined",
		},
		muiTableContainerProps: {
			sx: {
				minHeight: "75vh",
			},
		},
		createDisplayMode: "modal",
		editDisplayMode: "modal",
		getRowId: (row) => row.id?.toString() || "",
		enableColumnFilterModes: true,
		enableColumnOrdering: true,
		enableRowActions: true,
		positionActionsColumn: "last",
		muiTableBodyCellProps: ({ cell }) => ({
			onDoubleClick: (event) => {
				event.preventDefault();
				const id = cell.row.original.id;
				if (id) {
					findTool(id);
					navigate("/tool/" + id + "/details");
				} else {
					showNotification("Tool not found", "error");
				}
			},
		}),
		onRowSelectionChange: setRowSelection,
		state: { rowSelection },
		renderRowActions: ({ row }) => (
			<Box sx={{ display: "flex", gap: "1rem" }}>
				<Tooltip title="Edit">
					<IconButton
						onClick={() => row.original.id && findTool(row.original.id)}
					>
						<EditTool />
					</IconButton>
				</Tooltip>
				<Tooltip title="Delete">
					<IconButton
						onClick={() => {
							openDeleteConfirmModal(row);
						}}
					>
						<DeleteIcon color="error" />
					</IconButton>
				</Tooltip>
			</Box>
		),
		renderTopToolbarCustomActions: () => <AddTool />,
	});

	let body = null;
	if (toolLoading) {
		body = <Loading />;
	} else {
		body = <MaterialReactTable table={table} />;
	}
	return body;
};

export default Tools;
