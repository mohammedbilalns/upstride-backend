import type { EnableProfessionInput } from "../dtos/enable-profession.dto";

export interface EnableProfessionOutput {
	resourceId: string;
}

export interface IEnableProfessionUseCase {
	execute(input: EnableProfessionInput): Promise<EnableProfessionOutput>;
}
