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
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    members: [],
  });
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const response = await fetch('http://localhost:3000/api/group', {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    setGroups(Array.isArray(data) ? data : data.groups || []);
  };

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
      fetchGroups(); // Refetch groups to update UI
      setShowInviteForm(false); // Close modal
    } else {
      alert('Error creating group');
    }
  };

  const handleEditGroup = (groupId) => {
    const groupToEdit = groups.find((group) => group._id === groupId);
    setSelectedGroup(groupToEdit);
    setNewGroup({
      name: groupToEdit.name,
      description: groupToEdit.description,
      members: groupToEdit.members || [],
    });
    setShowEditForm(true); // Open edit modal
  };

  const handleUpdateGroup = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `http://localhost:3000/api/group/${selectedGroup._id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newGroup),
      }
    );

    if (response.ok) {
      fetchGroups(); // Refetch groups to update UI
      setShowEditForm(false); // Close modal
    } else {
      alert('Error updating group');
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      const response = await fetch(
        `http://localhost:3000/api/group/${groupId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (response.ok) {
        fetchGroups(); // Refetch groups to update UI
      } else {
        alert('Error deleting group');
      }
    }
  };

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

  const handleRemoveEmail = (email) => {
    setNewGroup((prev) => ({
      ...prev,
      members: prev.members.filter((e) => e !== email),
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      <div className="flex flex-col flex-grow">
        <Header title="Groups" />

        <main className="p-6 space-y-6">
          <button
            onClick={() => setShowInviteForm(true)}
            className="ml-4 px-4 py-2 text-black rounded-lg focus:outline-none"
            style={{ backgroundColor: '#80C028', opacity: '0.45' }}
          >
            <FaPlus className="inline mr-2" /> Add Group
          </button>

          {/* Invite Group Modal */}
          <CustomModal
            title="Create a New Group"
            isOpen={showInviteForm}
            onClose={() => setShowInviteForm(false)}
          >
            <form onSubmit={handleInviteSubmit}>
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
              {/* Other inputs */}
            </form>
          </CustomModal>

          {/* Edit Group Modal */}
          <CustomModal
            title="Edit Group"
            isOpen={showEditForm}
            onClose={() => setShowEditForm(false)}
          >
            <form onSubmit={handleUpdateGroup}>
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

              {/* Members Management */}
              <div>
                {newGroup.members.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span>{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(email)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </form>
          </CustomModal>

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <GroupCard
                key={group._id}
                group={group}
                onEdit={handleEditGroup}
                onDelete={handleDeleteGroup}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Group;
