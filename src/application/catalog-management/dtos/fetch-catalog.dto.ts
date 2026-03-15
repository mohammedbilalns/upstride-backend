export interface FetchCatalogSkillDto {
	id: string;
	name: string;
	slug: string;
}

export interface FetchCatalogInterestDto {
	id: string;
	name: string;
	slug: string;
	skills: FetchCatalogSkillDto[];
}

export interface FetchCatalogProfessionDto {
	id: string;
	name: string;
	slug: string;
}

export interface FetchCatalogResponse {
	professions: FetchCatalogProfessionDto[];
	interests: FetchCatalogInterestDto[];
}
