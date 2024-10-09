import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) return res.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_KEY_SECRET, (err, user) => {
		if (err) return res.status(403);

		req.user = user;
		next();
	});
};

export default authenticateToken;
