import validator from 'validator';

const sanitize = {
	// TRIM
	trimmer: (req, res, next) => {
		let trimmed = {};
		for (let obj in req.body) {
			trimmed[obj] = validator.trim(req.body[obj]);
		}

		req.body = trimmed;
		next();
	},
	// REMOVE ESCAPE CHARACTERS
};

export default sanitize;
