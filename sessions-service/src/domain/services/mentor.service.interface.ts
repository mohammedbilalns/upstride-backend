export interface IMentorService {
    getMentorById(id: string): Promise<any>;
    getMentorsByIds(ids: string[]): Promise<any[]>;
}
