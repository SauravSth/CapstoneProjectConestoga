import multer from 'multer';
import path from 'path';

const uploadDir = path.join('./public/images/');
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		const baseName = path.parse(file.originalname).name;
		cb(
			null,
			`${baseName}-${uniqueSuffix}${path.extname(file.originalname)}`
		);
	},
});

const fileFilter = (req, file, cb) => {
	const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg'];
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error('Only images are allowed'));
	}
};

const fileUploadHelper = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
});

export default fileUploadHelper;
