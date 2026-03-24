export interface CatalogSkillDto {
	id: string;
	name: string;
	slug: string;
}

export interface CatalogInterestDto {
	id: string;
	name: string;
	slug: string;
	skills: CatalogSkillDto[];
}

export interface GetOnboardingCatalogResponse {
	interests: CatalogInterestDto[];
}
