import { Box, Button, Stack } from "@mui/material";
import axios from "axios";
import { memo } from "react";
import { useInfiniteQuery } from "react-query";
import { ENDPOINTS } from "../api/api";
import { CONFIG } from "../config/config";
import { Item } from "../interface/item";
import { PaginatedResponse, Response } from "../interface/response";
import { useUserStore } from "../store/store";
import ItemCard from "./ItemCard";

const pageSize = 2;

const ItemLists = () => {
	const userStore = useUserStore();

	const {
		isLoading,
		isError,
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["items"],
		queryFn: ({ pageParam = 0 }) => {
			return axios.get<Response<PaginatedResponse<Item>>>(
				`${CONFIG.HOST}${ENDPOINTS.ITEMS}`,
				{
					params: { offset: pageParam * pageSize, limit: pageSize },
					headers: {
						"current-user": userStore.user?.id,
					},
				},
			);
		},
		getNextPageParam: (LastPage, allPages) => {
			return LastPage.data.data.total > allPages.length * pageSize
				? allPages.length
				: undefined;
		},
	});

	const loadMore = () => fetchNextPage();

	if (isLoading || isError) {
		return <Box>Loading...</Box>;
	}

	return (
		<Box sx={{ height: "calc(100vh-46px)" }}>
			<ItemCard isAdding />
			<Stack>
				{data?.pages
					.flatMap((res) => {
						return res.data.data.data;
					})
					.map((todo) => (
						<ItemCard key={todo.id} todo={todo} />
					))}
			</Stack>
			{hasNextPage && (
				<Button onClick={loadMore} disabled={isFetchingNextPage}>
					Load More
				</Button>
			)}
		</Box>
	);
};

export default memo(ItemLists);
