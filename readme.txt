import { useState } from "react";
import { useCustomerContext } from "@/app/banker/context/CustomerContext";

const Identification = () => {
  const { customerResult, setCustomerResult } = useCustomerContext();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameData, setNameData] = useState({
    firstName: customerResult?.personParty?.firstName || "",
    lastName: customerResult?.personParty?.lastName || "",
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    identType: "",
    identValue: "",
    taxIdInd: false,
    issuedLoc: "",
    issueDt: "",
    expDt: "",
  });

  const handleNameChange = (e) => {
    const { name, value } = e.target;
    setNameData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNameSave = () => {
    setCustomerResult({
      ...customerResult,
      personParty: {
        ...customerResult.personParty,
        firstName: nameData.firstName,
        lastName: nameData.lastName,
      },
    });
    setIsEditingName(false);
  };

  const handleEdit = (item) => {
    setEditId(item.identType);
    setEditData({
      identType: item.identType,
      identValue: item.identValue,
      taxIdInd: item.taxIdInd,
      issuedLoc: item.issuedLoc,
      issueDt: item.issueDt,
      expDt: item.expDt,
    });
  };

  const handleDelete = (id) => {
    const updated = customerResult.identification.filter(
      (i) => i.identType !== id
    );
    setCustomerResult({
      ...customerResult,
      personParty: { ...customerResult.personParty, identification: updated },
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    const updated = customerResult.identification.map((i) =>
      i.identType === editId ? { ...i, ...editData } : i
    );
    setCustomerResult({
      ...customerResult,
      party: { ...customerResult.party, identification: updated },
    });
    setEditId(null);
  };

  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Overview</h2>
          {!isEditingName && (
            <button
              onClick={() => setIsEditingName(true)}
              className="text-blue-600 hover:underline text-sm"
            >
              Edit
            </button>
          )}
        </div>

        {!isEditingName ? (
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
            <p><strong>First Name:</strong> {customerResult?.personParty?.firstName || "-"}</p>
            <p><strong>Last Name:</strong> {customerResult?.personParty?.lastName || "-"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <input
              name="firstName"
              value={nameData.firstName}
              onChange={handleNameChange}
              placeholder="First Name"
              className="border p-2 rounded w-full"
            />
            <input
              name="lastName"
              value={nameData.lastName}
              onChange={handleNameChange}
              placeholder="Last Name"
              className="border p-2 rounded w-full"
            />
            <div className="col-span-2 space-x-4">
              <button
                onClick={handleNameSave}
                className="bg-blue-600 text-white px-4 py-1 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditingName(false)}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Documentary Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Documentary</h2>
        {customerResult?.identification?.length > 0 ? (
          customerResult.identification.map((item) => (
            <div key={item.identType} className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm">
              {editId === item.identType ? (
                <div className="grid grid-cols-2 gap-4">
                  <input name="identType" value={editData.identType} onChange={handleEditChange} placeholder="ID Type" className="border p-2 rounded" />
                  <input name="identValue" value={editData.identValue} onChange={handleEditChange} placeholder="ID Value" className="border p-2 rounded" />
                  <input name="issuedLoc" value={editData.issuedLoc} onChange={handleEditChange} placeholder="Issued Location" className="border p-2 rounded" />
                  <input name="issueDt" value={editData.issueDt} onChange={handleEditChange} placeholder="Issued Date" className="border p-2 rounded" />
                  <input name="expDt" value={editData.expDt} onChange={handleEditChange} placeholder="Expiry Date" className="border p-2 rounded" />
                  <div className="col-span-2 space-x-4">
                    <button onClick={handleEditSave} className="bg-blue-600 text-white px-4 py-1 rounded">Save</button>
                    <button onClick={() => setEditId(null)} className="text-gray-600 hover:underline">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
                  <p><strong>ID Type:</strong> {item.identType}</p>
                  <p><strong>ID Value:</strong> {item.identValue}</p>
                  <p><strong>Issued Location:</strong> {item.issuedLoc}</p>
                  <p><strong>Issued Date:</strong> {item.issueDt}</p>
                  <p><strong>Expiry Date:</strong> {item.expDt}</p>
                  <div className="col-span-2 flex space-x-4">
                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">No identification details available.</p>
        )}
      </div>
    </div>
  );
};

export default Identification;
