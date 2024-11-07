import tokenVerifier from '../helpers/tokenVerifier.js';
import jwt from 'jsonwebtoken';

const tokenDecoder = (req, res, next) => {
	const token = req.cookies.jwt;
	if (token) {
		jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET,
			(err, decodedToken) => {
				if (err) {
					res.status(401).json({
						success: false,
						message: err.message,
					});
				} else {
					req.user = {
						uid: decodedToken.id,
						userType: decodedToken.userType,
					};
					next();
				}
			}
		);
	}
};

export default tokenDecoder;
