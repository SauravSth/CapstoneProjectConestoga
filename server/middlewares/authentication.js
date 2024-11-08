import jwt from 'jsonwebtoken';

const authentication = (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
			if (err) {
				res.status(401).json({
					success: false,
					message: err.message,
				});
			} else {
				next();
			}
		});
	} else {
		res.status(401).json({
			success: false,
			message: 'Please Login First',
		});
	}
};

export default authentication;
