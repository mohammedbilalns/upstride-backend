
import logger from "../../common/utils/logger";
import { ICacheService } from "../../domain/services/cache.service.interface";
import { IMentorService } from "../../domain/services/mentor.service.interface";
import env from "../config/env";

export class MentorService implements IMentorService {
    private baseUrl = env.MENTOR_SERVICE_URL;

    constructor(private cacheService: ICacheService) { }

    async getMentorById(mentorId: string): Promise<any> {
        try {
            const cacheKey = `mentor:${mentorId}`;
            const cached = await this.cacheService.get<any>(cacheKey);
            if (cached) return cached;

            const res = await fetch(`${this.baseUrl}/basic/${mentorId}`);
            if (!res.ok) {
                if (res.status === 404) return null;
                const errorText = await res.text();
                logger.error(
                    `Failed to fetch mentor ${mentorId}: ${res.status} ${res.statusText} - ${errorText}`,
                );
                return null;
            }

            const data = await res.json();
            await this.cacheService.set(cacheKey, data, 60 * 5); // 5 mins cache
            return data;
        } catch (error) {
            logger.error(`Error in getMentorById: ${error}`);
            return null;
        }
    }

    async getMentorsByIds(mentorIds: string[]): Promise<any[]> {
        const uniqueIds = [...new Set(mentorIds)];
        const promises = uniqueIds.map(id => this.getMentorById(id));
        const results = await Promise.all(promises);
        return results.filter(m => !!m);
    }
}
