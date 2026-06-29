import React, { useState } from "react";
import { Edit2, Save } from "lucide-react";

const ProfileCard = () => {
  const [editableField, setEditableField] = useState(null);
  const [profile, setProfile] = useState({
    fullName: "",
    dob: "",
    mobile: "",
    email: "",
    maritalStatus: "-",
    gender: "-",
    incomeRange: "-",
    occupation: "-",
    fathersName: "-",
    address: "",
    pan: "******551N",
  });

  const handleEdit = (field) => setEditableField(field);

  const handleSave = (field, value) => {
    setProfile({ ...profile, [field]: value });
    setEditableField(null);
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex justify-center items-start py-12">
      <div className="bg-gray-800 w-full max-w-3xl rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8">
          <div className="bg-purple-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold">
            {profile.fullName.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{profile.fullName}</h2>
            <p className="text-gray-400 text-sm mt-1">PAN - {profile.pan}</p>
          </div>
        </div>

        {/* Personal Details */}
        <h3 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-2">
          Personal Details
        </h3>

        <div className="space-y-6">
          {Object.keys(profile).map(
            (key) =>
              key !== "pan" && (
                <div
                  key={key}
                  className="flex justify-between items-center border-b border-gray-700 pb-2"
                >
                  <div className="w-full">
                    <p className="text-sm text-gray-400 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </p>

                    {editableField === key ? (
                      <input
                        type="text"
                        defaultValue={profile[key]}
                        onBlur={(e) => handleSave(key, e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded p-2 mt-1 text-gray-100 w-full outline-none"
                        autoFocus
                      />
                    ) : (
                      <p className="text-gray-200">{profile[key]}</p>
                    )}
                  </div>

                  {editableField === key ? (
                    <Save
                      className="text-teal-400 cursor-pointer ml-4"
                      size={18}
                      onClick={() => setEditableField(null)}
                    />
                  ) : (
                    <Edit2
                      className="text-teal-400 cursor-pointer ml-4"
                      size={18}
                      onClick={() => handleEdit(key)}
                    />
                  )}
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
