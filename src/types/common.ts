import { Repository } from 'typeorm';
export interface PaginateOptions<T extends object> {
	repository: Repository<T>;
	page: number;
	limit: number;
	count: number;
	id?: string;
}

export interface PaginateResult {
	totalPages: number;
	count: number;
	hasMorePages: boolean;
}
