export interface Response<T> {
	message: string;
	data: T;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
}
