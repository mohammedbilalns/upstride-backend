import { inject, injectable } from "inversify";
import type { ISettleEndedSessionUseCase } from "../../../application/modules/booking/use-cases/settle-ended-session.use-case.interface";
import { TYPES } from "../../../shared/types/types";

@injectable()
export class BookingSettlementHandler {
	constructor(
		@inject(TYPES.UseCases.SettleEndedSession)
		private readonly _settleEndedSessionUseCase: ISettleEndedSessionUseCase,
	) {}

	async handle(data: { bookingId: string }) {
		await this._settleEndedSessionUseCase.execute(data);
	}
}
