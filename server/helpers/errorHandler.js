const errorHandler = {
	handleAuthErrors: (err) => {
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
	handleStoreErrors: (err) => {
		let errors = {
			name: '',
		};
		if (err.code === 11000) {
			errors.name = 'Store already exists';
			return { success: false, errors };
		}

		if (err.message.includes('Store validation failed')) {
			Object.values(err.errors).forEach(({ properties }) => {
				errors[properties.path] = properties.message;
			});
		}
		return { success: false, errors };
	},
	handleItemErrors: (err) => {
		let errors = {
			name: '',
			quantity: '',
			price: '',
			category: '',
		};

		if (err.message.includes('Item validation failed')) {
			Object.values(err.errors).forEach(({ properties }) => {
				errors[properties.path] = properties.message;
			});
		}
		return { success: false, errors };
	},
	handleCategoryErrors: (err) => {
		let errors = {
			name: '',
		};
		if (err.code === 11000) {
			errors.name = 'Category already exists';
			return { success: false, errors };
		}
		if (err.message.includes('Category validation failed')) {
			Object.values(err.errors).forEach(({ properties }) => {
				errors[properties.path] = properties.message;
			});
		}
		return { success: false, errors };
	},
	handleBudgetErrors: (err) => {
		let errors = {
			title: '',
			amount: '',
		};
		if (err.code === 11000) {
			errors.name = 'Budget already exists';
			return { success: false, errors };
		}
		if (err.message.includes('Budget validation failed')) {
			Object.values(err.errors).forEach(({ properties }) => {
				errors[properties.path] = properties.message;
			});
		}
		return { success: false, errors };
	},
	handleGoalErrors: (err) => {
		let errors = {
			title: '',
			amount: '',
		};
		if (err.code === 11000) {
			errors.name = 'Goal already exists';
			return { success: false, errors };
		}
		if (err.message.includes('Goal validation failed')) {
			Object.values(err.errors).forEach(({ properties }) => {
				errors[properties.path] = properties.message;
			});
		}
		return { success: false, errors };
	},
	handleGroupErrors: (err) => {
		let errors = {
			name: '',
		};
		console.log(err);
		if (err.code === 11000) {
			errors.name = 'Group already exists';
			return { success: false, errors };
		}
		if (err.message.includes('Group validation failed')) {
			Object.values(err.errors).forEach(({ properties }) => {
				errors[properties.path] = properties.message;
			});
		}
		return { success: false, errors };
	},
	handleExpenseErrors: (err) => {
		let errors = {
			title: '',
			date: '',
			amount: '',
		};
		console.log(err);
		if (err.code === 11000) {
			errors.name = 'Expense already exists';
			return { success: false, errors };
		}
		if (err.message.includes('Expense validation failed')) {
			Object.values(err.errors).forEach(({ properties }) => {
				errors[properties.path] = properties.message;
			});
		}
		return { success: false, errors };
	},
	handleGroupExpenseErrors: (err) => {
		let errors = {
			title: '',
			date: '',
			amount: '',
		};
		console.log(err);
		if (err.code === 11000) {
			errors.name = 'GroupExpense already exists';
			return { success: false, errors };
		}
		if (err.message.includes('GroupExpense validation failed')) {
			Object.values(err.errors).forEach(({ properties }) => {
				errors[properties.path] = properties.message;
			});
		}
		return { success: false, errors };
	},
	handleTransactionErrors: (err) => {
		let errors = {
			title: '',
			paidAmount: '',
			date: '',
		};
		console.log(err);
		if (err.code === 11000) {
			errors.name = 'Transaction already exists';
			return { success: false, errors };
		}
		if (err.message.includes('Transaction validation failed')) {
			Object.values(err.errors).forEach(({ properties }) => {
				errors[properties.path] = properties.message;
			});
		}
		return { success: false, errors };
	},
};

export default errorHandler;
