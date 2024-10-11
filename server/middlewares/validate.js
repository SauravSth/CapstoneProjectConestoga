const validate = {
	doPasswordsMatch: (req, res, next) => {
		const { password, confirmPassword } = req.body;
		if (password !== confirmPassword)
			return res.status(401).json({
				success: false,
				message: 'The passwords do not match.',
			});
		next();
	},
	// ISEMPTY
	// MATCH REGEX
	// ISNUMBER
};

export default validate;
