// src/components/CustomModal.jsx
import React from 'react';

function CustomModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center max-w-sm w-full border border-purple-600">
        <h3 className="text-xl font-bold text-green-400 mb-4">Mensaje Importante</h3>
        <p className="text-gray-200 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}

export default CustomModal;
