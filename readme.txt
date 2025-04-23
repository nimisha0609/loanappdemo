import { useState } from "react";
import { useCustomerContext } from "@/app/banker/context/CustomerContext";
import { Pencil } from "lucide-react";

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

  const handleNameEditToggle = () => {
    if (isEditingName) {
      setCustomerResult({
        ...customerResult,
        personParty: {
          ...customerResult.personParty,
          firstName: nameData.firstName,
          lastName: nameData.lastName,
        },
      });
    }
    setIsEditingName(!isEditingName);
  };

  const handleEdit = (item) => {
    setEditId(item.identType);
    setEditData({ ...item });
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 text-sm">
      {/* Overview Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Overview</h3>
          <a
            href="#"
            className="text-blue-600 hover:underline flex items-center"
            onClick={handleNameEditToggle}
          >
            <Pencil size={16} className="mr-1" /> {isEditingName ? "Save" : "Edit"}
          </a>
        </div>

        {!isEditingName ? (
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Mothers Maiden Name:</strong> {customerResult?.personParty?.firstName || "-"}</p>
            <p><strong>Password:</strong> {customerResult?.personParty?.lastName || "-"}</p>
            <p><strong>Password Clue:</strong> -</p>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              name="firstName"
              value={nameData.firstName}
              onChange={handleNameChange}
              placeholder="First Name"
              className="border border-gray-300 px-3 py-2 rounded w-full"
            />
            <input
              name="lastName"
              value={nameData.lastName}
              onChange={handleNameChange}
              placeholder="Last Name"
              className="border border-gray-300 px-3 py-2 rounded w-full"
            />
          </div>
        )}
      </div>

      {/* Documentary Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Documentary</h3>
        </div>
        {customerResult?.identification?.length > 0 ? (
          customerResult.identification.map((item) => (
            <div key={item.identType} className="border-b border-gray-200 pb-4 mb-4">
              {editId === item.identType ? (
                <div className="grid grid-cols-2 gap-4">
                  <input name="identType" value={editData.identType} onChange={handleEditChange} className="border px-2 py-1 rounded" />
                  <input name="identValue" value={editData.identValue} onChange={handleEditChange} className="border px-2 py-1 rounded" />
                  <input name="issuedLoc" value={editData.issuedLoc} onChange={handleEditChange} className="border px-2 py-1 rounded" />
                  <input name="issueDt" value={editData.issueDt} onChange={handleEditChange} className="border px-2 py-1 rounded" />
                  <input name="expDt" value={editData.expDt} onChange={handleEditChange} className="border px-2 py-1 rounded" />
                  <div className="col-span-2 flex gap-3 mt-2">
                    <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={handleEditSave}>Save</button>
                    <button className="text-red-600" onClick={() => setEditId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <p><strong>ID Type:</strong> {item.identType}</p>
                  <p><strong>ID Number:</strong> {item.identValue}</p>
                  <p><strong>Issued Date:</strong> {item.issueDt}</p>
                  <p><strong>Expiration Date:</strong> {item.expDt}</p>
                  <p><strong>Issuing Entity:</strong> {item.issuedLoc}</p>
                  <p><strong>Issuing Location:</strong> {item.issuedLoc}</p>
                  <div className="col-span-2 flex justify-end gap-4">
                    <a href="#" className="flex items-center text-blue-600 hover:underline" onClick={() => handleEdit(item)}>
                      <Pencil size={16} className="mr-1" /> Edit
                    </a>
                    <a href="#" className="text-red-600 hover:underline" onClick={() => handleDelete(item.identType)}>Delete</a>
                  </div>
                </div>
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
