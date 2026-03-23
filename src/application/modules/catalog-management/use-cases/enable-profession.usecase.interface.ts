import type { EnableProfessionInput } from "../dtos/enable-profession.dto";

export interface IEnableProfessionUseCase {
	execute(input: EnableProfessionInput): Promise<void>;
}
