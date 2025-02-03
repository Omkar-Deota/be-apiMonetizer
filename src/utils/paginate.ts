import { PaginateOptions, PaginateResult } from '../types/common';

export const paginate = async <T extends object>(options: PaginateOptions<T>): Promise<PaginateResult> => {
	const { count, page, limit } = options;

	const totalPages = Math.ceil(count / limit);
	const hasMorePages = page < totalPages;
	return {
		totalPages,
		count,
		hasMorePages
	};
};
