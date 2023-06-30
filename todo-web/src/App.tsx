import React, { useState } from "react";
import "./App.css";
import ButtonAppBar from "./component/TopBar";
import { QueryClient, QueryClientProvider } from "react-query";
import UserDialog from "./component/UserDialog";
import ItemList from "./component/ItemList";

const queryClient = new QueryClient();

function App() {
	const [open, setOpen] = useState<boolean>(false);
	const toggleUserModal = () => {
		setOpen(!open);
	};

	return (
		<QueryClientProvider client={queryClient}>
			<div className="App">
				<ButtonAppBar onUserBtnClick={toggleUserModal} />
				<ItemList />
			</div>
			<UserDialog open={open} onClose={toggleUserModal}></UserDialog>
		</QueryClientProvider>
	);
}

export default App;
