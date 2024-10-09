const dataValidator = {
	isValidUserData: (req, res, next) => {
		next();
	},
	doPasswordsMatch: (req, res, next) => {
		const { password, confirmPassword } = req.body;
		if (password !== confirmPassword)
			return res.status(401).json({
				success: false,
				message: 'The passwords do not match.',
			});
		next();
	},
};

export default dataValidator;
