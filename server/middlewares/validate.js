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
	isFieldEmpty: (req, res, next) => {
		for (let field of req.body) {
			if (field == '') {
				return res.status(400).json({
					success: false,
					message: 'Fields cannot be empty',
				});
			}
		}
		next();
	},
	// MATCH REGEX
	// ISNUMBER
};

export default validate;
