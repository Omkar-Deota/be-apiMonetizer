export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const urlRegex = /^https?:\/\/(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+.*$/;

export const currencyAmountRegex = /^\d+(\.\d{1,2})?$/;

export const isObjectEmpty = (obj: unknown): boolean => {
	return obj === null || (typeof obj === 'object' && Object.keys(obj || {}).length === 0);
};

export const isArrayEmpty = (arr: unknown): boolean => {
	return arr === null || (Array.isArray(arr) && arr.length === 0);
};
