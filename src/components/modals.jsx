import { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import axios from "axios";
import { toast } from "react-toastify";
import ModalUI from "./modalui";

Modal.setAppElement("#root");

const API_URL = process.env.REACT_APP_API_URL;

export default function Modals({ isOpen, onClose, userId }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    profile: "",
    preview: "",
  });

  const fileInputRef = useRef(null);

  const handleIconClick = () => fileInputRef.current.click();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profile: file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const nameRegex = /^[A-Za-z\s]{3,}$/;
  if (!nameRegex.test(formData.name)) {
    toast.error("Name must be at least 3 characters and only letters.");
    return;
  }

  const phoneRegex = /^\d{10,15}$/;
  if (!phoneRegex.test(formData.phone)) {
    toast.error("Phone number must be 10 to 15 digits.");
    return;
  }
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "profile" && formData[key]) data.append(key, formData[key]);
        else if (key !== "preview") data.append(key, formData[key]);
      });

      const res = await axios.put(
        `${API_URL}/updateuser/${userId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("User updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user.");
    }
  };

  const fetchUserData = async () => {
    if (!isOpen || !userId) return;
    try {
      const res = await axios.get(
        `${API_URL}/userdetails/${userId}`
      );
      setFormData({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        gender: res.data.gender || "",
        profile: res.data.profile || "",
        preview: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [isOpen, userId]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Update Profile"
      className="rounded-xl w-[448px] mx-auto shadow-2xl overflow-hidden"
      overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <ModalUI
        formData={formData}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
        handleIconClick={handleIconClick}
        handleSubmit={handleSubmit}
        onClose={onClose}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </Modal>
  );
}
