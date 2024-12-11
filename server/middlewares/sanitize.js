import validator from 'validator';

const sanitize = {
	trimmer: (req, res, next) => {
		let trimmed = {};
		for (let obj in req.body) {
			trimmed[obj] = validator.trim(req.body[obj]);
		}

		req.body = trimmed;
		next();
	},
};

export default sanitize;
