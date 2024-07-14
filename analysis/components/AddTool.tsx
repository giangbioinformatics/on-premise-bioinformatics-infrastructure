import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { useState, useContext } from "react";
import { FormControl, FormLabel, Radio, RadioGroup } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import { SyntheticEvent } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
// modules
import { combineValues } from "../../../libs/response";
import XSnackbars from "../../../components/Snackbar";
// features
import { AnalysisContext } from "../contexts/AnalysisContext";
import { Tool } from "../types/AnalysisType";
import { useNotification } from "../../../components/useNotification";

export default function AddTool() {
	const { createTool } = useContext(AnalysisContext);

	// handle close/open the dialog
	const [open, setOpen] = useState(false);
	const handleClick = () => {
		setOpen((open) => !open);
	};

	// handle form
	const [form, setForm] = useState<Tool>({
		name: "",
		git: "",
		allow_access: false,
		version: "",
	});

	const handleChange = (event: any) => {
		const { name, value } = event.target;
		setForm((prevForm: Tool) => ({
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

	// notification
	const {
		snackbarOpen,
		message,
		severity,
		showNotification,
		closeNotification,
	} = useNotification();

	const handleSubmit = async (event: SyntheticEvent) => {
		event.preventDefault();
		handleClick();
		if (!form.name || !form.git) {
			showNotification("Please fill in all required fields.", "error");
			return;
		}
		try {
			const res = await createTool(form);
			if (res.status === 201) {
				showNotification("Tool created successfully", "success");
				return;
			} else {
				showNotification(combineValues(res), "error");
				return;
			}
		} catch (error: any) {
			console.log(error);
			return;
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
			<Button
				variant="contained"
				endIcon={<AddIcon />}
				color="info"
				onClick={handleClick}
			>
				New Tool
			</Button>

			<Dialog fullWidth maxWidth="lg" open={open} onClose={handleClick}>
				<DialogTitle
					sx={{
						backgroundColor: "info.main",
						color: "white",
						textAlign: "center",
						marginBottom: 2,
					}}
				>
					NEW TOOL
				</DialogTitle>
				<DialogContent>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								id="name"
								name="name"
								label="Tool name"
								fullWidth
								variant="standard"
								value={form.name}
								onChange={handleChange}
							/>
						</Grid>

						<Grid item xs={12} sm={6}>
							<TextField
								required
								id="git"
								name="git"
								label="Git URL"
								fullWidth
								variant="standard"
								value={form.git}
								onChange={handleChange}
							/>
						</Grid>

						<Grid item xs={12} sm={6}>
							<TextField
								id="version"
								name="version"
								label="Version"
								fullWidth
								variant="standard"
								value={form.version}
								onChange={handleChange}
							/>
						</Grid>

						<Grid item xs={12}>
							<FormControlLabel
								control={
									<Radio
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
					<Button onClick={handleClick} color="error" variant="contained">
						Cancel
					</Button>
					<Button onClick={handleSubmit} color="info" variant="contained">
						Create
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}
