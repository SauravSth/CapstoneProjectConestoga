import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import GroupCard from './GroupCard';
import { FaPlus } from 'react-icons/fa';
import CustomModal from '../../modal/CustomModal';
// import Member from './Member';

const Group = () => {
	const navigate = useNavigate();
	const [groups, setGroups] = useState([]);
	const [groupID, setGroupID] = useState('');
	const [showInviteForm, setShowInviteForm] = useState(false);
	const [showAddGroupForm, setShowAddGroupForm] = useState(false); // State for showing the add group form
	const [selectedGroup, setSelectedGroup] = useState(null); // Store the selected group
	const [emailInput, setEmailInput] = useState('');
	const [memberEmails, setMemberEmails] = useState([]);
	const [newGroup, setNewGroup] = useState({
		name: '',
		members: [], // Array to hold email IDs
	});
	const [searchQuery, setSearchQuery] = useState(''); // Added state for search query

	// Fetch groups from the backend
	useEffect(() => {
		const fetchGroups = async () => {
			const response = await fetch('http://localhost:3000/api/group', {
				method: 'GET',
				credentials: 'include',
			});
			const data = await response.json();
			console.log('groupData', data);

			setGroups(Array.isArray(data) ? data : data.groups || []);
		};

		fetchGroups();
	}, []);

	const handleAddEmail = async () => {
		if (emailInput && validateEmail(emailInput)) {
			// Append the new email to the existing list of members
			setNewGroup((prev) => ({
				...prev,
				members: [...prev.members, emailInput], // Add the email to the existing list
			}));
			console.log('Upoadte', newGroup);

			// Make the API call to invite the new member to the group
			await fetch('http://localhost:3000/api/group/inviteToGroup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					email: emailInput,
					group_id: groupID,
				}),
			});

			// Clear the input field after adding the email
			setEmailInput('');
		} else {
			alert('Please enter a valid email address');
		}
	};

	// Email validation function
	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	// Handle creating group (inviting members)
	const handleAddNewGroup = async (e) => {
		e.preventDefault();

		const response = await fetch('http://localhost:3000/api/group', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify(newGroup),
		});

		if (response.ok) {
			// const addedGroup = await response.json();

			// Refetch groups to ensure the UI updates correctly
			const fetchGroups = async () => {
				const response = await fetch(
					'http://localhost:3000/api/group',
					{
						method: 'GET',
						credentials: 'include',
					}
				);

				const data = await response.json();
				setGroups(Array.isArray(data) ? data : data.groups || []);
			};

			fetchGroups();
			setShowInviteForm(false); // Close modal
		} else {
			alert('Error creating group');
		}
	};

	const handleInviteSubmit = async (e) => {
		e.preventDefault();

		// Ensure the group has the current list of members (emails)
		const updatedGroup = {
			...newGroup,
			members: [...newGroup.members, ...memberEmails], // Add any new member emails
		};

		// Make the API call to create the new group with the updated members list
		const response = await fetch(
			`http://localhost:3000/api/group/${groupID}`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(updatedGroup), // Send the updated group with emails
			}
		);

		if (response.ok) {
			// Refetch groups to ensure the UI updates correctly
			const fetchGroups = async () => {
				const response = await fetch(
					'http://localhost:3000/api/group',
					{
						method: 'GET',
						credentials: 'include',
					}
				);

				const data = await response.json();
				setGroups(Array.isArray(data) ? data : data.groups || []);
			};

			fetchGroups(); // Call to update the groups list in the UI
			setShowInviteForm(false); // Close the modal after creating the group
		} else {
			alert('Error creating group');
		}
	};

	// Handle removing an email from the members list
	const handleRemoveEmail = (email) => {
		setNewGroup((prev) => ({
			...prev,
			members: prev.members.filter((e) => e !== email),
		}));
	};

	// Initialize groupID state

	useEffect(() => {
		if (groupID) {
			console.log('Group ID updated:', groupID);
			// Proceed with API calls or other actions that depend on groupID
		}
	}, [groupID]); // This effect runs whenever groupID is updated

	const handleCardClick = async (group) => {
		setSelectedGroup(group); // Set the selected group
		setShowInviteForm(true);

		setGroupID(group._id); // This will trigger the useEffect when groupID is updated
		console.log('Group ID being set:', group._id); // Log for verification

		// Extract user_ids from the members array of the selected group
		const memberIds = group.members.map((member) => member.user_id);
		console.log('Member IDs:', memberIds);

		// Fetch details of each user_id if needed
		const fetchMemberDetails = async () => {
			try {
				const memberDetails = await Promise.all(
					memberIds.map(async (userId) => {
						const response = await fetch(
							`http://localhost:3000/api/userDetail/${userId}`,
							{
								method: 'GET',
								credentials: 'include',
							}
						);
						if (!response.ok) {
							throw new Error(
								`Failed to fetch details for user ID: ${userId}`
							);
						}
						const userData = await response.json();
						return userData;
					})
				);

				console.log('Member Details:', memberDetails);

				// Extract emails from the fetched member details
				const emails = memberDetails.map(
					(memberDetail) => memberDetail.user.email
				);
				setMemberEmails(emails); // Update the state with member emails
			} catch (error) {
				console.error('Error fetching member details:', error);
			}
		};

		fetchMemberDetails(); // Call the function to fetch member details
	};

	// Reset form fields when modal is closed
	useEffect(() => {
		if (!showInviteForm && !showAddGroupForm) {
			setNewGroup({ name: '', members: [] });
			setEmailInput('');
		}
	}, [showInviteForm, showAddGroupForm]);

	// Filter groups based on search query
	const filteredGroups = groups.filter((group) =>
		group.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Handle adding a new group (opening the add group modal)
	const handleAddGroup = () => {
		setShowAddGroupForm(true); // Open the add group modal
	};

	return (
		<div className="flex h-screen bg-gray-100">
			<aside className="w-64 bg-white shadow-lg">
				<Navbar />
			</aside>

			<div className="flex flex-col flex-grow">
				<Header title="Groups" />

				<main className="p-6 space-y-6">
					<div className="flex items-center space-x-4 max-w-lg">
						<input
							type="text"
							placeholder="Search groups"
							className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none">
							Filter by Date
						</button>
					</div>

					<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
						{filteredGroups.map((group) => (
							<GroupCard
								key={group._id}
								group={group}
								onClick={() => handleCardClick(group)} // Open the modal on click
							/>
						))}
					</div>

					{/* Add Group Button */}
					<div className="flex justify-end mt-6">
						<button
							onClick={handleAddGroup}
							className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
						>
							<FaPlus className="mr-2" />
							Add Group
						</button>
					</div>

					{/* Add New Group Form Modal */}
					<CustomModal
						title="Create New Group"
						isOpen={showAddGroupForm}
						onClose={() => setShowAddGroupForm(false)}
					>
						<form onSubmit={handleAddNewGroup}>
							<div className="space-y-2">
								<input
									type="text"
									placeholder="Group Name"
									value={newGroup.name}
									onChange={(e) =>
										setNewGroup({
											...newGroup,
											name: e.target.value,
										})
									}
									className="w-full p-2 border rounded"
								/>

								{/* Email Input for Members */}
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Add Members (Emails)
									</label>
									<div className="flex items-center space-x-2 mt-2">
										<input
											type="email"
											value={emailInput}
											onChange={(e) =>
												setEmailInput(e.target.value)
											}
											placeholder="Enter email address"
											className="flex-grow p-2 border rounded"
										/>
										<button
											type="button"
											onClick={handleAddEmail}
											className="px-4 py-2 bg-blue-500 text-white rounded"
										>
											Add
										</button>
									</div>
								</div>

								{/* Render Added Emails */}
								{newGroup.members.length > 0 && (
									<div className="mt-4 space-y-2">
										{newGroup.members.map(
											(email, index) => (
												<div
													key={index}
													className="flex items-center justify-between p-2 bg-gray-100 rounded"
												>
													<span>{email}</span>
													<button
														type="button"
														onClick={() =>
															handleRemoveEmail(
																email
															)
														}
														className="text-red-500 hover:text-red-700"
													>
														Remove
													</button>
												</div>
											)
										)}
									</div>
								)}
							</div>
							<div className="flex justify-end space-x-4 mt-4">
								<button
									type="button"
									onClick={() => setShowAddGroupForm(false)}
									className="px-4 py-2 bg-gray-200 text-gray-600 rounded"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 bg-blue-500 text-white rounded"
								>
									Create Group
								</button>
							</div>
						</form>
					</CustomModal>

					{/* Invite Group Form Modal */}
					<CustomModal
						title="Invite Members to Group"
						isOpen={showInviteForm}
						onClose={() => setShowInviteForm(false)}
					>
						<form onSubmit={handleInviteSubmit}>
							<div className="space-y-2">
								<input
									type="text"
									placeholder="Group Name"
									value={selectedGroup?.name || ''}
									disabled
									className="w-full p-2 border rounded"
								/>

								{/* Render Email Inputs for Each Member */}
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Members' Emails
									</label>
									<div className="mt-2 space-y-2">
										{memberEmails.map((email, index) => (
											<input
												key={index}
												type="email"
												value={email}
												onChange={(e) =>
													handleEmailChange(
														e.target.value,
														index
													)
												}
												placeholder="Member Email"
												className="w-full p-2 border rounded"
											/>
										))}
									</div>
								</div>

								{/* Add New Email Input */}
								<div className="mt-4">
									<label className="block text-sm font-medium text-gray-700">
										Add New Member Email
									</label>
									<div className="flex items-center space-x-2 mt-2">
										<input
											type="email"
											value={emailInput}
											onChange={(e) =>
												setEmailInput(e.target.value)
											}
											placeholder="Enter new email address"
											className="flex-grow p-2 border rounded"
										/>
										<button
											type="button"
											onClick={handleAddEmail}
											className="px-4 py-2 bg-blue-500 text-white rounded"
										>
											Add
										</button>
									</div>
								</div>

								{/* Render New Added Emails */}
								{newGroup.members.length > 0 && (
									<div className="mt-4 space-y-2">
										{newGroup.members.map(
											(email, index) => (
												<div
													key={index}
													className="flex items-center justify-between p-2 bg-gray-100 rounded"
												>
													<span>{email}</span>
													<button
														type="button"
														onClick={() =>
															handleRemoveEmail(
																email
															)
														}
														className="text-red-500 hover:text-red-700"
													>
														Remove
													</button>
												</div>
											)
										)}
									</div>
								)}
							</div>
							<div className="flex justify-end space-x-4 mt-4">
								<button
									type="button"
									onClick={() => setShowInviteForm(false)}
									className="px-4 py-2 bg-gray-200 text-gray-600 rounded"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 bg-blue-500 text-white rounded"
								>
									Invite Members
								</button>
							</div>
						</form>
					</CustomModal>
				</main>
			</div>
		</div>
	);
};

export default Group;
