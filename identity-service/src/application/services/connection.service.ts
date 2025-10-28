import { ErrorMessage, HttpStatus } from "../../common/enums";
import type {
  IMentorRepository,
  IUserRepository,
} from "../../domain/repositories";
import type { IConnectionRepository } from "../../domain/repositories/connection.repository.interface";
import type { IConnectionService } from "../../domain/services/connection.service.interface";
import type {
  Activity,
  ConnectionsResponseDto,
  MutualConnectionsResponseDto,
  PopulatedConnection,
  SuggestedMentorsResponseDto
} from "../dtos/connection.dto";
import { AppError } from "../errors/AppError";

export class ConnectionService implements IConnectionService {
  constructor(
    private _connectionRepository: IConnectionRepository,
    private _userRepository: IUserRepository,
    private _mentorRepository: IMentorRepository,
  ) {}

  private async validateConnection(
    userId: string,
    mentorId: string,
  ): Promise<false | string> {
    const [user, mentor, connection] = await Promise.all([
      this._userRepository.findById(userId),
      this._mentorRepository.findById(mentorId),
      this._connectionRepository.fetchByUserAndMentor(userId, mentorId),
    ]);

    if (!user || !mentor)
      throw new AppError(ErrorMessage.INVALID_INPUT, HttpStatus.BAD_REQUEST);
    return connection == null ? false : connection.id;
  }

  async follow(userId: string, mentorId: string): Promise<void> {
    const isExists = await this.validateConnection(userId, mentorId);
    if (isExists)
      throw new AppError(ErrorMessage.ALREADY_FOLLOWED, HttpStatus.BAD_REQUEST);

    await this._connectionRepository.create({ mentorId, followerId: userId });
  }

  async unfollow(userId: string, mentorId: string): Promise<void> {
    const connectionId = await this.validateConnection(userId, mentorId);
    if (connectionId === false)
      throw new AppError(
        ErrorMessage.FORBIDDEN_RESOURCE,
        HttpStatus.BAD_REQUEST,
      );

    await this._connectionRepository.delete(connectionId);
  }

  async fetchFollowers(
    userId: string,
    page: number,
    limit: number,
  ): Promise<ConnectionsResponseDto> {
    const mentor = await this._mentorRepository.findByUserId(userId)
    if(!mentor) throw new AppError(ErrorMessage.INVALID_INPUT, HttpStatus.BAD_REQUEST)
    const followers =
      await this._connectionRepository.fetchFollowers(mentor.id, page, limit);
    return followers; 
  }

  async fetchFollowing(
    userId: string,
    page: number,
    limit: number,
  ): Promise<ConnectionsResponseDto> {
    const following =
      await this._connectionRepository.fetchFollowing(userId, page, limit);
    return following 
  }

  async fetchRecentActivity(userId: string): Promise<Activity[]> { 
    const recentActivities: PopulatedConnection[] = await this._connectionRepository.fetchRecentActivity(userId);

    const transformedActivities: Activity[] = recentActivities.map((activity: PopulatedConnection) => {
      if (activity.mentorId._id.toString() === userId) {
        return {
          id: activity._id.toString(),
          activityType: "followed_you", 
          userName: activity.followerId.name,
          avatarImage: activity.followerId.profilePicture || '', 
          createdAt: activity.createdAt,
        };
      } 
      else {
        return {
          id: activity._id.toString(),
          activityType: "followed_user", 
          userName: activity.mentorId.userId.name,
          avatarImage: activity.mentorId.userId.profilePicture || '', 
          createdAt: activity.createdAt,
        };
      }
    });

    return transformedActivities;
  }

  async fetchSuggestedMentors(userId: string, page: number, limit: number): Promise<SuggestedMentorsResponseDto>{
    const user = await this._userRepository.findById(userId);
    if (!user) throw new AppError(ErrorMessage.INVALID_INPUT, HttpStatus.BAD_REQUEST);

    const expertiseIds = user.interestedExpertises
    const skillIds = user.interestedSkills;

    const suggestions = await this._mentorRepository.fetchSuggestedMentors(userId,expertiseIds,skillIds, page, limit)
    return suggestions
  }

  async fetchMutualConnections(userId: string): Promise<MutualConnectionsResponseDto> {
    const recentConnections = await this._connectionRepository.fetchRecentActivity(
      userId,
    );

    if (recentConnections.length === 0) {
      return {
        connections: [],
        total: 0,
      };
    }

    const recentConnectedUsersSet = new Set<string>();

    recentConnections.forEach((connection) => {
      if (connection.mentorId._id.toString() === userId) {
        recentConnectedUsersSet.add(connection.followerId._id.toString());
      }
      // If user is the follower, add the mentor's user ID
      else {
        recentConnectedUsersSet.add(connection.mentorId.userId.toString());
      }
    });

    const recentConnectedUsers = Array.from(recentConnectedUsersSet);

    if (recentConnectedUsers.length === 0) {
      return {
        connections: [],
        total: 0,
      };
    }

    // Fetch mutual connections
    const { connections, total } =
      await this._connectionRepository.fetchMutualConnections(
        userId,
        recentConnectedUsers,
        5 // Limit to 5 suggestions
      );

    return {
      connections,
      total,
    };
  } 
}
