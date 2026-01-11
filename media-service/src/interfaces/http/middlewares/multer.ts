import multer from "multer";

const storage = multer.memoryStorage();

export const uploadConfig = multer({
	storage: storage,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB limit
	},
});
