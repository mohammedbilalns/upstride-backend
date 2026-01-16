import { Wallet, OwnerType } from "../entities/wallet.entity";

export interface IWalletRepository {
    create(wallet: Omit<Wallet, "id" | "createdAt" | "updatedAt">): Promise<Wallet>;
    findById(id: string): Promise<Wallet | null>;
    findByOwner(ownerId: string, ownerType: OwnerType): Promise<Wallet | null>;
    updateBalance(walletId: string, amount: number): Promise<Wallet>;
    getPlatformWallet(): Promise<Wallet | null>;
}
