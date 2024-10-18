const errorHandler = {
	handleErrors: (err) => {
		let errors = {
			username: '',
			firstName: '',
			lastName: '',
			email: '',
			password: '',
		};

		if (err.message === 'Incorrect Email') {
			errors.email = 'Email is not registered';
		}
		if (err.message === 'Incorrect Password') {
			errors.password = 'Password is incorrect';
		}
		if (err.code === 11000) {
			if (Object.keys(err.keyValue)[0] === 'email') {
				errors.email = 'Email is already registered';
			}
			if (Object.keys(err.keyValue)[0] === 'username') {
				errors.username = 'Username is already registered';
			}
			return { success: false, errors };
		}
		if (err.message.includes('User validation failed')) {
			Object.values(err.errors).forEach(({ properties }) => {
				errors[properties.path] = properties.message;
			});
		}
		return { success: false, errors };
	},
};

export default errorHandler;
