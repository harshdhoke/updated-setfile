import React, { useState, useEffect } from "react";
import { uploadCusData, fetchProjectById } from "../services/api";

const UploadCustomerModal = ({ isOpen, onClose }) => {
  const [interfaceType, setInterfaceType] = useState("");
  const [customerToCreate, setCustomerToCreate] = useState("");
  const [customerToUpload, setCustomerToUpload] = useState("");
  const [addModes, setAddModes] = useState([]);
  const [newAddMode, setNewAddMode] = useState("");
  const [clockRate, setClockRate] = useState("");
  const [folderHandle, setFolderHandle] = useState(null);
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [parsingError, setParsingError] = useState(null);
  const [isParsing, setIsParsing] = useState(false);

  let projectId = localStorage.getItem("projectId");

  useEffect(() => {
    projectId = localStorage.getItem("projectId");
  }, [projectId]);

  if (!isOpen) return null;

  const handleAddMode = () => {
    if (newAddMode.trim()) {
      setAddModes([...addModes, newAddMode.trim()]);
      setNewAddMode("");
    }
  };

  const handleRemoveMode = (mode) => {
    setAddModes(addModes.filter((m) => m !== mode));
  };

  const handleSelectFolder = async () => {
    if (!customerToCreate.trim()) {
      setParsingError("Customer to Create is required");
      return;
    }
    if (!addModes.length) {
      setParsingError("At least one mode is required");
      return;
    }

    try {
      const directoryHandle = await window.showDirectoryPicker();
      setFolderHandle(directoryHandle);
      setParsingError(null);

      const selectedFiles = [];
      const selectedFileNames = [];
      for await (const entry of directoryHandle.values()) {
        if (
          entry.kind === "file" &&
          entry.name.toLowerCase().endsWith(".nset") &&
          addModes.some((mode) => entry.name.includes(mode))
        ) {
          const file = await entry.getFile();
          selectedFiles.push(file);
          selectedFileNames.push(entry.name);
        }
      }
      setFiles(selectedFiles);
      setFileNames(selectedFileNames);

      if (selectedFiles.length === 0) {
        setParsingError(
          "No .nset files matching the specified modes found in the folder"
        );
      }
    } catch (error) {
      console.error("Error selecting folder:", error);
      setParsingError("Failed to select folder");
    }
  };

  const handleUpload = async () => {
    if (!folderHandle || files.length === 0) {
      setParsingError("No folder or files selected");
      return;
    }

    setIsParsing(true);
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
      formData.append("customerToCreate", customerToCreate.trim());
      formData.append("customerToUpload", customerToUpload.trim());
      formData.append("interfaceType", interfaceType);
      formData.append("clockRate", clockRate);
      formData.append("addModes", JSON.stringify(addModes));
      formData.append("projectId", projectId);

      // Log the sent data
      console.log("Sending data to backend:", {
        customerToCreate: customerToCreate.trim(),
        customerToUpload: customerToUpload.trim(),
        interfaceType,
        clockRate,
        addModes,
        projectId,
        files: fileNames,
      });

      // const response = await fetch("/api/uploadCusData", {
      //   method: "POST",
      //   body: formData,
      // });

      const response = await uploadCusData (formData);

      setFiles([]);
      setFolderHandle(null);
      setFileNames([]);
      setIsParsing(false);
      onClose();
    } catch (err) {
      console.error("Error uploading data:", err);
      setParsingError(`Failed to upload: ${err.message}`);
      setIsParsing(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "25px 30px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "450px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
          textAlign: "left",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
          fontFamily: "'Arial', sans-serif",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#2d3748",
            fontSize: "1.5rem",
            fontWeight: "600",
          }}
        >
          Upload Customer
        </h2>

        {parsingError && (
          <p
            style={{
              color: "#e53e3e",
              marginBottom: "10px",
              fontSize: "0.9rem",
            }}
          >
            {parsingError}
          </p>
        )}
        {isParsing && (
          <p
            style={{
              color: "#3182ce",
              marginBottom: "10px",
              fontSize: "0.9rem",
            }}
          >
            Uploading...
          </p>
        )}

        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
            backgroundColor: "#f7fafc",
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              color: "#2d3748",
              fontSize: "0.9rem",
              fontWeight: "500",
            }}
          >
            Customer to Create:
          </label>
          <input
            type="text"
            value={customerToCreate}
            onChange={(e) => setCustomerToCreate(e.target.value)}
            placeholder="Enter customer to create"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #cbd5e0",
              borderRadius: "5px",
              boxSizing: "border-box",
              color: "#2d3748",
              fontSize: "0.9rem",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3182ce")}
            onBlur={(e) => (e.target.style.borderColor = "#cbd5e0")}
          />
        </div>

        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
            backgroundColor: "#f7fafc",
          }}
        >
          <label
            style={{
              marginBottom: "5px",
              display: "block",
              color: "#2d3748",
              fontSize: "0.9rem",
              fontWeight: "500",
            }}
          >
            Customer to Upload:
          </label>
          <input
            type="text"
            value={customerToUpload}
            onChange={(e) => setCustomerToUpload(e.target.value)}
            placeholder="Enter customer to upload"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #cbd5e0",
              borderRadius: "5px",
              boxSizing: "border-box",
              color: "#2d3748",
              fontSize: "0.9rem",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3182ce")}
            onBlur={(e) => (e.target.style.borderColor = "#cbd5e0")}
          />
        </div>

        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
            backgroundColor: "#f7fafc",
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              color: "#2d3748",
              fontSize: "0.9rem",
              fontWeight: "500",
            }}
          >
            Add Mode:
          </label>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input
              type="text"
              value={newAddMode}
              onChange={(e) => setNewAddMode(e.target.value)}
              placeholder="Enter mode"
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid #cbd5e0",
                borderRadius: "5px",
                boxSizing: "border-box",
                color: "#2d3748",
                fontSize: "0.9rem",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3182ce")}
              onBlur={(e) => (e.target.style.borderColor = "#cbd5e0")}
            />
            <button
              type="button"
              onClick={handleAddMode}
              style={{
                padding: "8px 16px",
                backgroundColor: "#4a5568",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.9rem",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#2d3748")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#4a5568")}
            >
              Add
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {addModes.map((mode, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "5px 8px",
                  backgroundColor: "#edf2f7",
                  borderRadius: "3px",
                  fontSize: "0.85rem",
                }}
              >
                <span>{mode}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveMode(mode)}
                  style={{
                    marginLeft: "5px",
                    color: "#e53e3e",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
            backgroundColor: "#f7fafc",
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              color: "#2d3748",
              fontSize: "0.9rem",
              fontWeight: "500",
            }}
          >
            Interface Type:
          </label>
          <div style={{ marginBottom: "10px", display: "flex", gap: "15px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "0.9rem",
              }}
            >
              <input
                type="radio"
                name="interfaceType"
                value="cphy"
                checked={interfaceType === "cphy"}
                onChange={(e) => setInterfaceType(e.target.value)}
                style={{ marginRight: "5px" }}
              />
              CPHY
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "0.9rem",
              }}
            >
              <input
                type="radio"
                name="interfaceType"
                value="dphy"
                checked={interfaceType === "dphy"}
                onChange={(e) => setInterfaceType(e.target.value)}
                style={{ marginRight: "5px" }}
              />
              DPHY
            </label>
          </div>

          <label
            style={{
              display: "block",
              marginBottom: "5px",
              color: "#2d3748",
              fontSize: "0.9rem",
              fontWeight: "500",
            }}
          >
            Clock Rate:
          </label>
          <input
            type="text"
            value={clockRate}
            onChange={(e) => setClockRate(e.target.value)}
            placeholder="Enter clock rate"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #cbd5e0",
              borderRadius: "5px",
              boxSizing: "border-box",
              color: "#2d3748",
              fontSize: "0.9rem",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3182ce")}
            onBlur={(e) => (e.target.style.borderColor = "#cbd5e0")}
          />
        </div>

        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
            backgroundColor: "#f7fafc",
          }}
        >
          <button
            type="button"
            onClick={handleSelectFolder}
            disabled={isParsing}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: isParsing ? "#a0aec0" : "#4a5568",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: isParsing ? "not-allowed" : "pointer",
              fontSize: "0.9rem",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) =>
              !isParsing && (e.target.style.backgroundColor = "#2d3748")
            }
            onMouseOut={(e) =>
              !isParsing && (e.target.style.backgroundColor = "#4a5568")
            }
          >
            Select Folder
          </button>
          {folderHandle && (
            <p
              style={{
                marginTop: "10px",
                color: "#2d3748",
                fontSize: "0.9rem",
              }}
            >
              Selected folder: {folderHandle.name}
            </p>
          )}
          {fileNames.length > 0 && (
            <div
              style={{
                marginTop: "10px",
                color: "#2d3748",
                fontSize: "0.9rem",
              }}
            >
              <p>Files to be uploaded ({fileNames.length}):</p>
              <ul
                style={{
                  paddingLeft: "20px",
                  margin: 0,
                  listStyleType: "disc",
                }}
              >
                {fileNames.map((fileName, idx) => (
                  <li key={idx} style={{ marginBottom: "5px" }}>
                    {fileName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {(customerToCreate ||
          customerToUpload ||
          interfaceType ||
          clockRate ||
          addModes.length > 0) && (
          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
              backgroundColor: "#f7fafc",
            }}
          >
            <h3
              style={{
                color: "#2d3748",
                fontSize: "1.1rem",
                fontWeight: "500",
                marginBottom: "10px",
              }}
            >
              Form Data
            </h3>
            <div style={{ fontSize: "0.85rem", color: "#2d3748" }}>
              <p>
                <strong>Customer to Create:</strong>{" "}
                {customerToCreate || "Not set"}
              </p>
              <p>
                <strong>Customer to Upload:</strong>{" "}
                {customerToUpload || "Not set"}
              </p>
              <p>
                <strong>Interface Type:</strong> {interfaceType || "Not set"}
              </p>
              <p>
                <strong>Clock Rate:</strong> {clockRate || "Not set"}
              </p>
              <p>
                <strong>Modes:</strong>{" "}
                {addModes.length > 0 ? addModes.join(", ") : "None"}
              </p>
            </div>
          </div>
        )}

        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
        >
          <button
            type="button"
            onClick={handleUpload}
            disabled={isParsing}
            style={{
              padding: "8px 15px",
              backgroundColor: isParsing ? "#a0aec0" : "#2f855a",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: isParsing ? "not-allowed" : "pointer",
              fontSize: "0.9rem",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) =>
              !isParsing && (e.target.style.backgroundColor = "#276749")
            }
            onMouseOut={(e) =>
              !isParsing && (e.target.style.backgroundColor = "#2f855a")
            }
          >
            Upload
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 15px",
              backgroundColor: "#4a5568",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2d3748")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4a5568")}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadCustomerModal;