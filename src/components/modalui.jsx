import { FaPen } from "react-icons/fa";

export default function ModalUI({
  isOpen,
  onClose,
  formData,
  handleChange,
  handleFileChange,
  handleIconClick,
  handleSubmit,
}) {
  return (
    <div className="h-full bg-gradient-to-br from-blue-100 via-purple-200 to-pink-200 p-8">
      <h2 className="text-3xl font-bold text-purple-500 text-center mb-4 drop-shadow-lg">
        Update Profile
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="relative w-32 h-32 mx-auto mb-4">
          {formData.profile ? (
            <img
              src={formData.preview || formData.profile}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500 font-bold">No Profile</span>
            </div>
          )}

          <div
            className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow-md hover:bg-purple-200"
            onClick={handleIconClick}
          >
            <FaPen className="text-purple-600" />
          </div>
        </div>

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
        />
        <input
          type="text"
          name="phone"
          placeholder="Enter Phone"
          value={formData.phone}
          onChange={handleChange}
          className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex justify-between mt-5">
          <button
            type="submit"
            className="bg-white text-purple-700 font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-purple-200 transition"
          >
            Update
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-purple-500 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-purple-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
