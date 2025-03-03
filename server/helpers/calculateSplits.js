const calculateSplits = async (splitType, amount, members, splitDetails) => {
	const splits = [];

	switch (splitType) {
		case 'evenly':
			const evenSplit = amount / members.length;
			members.forEach((member) => {
				splits.push({ member_id: member.user_id, amount: evenSplit });
			});
			break;

		case 'percent':
			if (!splitDetails || splitDetails.length !== members.length) {
				throw new Error('Invalid split details for percentage split.');
			}
			splitDetails.forEach((detail) => {
				splits.push({
					member_id: detail.user_id,
					amount: (amount * detail.percent) / 100,
				});
			});
			break;

		case 'amountOwed':
			if (!splitDetails || splitDetails.length !== members.length) {
				throw new Error(
					'Invalid split details for amount-based split.'
				);
			}
			splitDetails.forEach((detail) => {
				splits.push({
					member_id: detail.user_id,
					amount: detail.amountOwed,
				});
			});
			break;

		default:
			throw new Error('Invalid split type.');
	}
	return splits;
};

export default calculateSplits;
