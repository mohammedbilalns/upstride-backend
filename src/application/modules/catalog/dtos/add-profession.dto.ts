export interface AddProfessionInput {
	name: string;
}

export interface AddProfessionOutput {
	name: string;
	newProfessionId: string;
	slug: string;
}
