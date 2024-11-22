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
	verificationCode: {
		type: Number,
	},
	userType: {
		type: String,
		default: 'user',
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	isActive: {
		type: Boolean,
		default: false,
	},
});

userSchema.statics.login = async function (email, password) {
	let user = this;

	const userData = await user.findOne({ email });
	if (userData) {
		const auth = await bcrypt.compare(password, userData.password);
		if (auth) {
			return userData;
		}
		throw Error('Incorrect Password');
	}
	throw Error('Incorrect Email');
};

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
