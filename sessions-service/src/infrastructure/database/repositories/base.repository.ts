import type { Document, Model } from "mongoose";

export abstract class BaseRepository<TDomain, TDoc extends Document> {
	constructor(protected _model: Model<TDoc>) {}

	protected abstract mapToDomain(doc: TDoc): TDomain;

	public async create(data: Partial<TDoc>): Promise<TDomain> {
		const doc = await this._model.create(data);
		return this.mapToDomain(doc);
	}

	public async findById(id: string): Promise<TDomain | null> {
		const doc = await this._model.findById(id).exec();
		return doc ? this.mapToDomain(doc) : null;
	}

	public async update(
		id: string,
		data: Partial<TDoc>,
	): Promise<TDomain | null> {
		const doc = await this._model
			.findByIdAndUpdate(id, data, { new: true })
			.exec();
		return doc ? this.mapToDomain(doc) : null;
	}

	public async delete(id: string): Promise<boolean> {
		const doc = await this._model.findByIdAndDelete(id).exec();
		return !!doc;
	}
}
