import { Request, Response } from "express";
import env from "../../../infra/config/env";

export const filterArticlesByCategory = async (req:Request, res: Response) => {
	try {
		const category = req.query.category as string;
		const page = (req.query.page as string) || "1";
		const limit = (req.query.limit as string) || "10";
		const query = req.query.query as string | "";

		// retrieve the users from the identity service
		const response = await fetch(
			`${env.IDENTITY_SERVICE_URL}/api/mentor/${category}`,
		);
		const users = (await response.json()) as string[];

		// build the url to fetch the articles
		const baseUrl = `${env.ARTICLE_SERVICE_URL}/api/articles/by-users`;
		const url = new URL(baseUrl);

		url.searchParams.append("page", page);
		url.searchParams.append("limit", limit);
		url.searchParams.append("query", query);
		users.forEach((id: string) => {
			url.searchParams.append("authorIds", id);
		});

		// fetch the articles
		const articleResponse = await fetch(url);
		const articles = await articleResponse.json();

		res.json(articles);
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.json({ message: "Internal server error", error: err?.message });
	}
}	
