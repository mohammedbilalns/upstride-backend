export enum OwnerType {
    USER = "USER",
    MENTOR = "MENTOR",
    PLATFORM = "PLATFORM",
}

export interface Wallet {
    id: string;
    ownerId: string;
    ownerType: OwnerType;
    balance: number;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
}
