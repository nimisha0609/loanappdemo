import { useState } from "react";
import { useCustomerContext } from "@/app/banker/context/CustomerContext";

const Identification = () => {
    const { customerResult, setCustomerResult } = useCustomerContext();
    console.log("customerResult ", customerResult);

    // Overview section state
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameData, setNameData] = useState({
        firstName: customerResult?.personParty?.firstName || "",
        lastName: customerResult?.personParty?.lastName || "",
    });

    // Documentary section state
    const [editId, setEditId] = useState<string | null>(null);
    const [editData, setEditData] = useState({
        identType: "",
        identValue: "",
        taxIdInd: false,
        issuedLoc: "",
        issueDt: "",
        expDt: "",
    });

    // Handle name changes
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

    // Handle identification editing
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
        <div className="space-y-6">
            {/* Overview Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between mb-4">

                </div>
                <h3>Overview</h3>
                {!isEditingName ? (
                    <>
                        <p>
                            <strong>First Name:</strong>{" "}
                            {customerResult?.personParty?.firstName || "-"}
                        </p>
                        <p>
                            <strong>Last Name:</strong>{" "}
                            {customerResult?.personParty?.lastName || "-"}
                        </p>
                        <button onClick={() => setIsEditingName(true)}>Edit</button>
                    </>
                ) : (
                    <>
                        <input
                            name="firstName"
                            value={nameData.firstName}
                            onChange={handleNameChange}
                            placeholder="First Name"
                            style={{ marginRight: "1rem" }}
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
                {customerResult?.identification?.length > 0 ? (
                    customerResult.identification.map((item) => (
                        <div
                            key={item.identType}
                            style={{
                                borderBottom: "1px solid #ccc",
                                paddingBottom: "0.5rem",
                                marginBottom: "1rem",
                            }}
                        >
                            {editId === item.identType ? (
                                <>
                                    <input
                                        name="idType"
                                        value={editData.identType}
                                        onChange={handleEditChange}
                                        placeholder="ID Type"
                                        style={{ marginRight: "1rem" }}
                                    />
                                    <input
                                        name="idValue"
                                        value={editData.identValue}
                                        onChange={handleEditChange}
                                        placeholder="ID Value"
                                        style={{ marginRight: "1rem" }}
                                    />
                                    <input
                                        name="idIssueLoc"
                                        value={editData.issuedLoc}
                                        onChange={handleEditChange}
                                        placeholder="ID Issued Location"
                                        style={{ marginRight: "1rem" }}
                                    />
                                    <input
                                        name="idIssueDt"
                                        value={editData.issueDt}
                                        onChange={handleEditChange}
                                        placeholder="ID Issued Date"
                                        style={{ marginRight: "1rem" }}
                                    />
                                    <input
                                        name="idExpDt"
                                        value={editData.expDt}
                                        onChange={handleEditChange}
                                        placeholder="ID Expiry Date"
                                        style={{ marginRight: "1rem" }}
                                    />
                                    <br />
                                    <button onClick={handleEditSave}>Save</button>
                                    <button onClick={() => setEditId(null)}>Cancel</button>
                                </>
                            ) : (
                                <>

                                    <p><strong>ID Type: </strong>{item.identType}</p>
                                    <p><strong>ID Value: </strong>{item.identValue}</p>
                                    <p><strong>ID Issued Location: </strong>{item.issuedLoc}</p>
                                    <p><strong>ID Issued Date: </strong>{item.issueDt}</p>
                                    <p><strong>ID Expiry Date: </strong>{item.expDt}  </p>
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
