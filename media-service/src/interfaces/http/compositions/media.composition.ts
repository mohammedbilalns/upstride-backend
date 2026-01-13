import { CloudinaryService } from "../../../infrastructure/external/cloudinary.service";
import { UploadMediaUC } from "../../../application/usecases/upload-media.uc";
import { StreamMediaUC } from "../../../application/usecases/stream-media.uc";
import { DeleteMediaUC } from "../../../application/usecases/delete-media.uc";
import { GenerateSignatureUC } from "../../../application/usecases/generate-signature.uc";
import { GetSignedViewUrlUC } from "../../../application/usecases/get-signed-view-url.uc";
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
