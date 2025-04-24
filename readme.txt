import { useState } from "react";
import { useCustomerContext } from "@/app/banker/context/CustomerContext";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface IdentificationItem {
  identType: string;
  identValue: string;
  taxIdInd: boolean;
  issuedLoc: string;
  issueDt: string;
  expDt: string;
}

const Identification = () => {
  const { customerResult, setCustomerResult } = useCustomerContext();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nameData, setNameData] = useState({
    mothersMaidenName: customerResult?.personParty?.mothersMaidenName || "",
    pswd: customerResult?.personParty?.pswd || "",
    pswdClue: customerResult?.personParty?.pswdClue || "",
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<IdentificationItem>({
    identType: "",
    identValue: "",
    taxIdInd: false,
    issuedLoc: "",
    issueDt: "",
    expDt: "",
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNameData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNameEditToggle = async () => {
    if (isEditingName) {
      try {
        setIsLoading(true);
        const response = await fetch('/api/update-name', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mothersMaidenName: nameData.mothersMaidenName, pswd: nameData.pswd, pswdClue: nameData.pswdClue })
        });
        if (!response.ok) throw new Error('Failed to update name');

        setCustomerResult({
          ...customerResult,
          personParty: {
            ...customerResult.personParty,
            mothersMaidenName: nameData.mothersMaidenName, 
            pswd: nameData.pswd, 
            pswdClue: nameData.pswdClue
          },
        });

        toast.success("Name updated successfully");
      } catch (error) {
        console.error('Error updating name:', error);
        toast.error("Failed to update name");
      } finally {
        setIsLoading(false);
      }
    }
    setIsEditingName(!isEditingName);
  };

  const updateIdentification = async (id: string, data: any) => {
    const res = await fetch('http://localhost:4000/customer/ident', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        partyId: customerResult?.partyId,
        identification: {
          identType: data.identType,
          identValue: data.identValue,
          issueDt: data.issueDt,
          expDt: data.expDt,
          issuedLoc: data.issuedLoc
        }
      })
    });
    if (!res.ok) throw new Error('Failed to update');
    return await res.json();
  };

  const deleteIdentification = async (id: string) => {
    const res = await fetch(`/api/delete-identification?id=${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
  };

  const handleEditToggle = async (item: IdentificationItem) => {
    if (editId === item.identType) {
      try {
        setIsLoading(true);
        await updateIdentification(editId, editData);
        const updated = customerResult.identification.map((i: IdentificationItem) =>
          i.identType === editId ? { ...i, ...editData } : i
        );
        setCustomerResult({
          ...customerResult,
          identification: updated
        });
        toast.success("Identification updated successfully");
        setEditId(null);
      } catch (err) {
        console.error('Failed to update identification');
        toast.error("Failed to update identification");
      } finally {
        setIsLoading(false);
      }
    } else {
      setEditId(item.identType);
      setEditData({ ...item });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteIdentification(id);
      const updated = customerResult.identification.filter(
        (i: IdentificationItem) => i.identType !== id
      );
      setCustomerResult({
        ...customerResult,
        personParty: { ...customerResult.personParty, identification: updated },
      });
      toast.success("Identification deleted successfully");
    } catch (err) {
      console.error('Failed to delete identification');
      toast.error("Failed to delete identification");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 text-sm">
      {isLoading && <p className="text-blue-500 text-sm col-span-2">Processing...</p>}

      {/* Overview Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Overview</h3>
          <div className="flex gap-4">
            {isEditingName ? (
              <>
                <div className="inline-flex items-center justify-center bg-blue-600 text-white px-3 py-1 rounded text-sm cursor-pointer" onClick={handleNameEditToggle}>Save</div>
                <div className="inline-flex items-center justify-center bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm cursor-pointer" onClick={() => setIsEditingName(false)}>Cancel</div>
              </>
            ) : (
              <div className="inline-flex items-center justify-center bg-blue-600 text-white px-3 py-1 rounded text-sm cursor-pointer" onClick={handleNameEditToggle}>Edit</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <p><strong>Mothers Maiden Name:</strong> {isEditingName ? <input name="mothersMaidenName" value={nameData.mothersMaidenName} onChange={handleNameChange} className="border px-2 py-1 rounded w-full" /> : customerResult?.personParty?.mothersMaidenName || "-"}</p>
          <p><strong>Password:</strong> {isEditingName ? <input name="pswd" value={nameData.pswd} onChange={handleNameChange} className="border px-2 py-1 rounded w-full" /> : customerResult?.personParty?.pswd || "-"}</p>          
          <p><strong>Password Clue:</strong> {isEditingName ? <input name="pswdClue" value={nameData.pswdClue} onChange={handleNameChange} className="border px-2 py-1 rounded w-full" /> : customerResult?.personParty?.pswdClue || "-"}</p>
        </div>
      </div>

      {/* Documentary Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Documentary</h3>
        </div>
        {customerResult?.identification?.length > 0 ? (
          customerResult.identification.map((item: IdentificationItem) => (
            <div key={item.identType} className="border-b border-gray-200 pb-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <p><strong>ID Type:</strong> {editId === item.identType ? <input name="identType" value={editData.identType} onChange={handleEditChange} className="border px-2 py-1 rounded w-full" /> : item.identType}</p>
                <p><strong>ID Number:</strong> {editId === item.identType ? <input name="identValue" value={editData.identValue} onChange={handleEditChange} className="border px-2 py-1 rounded w-full" /> : item.identValue}</p>
                <p><strong>Issued Date:</strong> {editId === item.identType ? <input name="issueDt" value={editData.issueDt} onChange={handleEditChange} className="border px-2 py-1 rounded w-full" /> : item.issueDt}</p>
                <p><strong>Expiration Date:</strong> {editId === item.identType ? <input name="expDt" value={editData.expDt} onChange={handleEditChange} className="border px-2 py-1 rounded w-full" /> : item.expDt}</p>
                <p><strong>Issuing Entity:</strong> {editId === item.identType ? <input name="issuedLoc" value={editData.issuedLoc} onChange={handleEditChange} className="border px-2 py-1 rounded w-full" /> : item.issuedLoc}</p>
                <p><strong>Issuing Location:</strong> {editId === item.identType ? <input name="issuedLoc" value={editData.issuedLoc} onChange={handleEditChange} className="border px-2 py-1 rounded w-full" /> : item.issuedLoc}</p>
              </div>
              <div className="flex justify-end gap-4 mt-2">
                {editId === item.identType ? (
                  <>
                    <div className="inline-flex items-center justify-center bg-blue-600 text-white px-3 py-1 rounded text-sm cursor-pointer" onClick={() => handleEditToggle(item)}>Save</div>
                    <div className="inline-flex items-center justify-center bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm cursor-pointer" onClick={() => setEditId(null)}>Cancel</div>
                  </>
                ) : (
                  <div className="inline-flex items-center justify-center bg-blue-600 text-white px-3 py-1 rounded text-sm cursor-pointer" onClick={() => handleEditToggle(item)}>Edit</div>
                )}
                <div className="inline-flex items-center justify-center bg-red-600 text-white px-3 py-1 rounded text-sm cursor-pointer" onClick={() => handleDelete(item.identType)}>Delete</div>
              </div>
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
