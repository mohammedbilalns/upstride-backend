import type { Document, Model, PopulateOptions } from "mongoose";

export abstract class BaseRepository<TDomain, TDoc extends Document> {
	constructor(protected _model: Model<TDoc>) {}

	protected abstract mapToDomain(doc: TDoc): TDomain;

	async create(data: Partial<TDoc>): Promise<TDomain> {
		const doc = await this._model.create(data);
		return this.mapToDomain(doc);
	}

	async findById(
		id: string,
		populate?: string | string[] | PopulateOptions | PopulateOptions[],
	): Promise<TDomain | null> {
		let query = this._model.findById(id);

		if (populate) {
			if (typeof populate === "string") {
				query = query.populate(populate);
			} else if (Array.isArray(populate)) {
				query = query.populate(populate as (string | PopulateOptions)[]);
			} else {
				query = query.populate(populate);
			}
		}

		const doc = await query.exec();
		return doc ? this.mapToDomain(doc) : null;
	}

	async update(id: string, data: Partial<TDoc>): Promise<TDomain | null> {
		const doc = await this._model
			.findByIdAndUpdate(id, data, { new: true })
			.exec();
		return doc ? this.mapToDomain(doc) : null;
	}

	async delete(id: string): Promise<boolean> {
		const doc = await this._model.findByIdAndDelete(id).exec();
		return !!doc;
	}
}
