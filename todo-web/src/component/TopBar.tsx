import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { memo } from "react";
import { useUserStore } from "../store/store";
import { Person } from "@mui/icons-material";

interface Props {
	onUserBtnClick: () => void;
}

const TopBar = ({ onUserBtnClick }: Props) => {
	const userStore = useUserStore();
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1, textAlign: "start" }}
					>
						TODO-APP
					</Typography>
					<Button
						style={{ textTransform: "none" }}
						color="inherit"
						onClick={onUserBtnClick}
						startIcon={<Person />}
					>
						{userStore.isLogin()
							? `Welcome back, ${userStore.user?.name}`
							: "Register"}
					</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
};

export default memo(TopBar);
