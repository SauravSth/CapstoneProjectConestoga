import jwt from 'jsonwebtoken';

const authentication = (req, res, next) => {
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
					if (!decodedToken.isVerified) {
						return res
							.status(400)
							.cookie('jwt', '', { maxAge: 1 })
							.json({
								success: false,
								message: 'Please verify your account.',
							});
					}
					if (!decodedToken.isActive) {
						return res
							.status(400)
							.cookie('jwt', '', { maxAge: 1 })
							.json({
								success: false,
								message: 'Your account has been deactivated.',
							});
					}
					req.user = {
						uid: decodedToken.id,
						userType: decodedToken.userType,
						email: decodedToken.email,
					};
					next();
				}
			}
		);
	} else {
		res.status(400).json({
			success: false,
			message: 'Not Logged In',
		});
	}
};

export default authentication;
