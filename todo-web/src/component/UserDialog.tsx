import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { memo, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { ENDPOINTS } from "../api/api";
import { CONFIG } from "../config/config";
import { useUserStore } from "../store/store";

interface Props {
	open: boolean;
	onClose: () => void;
	title?: string;
	children?: React.ReactNode;
}

const UserDialog = ({ open, onClose }: Props) => {
	const queryClient = useQueryClient();
	const userStore = useUserStore();
	const registerMutation = useMutation({
		mutationFn: () =>
			axios.post(`${CONFIG.HOST}${ENDPOINTS.USERS}`, {
				name,
			}),
		onSuccess: (res) => {
			const data = res.data;
			userStore.setUser({
				id: data.data.id,
				name: data.data.name,
			});
			queryClient.invalidateQueries({ queryKey: ["items"] });
			onClose();
		},
		onError: (err: Error) => {
			console.log(err.message);
		},
	});
	const [name, setName] = useState<string>("");
	const onRegister = async () => {
		await registerMutation.mutateAsync();
	};
	const onLogout = () => userStore.removeUser();
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{userStore.isLogin() ? "Logout" : "Register"}</DialogTitle>
			{userStore.isLogin() ? (
				<>
					<DialogContent>
						<DialogContentText>
							Are you sure to logout. This action is irreversible
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={onClose}>Cancel</Button>
						<Button onClick={onLogout}>Logout</Button>
					</DialogActions>
				</>
			) : (
				<>
					<DialogContent>
						<DialogContentText>
							Please enter your username below
						</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="name"
							label="Username"
							value={name}
							onChange={(event) => setName(event.target.value)}
							fullWidth
							variant="standard"
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={onClose}>Cancel</Button>
						<Button onClick={onRegister}>Register</Button>
					</DialogActions>
				</>
			)}
		</Dialog>
	);
};

export default memo(UserDialog);
