import React, { useState } from "react";
import AddCustomerModal from "./AddCustomerModal";
import UploadCustomerModal from "./uploadCustomerModal";

const CustomerModal = ({ isOpen, onClose }) => {
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isUploadCustomerModalOpen, setIsUploadCustomerModalOpen] =
    useState(false);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: "0",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "999",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "25px 30px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "500px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button
            style={{
              margin: "10px",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%",
              maxWidth: "200px",
              backgroundColor: "#007bff",
              color: "#fff",
            }}
            onClick={() => setIsAddCustomerModalOpen(true)}
          >
            Add New Customer
          </button>
          <button
            style={{
              margin: "10px",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%",
              maxWidth: "200px",
              backgroundColor: "#28a745",
              color: "#fff",
            }}
            onClick={() => setIsUploadCustomerModalOpen(true)}
          >
            Upload Customer
          </button>
          <button
            style={{
              margin: "10px",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%",
              maxWidth: "200px",
              backgroundColor: "#dc3545",
              color: "#fff",
            }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <AddCustomerModal
          isOpen={isAddCustomerModalOpen}
          onClose={() => setIsAddCustomerModalOpen(false)}
        />
        <UploadCustomerModal
          isOpen={isUploadCustomerModalOpen}
          onClose={() => setIsUploadCustomerModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default CustomerModal;