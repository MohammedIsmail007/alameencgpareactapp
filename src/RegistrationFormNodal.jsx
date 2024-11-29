import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
Modal.setAppElement("#root");

const RegistrationFormModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [regno, setRegno] = useState("");
  const [lateral, setLateral] = useState("");

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      const response = await axios.post(
        "ttps://alameencgpareactappserver.onrender.com:5000/students",
        data
      );
      if (response.status === 200) {
        alert("Registered successfully");
      }
    } catch (error) {
      console.error("Error posting data:", error);
      if (error.response && error.response.status === 409) {
        alert("Registration number already exists");
      } else {
        alert("Not registered");
      }
    }
    setModalIsOpen(false); // Close modal after submission
  };

  // const handleUpdate = async () => {
  //   try {
  //     const response = await axios.put("ttps://alameencgpareactappserver.onrender.com:5000/updateCode", {
  //       regno,
  //       code,
  //     });
  //     alert(response.data.message);
  //   } catch (error) {
  //     if (error.response && error.response.status === 409) {
  //       alert("Registration number already exists");
  //     } else {
  //       alert("Error updating code");
  //     }
  //   }
  // };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={handleCloseModal}
      contentLabel="Registration Form"
      className="relative bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Register</h2>
        <button
          onClick={handleCloseModal}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
      <p className="mb-4">
        If already registered, ignore it by hitting the close button.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <label
            htmlFor="dpt"
            className="block text-sm font-medium text-gray-700"
          >
            Department:
          </label>
          <input
            type="text"
            id="dpt"
            name="dpt"
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <label
            htmlFor="regno"
            className="block text-sm font-medium text-gray-700"
          >
            Register Number:
          </label>
          <input
            type="text"
            id="regno"
            name="regno"
            value={regno}
            onChange={(e) => setRegno(e.target.value)}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />{" "}
          <label
            htmlFor="regno"
            className="block text-sm font-medium text-gray-700"
          >
            Are you a Lateral Entry Student ?
          </label>
          <div className="flex flex-row items-start m-0 justify-start">
            <input
              type="radio"
              id="lateralYes"
              name="lateralentry"
              value="yes"
              onChange={(e) => setLateral(e.target.value)}
              placeholder="Yes"
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />{" "}
            <label
              htmlFor="lateral"
              className="block text-sm font-medium text-gray-700 m-0 p-0"
            >
              {" "}
              Yes
            </label>
            <input
              type="radio"
              id="lateralNo"
              name="lateralentry"
              value="no"
              onChange={(e) => setLateral(e.target.value)}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />{" "}
            <label
              htmlFor="lateral"
              className="block text-sm font-medium text-gray-700"
            >
              {" "}
              No
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Register
        </button>

        <p className="font-bold">
          CALCULATE YOUR GPA & CGPA FROM SEM 1 TO GET ACCURATE CGPA
        </p>
      </form>
    </Modal>
  );
};

export default RegistrationFormModal;
