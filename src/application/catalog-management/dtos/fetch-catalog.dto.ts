export interface FetchCatalogSkillDto {
	id: string;
	name: string;
	slug: string;
	isActive: boolean;
}

export interface FetchCatalogInterestDto {
	id: string;
	name: string;
	slug: string;
	isActive: boolean;
	skills: FetchCatalogSkillDto[];
}

export interface FetchCatalogProfessionDto {
	id: string;
	name: string;
	slug: string;
	isActive: boolean;
}

export interface FetchCatalogResponse {
	professions: FetchCatalogProfessionDto[];
	interests: FetchCatalogInterestDto[];
}
