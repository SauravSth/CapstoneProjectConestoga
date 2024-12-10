import SplitPerMember from '../models/splitPerMemberModel.js';

const splitPerMemberController = {
	getSplitPerMember: async (req, res) => {
		try {
			const { groupExpense_id } = req.params;

			const splits = await SplitPerMember.find({ groupExpense_id });

			res.status(200).json({ splits });
		} catch (e) {
			console.log(e);
		}
	},
	getSplitPerOneMember: async (req, res) => {
		try {
			const { uid } = req.user;
			const { groupExpense_id } = req.params;

			const splitPerMember = await SplitPerMember.findOne({
				user_id: uid,
				groupExpense_id,
			});

			res.status(200).json({ splitPerMember });
		} catch (e) {
			console.log(e);
		}
	},
};

export default splitPerMemberController;
