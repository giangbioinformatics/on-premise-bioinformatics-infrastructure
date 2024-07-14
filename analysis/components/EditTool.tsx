import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { useState, useContext, useEffect } from "react";
import { FormControlLabel, Checkbox } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { SyntheticEvent } from "react";

// modules
import { AnalysisContext } from "../../../../X-project-new/client/src/features/analysis/contexts/AnalysisContext";
import { Tool } from "../../../../X-project-new/client/src/features/analysis/types/AnalysisType";
import { useNotification } from "../../../../X-project-new/client/src/components/useNotification";
import { combineValues } from "../../../../X-project-new/client/src/libs/response";
import XSnackbars from "../../../../X-project-new/client/src/components/Snackbar";

export default function EditTool(): JSX.Element {
	// Load tool
	const {
		toolState: { tool },
		updateTool,
	} = useContext(AnalysisContext);

	// Handle edit tool
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const initialTool: Tool = {
		name: "",
		git: "",
		allow_access: false,
		version: "",
	};

	// Update initialTool if tool exists
	const toolExists = tool !== undefined;
	const toolToUse = toolExists ? tool : initialTool;

	const [form, setForm] = useState(toolToUse);

	useEffect(() => {
		setForm(toolToUse);
	}, [tool]);

	const handleChange = (event: any) => {
		const { name, value } = event.target;
		setForm((prevForm) => ({
			...prevForm,
			[name]: value,
		}));
	};

	const handleCheckboxChange = (event: any) => {
		const { name, checked } = event.target;
		setForm((prevForm: Tool) => ({
			...prevForm,
			[name]: checked,
		}));
	};

	// Notification
	const {
		snackbarOpen,
		message,
		severity,
		showNotification,
		closeNotification,
	} = useNotification();

	const handleSubmit = async (event: SyntheticEvent) => {
		event.preventDefault();
		handleClose();

		const hasChanges =
			form.name !== toolToUse.name ||
			form.git !== toolToUse.git ||
			form.allow_access !== toolToUse.allow_access ||
			form.version !== toolToUse.version;

		if (hasChanges) {
			try {
				const res = await updateTool(form);
				if (res.status === 200) {
					showNotification("Tool updated successfully", "success");
				} else {
					showNotification(combineValues(res), "error");
				}
			} catch (error: any) {
				console.error(error);
			}
		} else {
			showNotification("Tool is not changed", "error");
		}
	};

	return (
		<React.Fragment>
			<XSnackbars
				open={snackbarOpen}
				onClose={closeNotification}
				message={message}
				severity={severity}
			/>
			<EditIcon onClick={handleClickOpen} />
			<Dialog fullWidth maxWidth="lg" open={open} onClose={handleClose}>
				<DialogTitle
					sx={{
						backgroundColor: "info.main",
						color: "white",
						textAlign: "center",
					}}
				>
					EDIT TOOL
				</DialogTitle>
				<DialogContent>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6}>
							<InputLabel htmlFor="name">Tool Name</InputLabel>
							<TextField
								required
								id="name"
								name="name"
								fullWidth
								variant="standard"
								value={form.name}
								onChange={handleChange}
								sx={{
									border: "1px solid #ccc",
									borderRadius: "4px",
									padding: "8px",
								}}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<InputLabel htmlFor="git">Git URL</InputLabel>
							<TextField
								required
								id="git"
								name="git"
								fullWidth
								variant="standard"
								value={form.git}
								onChange={handleChange}
								sx={{
									border: "1px solid #ccc",
									borderRadius: "4px",
									padding: "8px",
								}}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<InputLabel htmlFor="version">Version</InputLabel>
							<TextField
								id="version"
								name="version"
								fullWidth
								variant="standard"
								value={form.version}
								onChange={handleChange}
								sx={{
									border: "1px solid #ccc",
									borderRadius: "4px",
									padding: "8px",
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<FormControlLabel
								control={
									<Checkbox
										checked={form.allow_access}
										onChange={handleCheckboxChange}
										name="allow_access"
									/>
								}
								label="Allow Access"
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="error" variant="contained">
						Cancel
					</Button>
					<Button onClick={handleSubmit} color="info" variant="contained">
						Edit
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}
