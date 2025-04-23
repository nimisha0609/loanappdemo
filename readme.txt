import { useState } from 'react';
import { useCustomerContext } from '@/app/banker/context/CustomerContext';

const Identification = () => {
  const { customerResult, setCustomerResult } = useCustomerContext();

  // Overview section state
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameData, setNameData] = useState({
    firstName: customerResult?.party?.firstName || '',
    lastName: customerResult?.party?.lastName || '',
  });

  // Documentary section state
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ type: '', value: '' });

  // Handle name changes
  const handleNameChange = (e) => {
    const { name, value } = e.target;
    setNameData(prev => ({ ...prev, [name]: value }));
  };

  const handleNameSave = () => {
    setCustomerResult({
      ...customerResult,
      party: {
        ...customerResult.party,
        firstName: nameData.firstName,
        lastName: nameData.lastName,
      },
    });
    setIsEditingName(false);
  };

  // Handle identification editing
  const handleEdit = (item) => {
    setEditId(item.id);
    setEditData({ type: item.type, value: item.value });
  };

  const handleDelete = (id) => {
    const updated = customerResult.party.identification.filter(i => i.id !== id);
    setCustomerResult({
      ...customerResult,
      party: { ...customerResult.party, identification: updated },
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    const updated = customerResult.party.identification.map(i =>
      i.id === editId ? { ...i, ...editData } : i
    );
    setCustomerResult({
      ...customerResult,
      party: { ...customerResult.party, identification: updated },
    });
    setEditId(null);
  };

  return (
    <div style={{ padding: '1rem' }}>
      {/* Overview Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Overview</h3>
        {!isEditingName ? (
          <>
            <p><strong>First Name:</strong> {customerResult?.party?.firstName || '-'}</p>
            <p><strong>Last Name:</strong> {customerResult?.party?.lastName || '-'}</p>
            <button onClick={() => setIsEditingName(true)}>Edit</button>
          </>
        ) : (
          <>
            <input
              name="firstName"
              value={nameData.firstName}
              onChange={handleNameChange}
              placeholder="First Name"
              style={{ marginRight: '1rem' }}
            />
            <input
              name="lastName"
              value={nameData.lastName}
              onChange={handleNameChange}
              placeholder="Last Name"
            />
            <br />
            <button onClick={handleNameSave}>Save</button>
            <button onClick={() => setIsEditingName(false)}>Cancel</button>
          </>
        )}
      </div>

      {/* Documentary Section */}
      <div>
        <h3>Documentary</h3>
        {customerResult?.party?.identification?.length > 0 ? (
          customerResult.party.identification.map((item) => (
            <div key={item.id} style={{ borderBottom: '1px solid #ccc', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              {editId === item.id ? (
                <>
                  <input
                    name="type"
                    value={editData.type}
                    onChange={handleEditChange}
                    placeholder="ID Type"
                    style={{ marginRight: '1rem' }}
                  />
                  <input
                    name="value"
                    value={editData.value}
                    onChange={handleEditChange}
                    placeholder="ID Value"
                  />
                  <br />
                  <button onClick={handleEditSave}>Save</button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <p><strong>{item.type}</strong>: {item.value}</p>
                  <button onClick={() => handleEdit(item)}>Edit</button>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No identification details available.</p>
        )}
      </div>
    </div>
  );
};

export default Identification;
