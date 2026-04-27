import type { JobMap } from "../../../application/ports/job-queue.port";

export interface IJobHandler<K extends keyof JobMap> {
	handle(data: JobMap[K]): Promise<void>;
}
