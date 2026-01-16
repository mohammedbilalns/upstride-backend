import { IWalletRepository } from "../../../domain/repositories/wallet.repository.interface";
import { Wallet, OwnerType } from "../../../domain/entities/wallet.entity";
import { WalletModel, WalletDocument } from "../models/wallet.model";
import { BaseRepository } from "./base.repository";

export class WalletRepository
    extends BaseRepository<Wallet, WalletDocument>
    implements IWalletRepository {
    constructor() {
        super(WalletModel);
    }

    protected mapToDomain(doc: WalletDocument): Wallet {
        return {
            id: doc._id.toString(),
            ownerId: doc.ownerId,
            ownerType: doc.ownerType,
            balance: doc.balance,
            currency: doc.currency,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }

    async findByOwner(
        ownerId: string,
        ownerType: OwnerType,
    ): Promise<Wallet | null> {
        const wallet = await WalletModel.findOne({ ownerId, ownerType });
        return wallet ? this.mapToDomain(wallet) : null;
    }

    async updateBalance(walletId: string, amount: number): Promise<Wallet> {
        const wallet = await WalletModel.findByIdAndUpdate(
            walletId,
            { $inc: { balance: amount } },
            { new: true },
        );

        if (!wallet) {
            throw new Error(`Wallet ${walletId} not found`);
        }

        return this.mapToDomain(wallet);
    }

    async getPlatformWallet(): Promise<Wallet | null> {
        const wallet = await WalletModel.findOne({
            ownerType: OwnerType.PLATFORM,
        });
        return wallet ? this.mapToDomain(wallet) : null;
    }
}
