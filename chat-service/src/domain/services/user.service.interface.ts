export type userData = {
	id: string;
	name: string;
	profilePicture: string;
};
// TODO: seperate the types from here

export interface IUserService {
	getUserById(userId: string): Promise<userData>;
	getUsersByIds(userIds: string[]): Promise<userData[]>;
}
