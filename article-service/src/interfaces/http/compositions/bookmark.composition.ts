import { BookMarkService } from "../../../application/services/bookmark.service";
import { BookMarkRepository } from "../../../infrastructure/database/repositories/bookmark.repository";
import { BookMarkController } from "../controllers/bookmark.controller";

export function createBookmarkController(): BookMarkController {
	const bookMarkRepository = new BookMarkRepository();
	const bookmarkService = new BookMarkService(bookMarkRepository);
	return new BookMarkController(bookmarkService);
}
