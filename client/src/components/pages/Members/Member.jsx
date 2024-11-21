import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../layouts/Navbar';
import Header from '../../../layouts/Header';
import PersonCard from '../../ui/PersonCard';
import { FaPlus } from 'react-icons/fa';
import CustomModal from '../../modal/CustomModal';
const Member = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState([
    {
      id: 1,
      name: 'John Doe',
      contact: { email: 'john@example.com', phone: '123-456-7890' },
    },
    {
      id: 2,
      name: 'Jane Smith',
      contact: { email: 'jane@example.com', phone: '098-765-4321' },
    },
  ]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [newPerson, setNewPerson] = useState({
    name: '',
    email: '',
    position: '',
  });

  const handleInviteSubmit = async (e) => {
    e.preventDefault();

    // Mock sending an invite email
    console.log(`Sending invite to ${newPerson.email}...`);

    // Add the new person to the list
    setMember((prevMember) => [
      ...prevMember,
      {
        id: Date.now(),
        name: newPerson.name,
        position: newPerson.position,
        contact: { email: newPerson.email, phone: 'N/A' },
      },
    ]);

    setShowInviteForm(false);
  };

  // Reset form fields when modal is closed
  useEffect(() => {
    if (!showInviteForm) {
      setNewPerson({ name: '', email: '', comment: '' });
    }
  }, [showInviteForm]);

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg">
        <Navbar />
      </aside>

      <div className="flex flex-col flex-grow">
        <Header title="Members" />

        <main className="p-6 space-y-6">
          <div className="flex items-center space-x-4 max-w-lg">
            <input
              type="text"
              placeholder="Search members"
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
            <FaPlus className="inline mr-2" /> Add Person
          </button>

          {/* Invite Form Modal */}
          <CustomModal
            title="Invite a New Person"
            isOpen={showInviteForm}
            onClose={() => setShowInviteForm(false)}
          >
            <form onSubmit={handleInviteSubmit}>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={newPerson.name}
                  onChange={(e) =>
                    setNewPerson({ ...newPerson, name: e.target.value })
                  }
                  required
                  className="w-full p-2 border rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newPerson.email}
                  onChange={(e) =>
                    setNewPerson({ ...newPerson, email: e.target.value })
                  }
                  required
                  className="w-full p-2 border rounded"
                />
                <textarea
                  type="text"
                  placeholder="Comment"
                  value={newPerson.comment}
                  onChange={(e) =>
                    setNewPerson({ ...newPerson, comment: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                ></textarea>
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
                  Send Invite
                </button>
              </div>
            </form>
          </CustomModal>

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {member.map((person) => (
              <PersonCard
                key={person.id}
                name={person.name}
                comment={person.comment}
                contact={person.contact}
                onEdit={() => console.log(`Editing ${person.id}`)}
                onDelete={() =>
                  setMember((prev) => prev.filter((p) => p.id !== person.id))
                }
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Member;
