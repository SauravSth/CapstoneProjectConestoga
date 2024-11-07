import tokenVerifier from '../helpers/tokenVerifier.js';

const authorization = (req, res, next) => {
	// const token = req.cookies.jwt;
	// if (token) {
	// 	jwt.verify(
	// 		token,
	// 		process.env.ACCESS_TOKEN_SECRET,
	// 		(err, decodedToken) => {
	// 			if (err) {
	// 				res.status(401).json({
	// 					success: false,
	// 					message: err.message,
	// 				});
	// 			} else {
	// 				if (decodedToken.userType === 'admin') {
	// 					next();
	// 				}
	// 				res.status(401).json({
	// 					success: false,
	// 					message: 'Access not permitted',
	// 				});
	// 			}
	// 		}
	// 	);
	// }
};

export default authorization;
