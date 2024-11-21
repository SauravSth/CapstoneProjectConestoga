const verificationCode = () => {
	const length = 8;
	let randomString = '';
	for (let i = 0; i < length; i++) {
		const ch = Math.floor(Math.random() * 10 + 1);
		randomString += ch;
	}
	return randomString;
};

export default verificationCode;
