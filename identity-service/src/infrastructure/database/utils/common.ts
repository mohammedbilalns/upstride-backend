import { ObjectId } from "mongoose";

export function  isObjectId(value: any): value is ObjectId {
		return (
			value &&
				typeof value === "object" &&
				value.constructor.name === "ObjectId"
		);
}

export function isPopulatedDocument(value: any): boolean {
		return (
			value &&
				typeof value === "object" &&
				!isObjectId(value) &&
				"_id" in value
		);
	}
