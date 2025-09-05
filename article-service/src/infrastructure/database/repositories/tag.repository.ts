import { BaseRepository } from "./base.repository";
import { ITagRepository } from "../../../domain/repositories/tag.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { ITag, TagModel } from "../models/tag.model";
import { Tag } from "../../../domain/entities/tag.entity";

export class TagRepository extends BaseRepository<Tag, ITag> implements ITagRepository {
	constructor() {
		super(TagModel);
	}
	protected mapToDomain(doc: ITag): Tag {
		const mapped = mapMongoDocument(doc)!;
		return {
			id: mapped.id,
			name: mapped.name,
			promoted: mapped.promoted,
			usageCount: mapped.usageCount,
			createdAt: mapped.createdAt,
		}
	}


	async createOrIncrement(tags: string[]): Promise<string[]> {
    const bulkOps = tags.map(tagName => ({
      updateOne: {
        filter: { name: tagName },
        update: {
          $setOnInsert: { 
            name: tagName,
            createdAt: new Date()
          },
          $inc: { usageCount: 1 }
        },
        upsert: true
      }
    })); 

		await this._model.bulkWrite(bulkOps, { ordered: false });
		
		    const tagDocs = await this._model
      .find({ name: { $in: tags } })
      .select('_id')
      .lean();
    
    return tagDocs.map(doc => doc._id.toString());
	}

	async findByName(tag: string): Promise<Tag | null> {
		const doc = await this._model.findOne({name: tag}).exec();
		return doc ? this.mapToDomain(doc) : null;
	}
}	

