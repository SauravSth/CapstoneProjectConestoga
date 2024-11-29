import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import GroupCard from './GroupCard';
import { FaPlus } from 'react-icons/fa';
import CustomModal from '../../modal/CustomModal';
import Member from './Member';

const Group = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showAddGroupForm, setShowAddGroupForm] = useState(false); // State for showing the add group form
  const [selectedGroup, setSelectedGroup] = useState(null); // Store the selected group
  const [emailInput, setEmailInput] = useState('');
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
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

  // Handle adding an email to the members list
  const handleAddEmail = () => {
    if (emailInput && validateEmail(emailInput)) {
      setNewGroup((prev) => ({
        ...prev,
        members: [...prev.members, emailInput],
      }));
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
  const handleInviteSubmit = async (e) => {
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
      const addedGroup = await response.json();

      // Refetch groups to ensure the UI updates correctly
      const fetchGroups = async () => {
        const response = await fetch('http://localhost:3000/api/group', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();
        setGroups(Array.isArray(data) ? data : data.groups || []);
      };

      fetchGroups(); // Refetch groups to update UI

      setShowInviteForm(false); // Close modal
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

  // Handle opening the invite modal when clicking a group card
  const handleCardClick = (group) => {
    setSelectedGroup(group); // Set the selected group
    setShowInviteForm(true); // Show the modal
  };

  // Reset form fields when modal is closed
  useEffect(() => {
    if (!showInviteForm && !showAddGroupForm) {
      setNewGroup({ name: '', description: '', members: [] });
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
            <form onSubmit={handleInviteSubmit}>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Group Name"
                  value={newGroup.name}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
                <textarea
                  placeholder="Group Description"
                  value={newGroup.description}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, description: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                ></textarea>

                {/* Email Input for Members */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Add Members (Emails)
                  </label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
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
                    {newGroup.members.map((email, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-100 rounded"
                      >
                        <span>{email}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEmail(email)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
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

                {/* Email Input for Members */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Add Members (Emails)
                  </label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
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
                    {newGroup.members.map((email, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-100 rounded"
                      >
                        <span>{email}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEmail(email)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
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
