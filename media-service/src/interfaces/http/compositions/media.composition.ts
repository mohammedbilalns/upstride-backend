import { CloudinaryService } from "../../../infrastructure/external/cloudinary.service";
import { UploadMediaUC } from "../../../application/usecases/uploadMedia.uc";
import { StreamMediaUC } from "../../../application/usecases/streamMedia.uc";
import { DeleteMediaUC } from "../../../application/usecases/deleteMedia.uc";
import { GenerateSignatureUC } from "../../../application/usecases/generateSignature.uc";
import { GetSignedViewUrlUC } from "../../../application/usecases/getSignedViewUrl.uc";
import { MediaController } from "../controllers/media.controller";

export function createMediaController() {
	// External services
	const cloudinaryService = new CloudinaryService();

	// Use cases
	const uploadMediaUC = new UploadMediaUC(cloudinaryService);
	const streamMediaUC = new StreamMediaUC(cloudinaryService);
	const deleteMediaUC = new DeleteMediaUC(cloudinaryService);
	const generateSignatureUC = new GenerateSignatureUC(cloudinaryService);
	const getSignedViewUrlUC = new GetSignedViewUrlUC(cloudinaryService);

	return new MediaController(
		uploadMediaUC,
		streamMediaUC,
		deleteMediaUC,
		generateSignatureUC,
		getSignedViewUrlUC,
	);
}
