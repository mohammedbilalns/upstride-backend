import type { AuthorizeWhiteboardPermissionInput } from "../dtos/authorize-whiteboard-permission.dto";

export interface IAuthorizeWhiteboardPermissionUseCase {
	execute(input: AuthorizeWhiteboardPermissionInput): Promise<void>;
}
