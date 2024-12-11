const authorization = (req, res, next) => {
	const { userType } = req.user;
	if (userType !== 'admin') {
		return res
			.status(401)
			.json({ success: false, message: 'Access not permitted' });
	}
	next();
};

export default authorization;
