import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: [true, 'Please enter a Username'],
		unique: true,
	},
	firstName: {
		type: String,
		required: [true, 'Please enter your first name'],
	},
	lastName: {
		type: String,
		required: [true, 'Please enter your last name'],
	},
	email: {
		type: String,
		required: [true, 'Please enter your email'],
		lowercase: true,
		unique: true,
		validate: [validator.isEmail, 'Please enter a valid email'],
	},
	password: {
		type: String,
		required: [true, 'Please enter your password'],
	},
});

userSchema.pre('save', function (next) {
	let user = this;
	bcrypt.hash(user.password, 5, (err, hash) => {
		if (err) {
			console.log('Hashing Error ' + err);
		} else {
			user.password = hash;
		}
		next();
	});
});

const user = mongoose.model('User', userSchema);

export default user;
