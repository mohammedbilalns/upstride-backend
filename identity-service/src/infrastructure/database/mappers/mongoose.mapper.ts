import type { Document } from "mongoose";

export type DocumentToPlain<T extends Document> = Omit<
	T,
	keyof Document | "_id" | "__v"
> & { id: string };

export const mapMongoDocument = <T extends Document>(
	doc: T | null,
): DocumentToPlain<T> | null => {
	if (!doc) return null;

	const obj = doc.toObject();
	const { _id, __v, ...rest } = obj;

	return {
		...rest,
		id: _id.toString(),
	} as DocumentToPlain<T>;
};
