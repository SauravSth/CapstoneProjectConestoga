import jwt from 'jsonwebtoken';

const tokenVerifier = (req, res) => {
	const { token } = req.body;
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
					// console.log(decodedToken);
					res.status(200).json({ decodedToken });
				}
			}
		);
	}
};

export default tokenVerifier;
