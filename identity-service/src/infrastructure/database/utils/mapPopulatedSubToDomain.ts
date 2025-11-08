import { Types } from "mongoose";

export function mapPopulatedSubToDomain(data: any) {
	if (data instanceof Types.ObjectId) {
		return data.toString();
	}

	if (data && typeof data === "object" && data._id) {
		return {
			_id: data._id.toString(),
			name: data.name,
		};
	}
	return data.toString();
}
