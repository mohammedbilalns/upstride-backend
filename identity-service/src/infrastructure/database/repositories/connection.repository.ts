import { Types } from "mongoose";
import type { Connection } from "../../../domain/entities/connection.entity";
import type { IConnectionRepository } from "../../../domain/repositories/connection.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { ConnectionModel, type IConnection } from "../models/connection.model";
import { BaseRepository } from "./base.repository";
import  { PopulatedConnection } from "../../../application/dtos/connection.dto";

export class ConnectionRepository
extends BaseRepository<Connection, IConnection>
implements IConnectionRepository
{
  constructor() {
    super(ConnectionModel);
  }

  protected mapToDomain(doc: IConnection): Connection {
    const mapped = mapMongoDocument(doc)!
    return {
      id: mapped.id,
      mentorId: mapped.mentorId,
      followerId: mapped.followerId,
      createdAt: mapped.createdAt,
    };
  }

  async fetchFollowers(
    mentorId: string,
    page: number,
    limit: number,
  ): Promise<Connection[]> {
    const skip = (page - 1) * limit;

    const docs = await this._model
      .find({ mentorId })
      .populate({
        path: "followerId",
        select: "name email phone profilePicture",
      })
      .skip(skip)
      .limit(limit)
      .exec()
    return docs.map((doc) => this.mapToDomain(doc));
  }

  async fetchFollowing(
    userId: string,
    page: number,
    limit: number,
  ): Promise<Connection[]> {
    const skip = (page - 1) * limit;
    const docs = await	this._model
      .find({ followerId: userId })
      .populate({
        path: "mentorId",
        select:
        "bio currentRole yearsOfExperience userId",
        populate: [
          { path: "skillIds", select: "name -_id" },
          { path: "expertiseId", select: "name -_id" },
          {path: "userId", select: "name email profilePicture"},
        ],
      })
      .skip(skip)
      .limit(limit)
      .exec()
    const mapped = docs.map((doc) => this.mapToDomain(doc));
    return mapped
  }
  async fetchByUserAndMentor(
    userId: string,
    mentorId: string,
  ): Promise<Connection | null> {
    const doc = await this._model
      .findOne({ mentorId, followerId: userId })
      .exec();
    return doc ? this.mapToDomain(doc) : null;
  }

  async fetchRecentActivity(userId: string): Promise<PopulatedConnection[]> {
    const objectId = new Types.ObjectId(userId);
    const recentActivities = await ConnectionModel.find({
      $or: [
        { followerId: objectId }, 
        { "mentorId.userId": objectId }, 
      ],
    })
    .populate({
      path: "mentorId",
      populate: { path: "userId", select: "name profilePicture" }, 			
    })
    .populate("followerId", "name profilePicture") 
    .sort({ createdAt: -1 }) 
    .limit(5)
    .lean<PopulatedConnection[]>(); 

    return recentActivities;
  }

}
