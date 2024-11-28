import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import GroupCard from './GroupCard';
import { FaPlus } from 'react-icons/fa';
import CustomModal from '../../modal/CustomModal';

const Group = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    members: [], // Array to hold email IDs
  });
  const [emailInput, setEmailInput] = useState('');

  // Fetch groups from the backend
  useEffect(() => {
    const fetchGroups = async () => {
      const response = await fetch('http://localhost:3000/api/group');
      const data = await response.json();
      console.log('groupData', data);

      setGroups(Array.isArray(data) ? data : data.groups || []);
    };

    fetchGroups();
  }, []);

  // Handle adding a new group
  const handleInviteSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3000/api/group', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGroup),
    });

    if (response.ok) {
      const addedGroup = await response.json();

      // Refetch groups to ensure the UI updates correctly
      const fetchGroups = async () => {
        const response = await fetch('http://localhost:3000/api/group');
        const data = await response.json();
        setGroups(Array.isArray(data) ? data : data.groups || []);
      };

      fetchGroups(); // Refetch groups to update UI

      setShowInviteForm(false); // Close modal
    } else {
      alert('Error creating group');
    }
  };

  // Handle adding an email to the members list
  const handleAddEmail = () => {
    if (emailInput && validateEmail(emailInput)) {
      setNewGroup((prev) => ({
        ...prev,
        members: [...prev.members, emailInput],
      }));
      setEmailInput(''); // Clear the input field
    } else {
      alert('Please enter a valid email address');
    }
  };

  // Handle removing an email from the members list
  const handleRemoveEmail = (email) => {
    setNewGroup((prev) => ({
      ...prev,
      members: prev.members.filter((e) => e !== email),
    }));
  };

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Reset form fields when modal is closed
  useEffect(() => {
    if (!showInviteForm) {
      setNewGroup({ name: '', description: '', members: [] });
      setEmailInput('');
    }
  }, [showInviteForm]);

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
            />
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none">
              Filter by Date
            </button>
          </div>
          <button
            onClick={() => setShowInviteForm(true)}
            className="ml-4 px-4 py-2 text-black rounded-lg focus:outline-none"
            style={{ backgroundColor: '#80C028', opacity: '0.45' }}
          >
            <FaPlus className="inline mr-2" /> Add Group
          </button>

          {/* Invite Group Form Modal */}
          <CustomModal
            title="Create a New Group"
            isOpen={showInviteForm}
            onClose={() => setShowInviteForm(false)}
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
                  required
                  className="w-full p-2 border rounded"
                />
                <textarea
                  placeholder="Group Description"
                  value={newGroup.description}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, description: e.target.value })
                  }
                  required
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
                  onClick={() => setShowInviteForm(false)}
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

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {groups.map((group) => (
              <GroupCard
                key={group._id}
                group={group}
                // onEdit={handleEditGroup}
                // onDelete={handleDeleteGroup}
                onClick={() => navigate(`/group/${group._id}`)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Group;
