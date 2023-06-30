import {
	Box,
	Button,
	Card,
	CardContent,
	TextField,
	Typography,
	Checkbox,
	FormGroup,
	FormControlLabel,
} from "@mui/material";
import { memo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Item } from "../interface/item";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { ENDPOINTS } from "../api/api";
import { CONFIG } from "../config/config";
import { useUserStore } from "../store/store";
import dayjs from "dayjs";

interface ItemFormProps {
	title: string;
	description?: string;
	done?: boolean;
}

interface Props {
	isAdding?: boolean;
	todo?: Item;
}

const ItemCard = ({ isAdding = false, todo }: Props) => {
	const queryClient = useQueryClient();
	const userStore = useUserStore();
	const { control, handleSubmit } = useForm<ItemFormProps>({
		defaultValues: {
			title: todo?.title,
			description: todo?.description,
			done: todo?.done,
		},
	});
	const { mutateAsync, isLoading } = useMutation({
		mutationFn: ({
			title,
			description,
			done,
		}: {
			title: string;
			description?: string;
			done?: boolean;
		}) =>
			isAdding
				? axios.post(
						`${CONFIG.HOST}${ENDPOINTS.ITEMS}`,
						{
							title,
							description,
						},
						{
							headers: {
								"current-user": userStore.user?.id,
							},
						},
				  )
				: axios.put(
						`${CONFIG.HOST}${ENDPOINTS.ITEMS}/${todo?.id}`,
						{
							title,
							description,
							done,
						},
						{
							headers: {
								"current-user": userStore.user?.id,
							},
						},
				  ),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["items"] });
		},
		onError: (err: Error) => {
			console.log(err.message);
		},
	});

	const { mutateAsync: deleteMutate } = useMutation({
		mutationFn: () =>
			axios.delete(`${CONFIG.HOST}${ENDPOINTS.ITEMS}/${todo?.id}`, {
				headers: {
					"current-user": userStore.user?.id,
				},
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["items"] });
		},
		onError: (err: Error) => {
			console.log(err.message);
		},
	});

	const submit = async (data: ItemFormProps) => {
		await mutateAsync(data);
	};

	const onDelete = async () => {
		if (!todo?.id) {
			return;
		}
		await deleteMutate();
	};

	return (
		<Card sx={{ margin: 1 }}>
			<CardContent>
				<Box sx={{ display: "flex" }}>
					<Typography variant="body1" sx={{ textAlign: "start" }}>
						{isAdding ? "Add new todo item" : "Edit todo item"}
					</Typography>
					{!isAdding && (
						<Typography
							sx={{ marginLeft: "auto", textAlign: "start" }}
							variant="body1"
						>
							Last Updated:{" "}
							{`${dayjs(todo?.updatedAt).format("YYYY-MM-DD HH:mm:ss")}`}
						</Typography>
					)}
				</Box>
				<form onSubmit={handleSubmit(submit)}>
					<Box sx={{ display: "flex", flexDirection: "column" }}>
						<Controller
							name="title"
							control={control}
							rules={{ required: true }}
							render={({ field }) => (
								<TextField
									label="title"
									sx={{ marginBottom: 1 }}
									size="small"
									variant="filled"
									{...field}
								/>
							)}
						/>
						<Controller
							name="description"
							control={control}
							render={({ field }) => (
								<TextField
									label="description"
									sx={{ marginBottom: 1 }}
									size="small"
									variant="filled"
									{...field}
								/>
							)}
						/>
						<Box sx={{ display: "flex" }}>
							<Controller
								name="done"
								control={control}
								render={({ field }) => (
									<FormGroup>
										<FormControlLabel
											control={<Checkbox checked={field.value} {...field} />}
											label="Completed"
										/>
									</FormGroup>
								)}
							/>
							<Button
								sx={{ marginLeft: "auto" }}
								type="submit"
								disabled={isLoading}
							>
								Save
							</Button>
							{!isAdding && (
								<Button
									sx={{ marginLeft: 1 }}
									disabled={isLoading}
									onClick={onDelete}
								>
									Delete
								</Button>
							)}
						</Box>
					</Box>
				</form>
			</CardContent>
		</Card>
	);
};

export default memo(ItemCard);
