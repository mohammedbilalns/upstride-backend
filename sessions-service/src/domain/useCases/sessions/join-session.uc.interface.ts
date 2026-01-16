export interface IJoinSessionUC {
    execute(userId: string, sessionId: string): Promise<void>;
}
