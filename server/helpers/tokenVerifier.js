import jwt from 'jsonwebtoken';

const tokenVerifier = (req, res, next) => {
	const token = req.cookie.jwt;

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
					console.log(decodedToken);
				}
			}
		);
	}
};

export default tokenVerifier;
