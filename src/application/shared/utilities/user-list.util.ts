import type { UserRole } from "../../../domain/entities/user.entity";
import type { UserQuery } from "../../../domain/repositories";

type ListStatus = "active" | "blocked";
type ListSort = "recent" | "old";

type BuildUserListQueryInput = {
	search?: string;
	status?: ListStatus;
	sort?: ListSort;
	role?: UserRole | UserRole[];
	defaultRole: UserRole | UserRole[];
};

const resolveIsBlocked = (status?: ListStatus) =>
	status === "blocked" ? true : status === "active" ? false : undefined;

const resolveSort = (sort?: ListSort): Record<string, 1 | -1> =>
	sort === "old" ? { createdAt: 1 } : { createdAt: -1 };

export const buildUserListQuery = ({
	search,
	status,
	sort,
	role,
	defaultRole,
}: BuildUserListQueryInput): {
	query: UserQuery;
	sort: Record<string, 1 | -1>;
} => {
	return {
		query: {
			search,
			role: role ?? defaultRole,
			isBlocked: resolveIsBlocked(status),
		},
		sort: resolveSort(sort),
	};
};
