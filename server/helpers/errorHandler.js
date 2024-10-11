const errorController = {
	handleSignUpErrors: (err) => {
		let errors = {
			username: '',
			firstName: '',
			lastName: '',
			email: '',
			password: '',
		};

		if (err.code === 11000) {
			errors.email = 'Email provided is already registered';
			return errors;
		}
		if (err.message.includes('User validation failed')) {
			Object.values(err.errors).forEach(({ properties }) => {
				errors[properties.path] = properties.message;
			});
		}

		return errors;
	},
};

export default errorController;
