import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userIcon from "../assets/icons8-user-50-2.png";
import projectIcon from "../assets/project.png";
import {
  uploadRegmap,
  fetchCustomers,
  fetchModes,
  fetchProjectById,
  fetchSettings,
} from "../services/api";
import AddCustomerModal from "./AddCustomerModal";
import AddModeModal from "./AddModeModal";
import AddMkclTableModal from "./AddMkclTableModal";

import "../styles/CreateNewSetfileNavbar.css";

const CreateNewSetfileNavbar = ({ selectedModes, setSelectedModes }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const projectName = localStorage.getItem("projectName") || "No Project Selected";
  const projectId = localStorage.getItem("projectId");
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [modes, setModes] = useState([]);
  // const [selectedMode, setSelectedMode] = useState("");
  const [isModeModalOpen, setModeModalOpen] = useState(false);
  const [mkclTables, setMkclTables] = useState([]);
  const [selectedMkclTable, setSelectedMkclTable] = useState("");
  const [ismkclModalOpen, setmkclModalOpen] = useState(false);
  const [setfilePrefix, setSetfilePrefix] = useState("");
  const [setfileSuffix, setSetfileSuffix] = useState("");
  const [fps, setFps] = useState("");
  const [resolution, setResolution] = useState("");

  const handleLogout = () => {
    ["token", "user", "projectId", "projectName"].forEach((item) =>
      localStorage.removeItem(item)
    );
    navigate("/");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a file first.");
      setShowAlert(true);
      return;
    }
    if (!projectId || !projectName) {
      setMessage("Project ID or Name is missing.");
      setShowAlert(true);
      return;
    }
    try {
      await uploadRegmap({ file: selectedFile, projectId, name: projectName });
      setMessage("Regmap uploaded successfully!");
      setShowAlert(true);
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("Failed to upload regmap: " + error.message);
      setShowAlert(true);
    }
  };

  const fetchCustomersList = async (projectId) => {
    try {
      const data = await fetchCustomers(projectId);
      setCustomers(data);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };

  const handleCustomerChange = (event) => {
    const selectedId = event.target.value;
    setSelectedCustomer(selectedId);
    
    localStorage.setItem("cus",selectedCustomer);
    setSelectedModes("");
    setSelectedMkclTable("");
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId).then((data) => console.log(data));
      fetchCustomersList(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    if (selectedCustomer && customers.length > 0) {
      const customerObj = customers.find((c) => String(c.id) === String(selectedCustomer));
      setSelectedCustomerName(customerObj?.name || "");
    }
  }, [selectedCustomer, customers]);

  useEffect(() => {
    if (selectedCustomer) {
      fetchModes(selectedCustomer).then(setModes);
      fetchSettings(selectedCustomer).then(setMkclTables);
    } else {
      setModes([]);
      setMkclTables([]);
    }
  }, [selectedCustomer]);

  const generatedSetfileName = `${setfilePrefix || "prefix"}_${selectedCustomerName || "customer"}_${projectName}_${(modes.find(m => String(m.id) === String(selectedModes))?.name || "mode")}_${resolution || "res"}_${fps || "fps"}${setfileSuffix ? `_${setfileSuffix}` : ''}.nset`;

  return (
    <nav className="create-new-setfile-navbar">
      <div className="create-new-setfile-navbar-top">
        <div className="create-new-setfile-user-project">
          <img src={userIcon} alt="User Icon" className="create-new-setfile-icon" />
          <span>{user ? user.name : "Not Logged In"}</span>
          <img src={projectIcon} alt="Project Icon" className="create-new-setfile-icon" />
          <h3>{projectName}</h3>
        </div>

        <div className="create-new-setfile-navbar-buttons">
          <button className="create-new-setfile-btn" onClick={() => navigate('/dashboard')}>Go To Sensor Homepage</button>
          <label className="create-new-setfile-btn">
            Upload Regmap
            <input type="file" onChange={handleFileChange} style={{ display: "none" }} />
          </label>

          <button className="create-new-setfile-btn" onClick={handleUpload} disabled={!selectedFile}>Submit</button>
          {showAlert && message && window.alert(message)}

          <select className="create-new-setfile-select" value={selectedCustomer} onChange={handleCustomerChange}>
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>

          <button className="create-new-setfile-btn" onClick={() => setModalOpen(true)}>Add Customer</button>
          <AddCustomerModal
            isOpen={isModalOpen}
            onClose={() => {
              setModalOpen(false);
              fetchCustomersList(projectId);
            }}
          />

          {/* <button className="create-new-setfile-btn">Edit</button>
          <button className="create-new-setfile-btn">Save to DB</button>
          <button className="create-new-setfile-btn" onClick={() => navigate('/create-setfile')}>Create Setfile</button> */}
          <button className="create-new-setfile-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="combined">
      <div className="create-new-setfile-section">
        <div className="create-new-setfile-mode-row">
          <label className="create-new-setfile-label">Mode:</label>
          <select className="create-new-setfile-select" value={selectedModes} onChange={(e) => setSelectedModes(e.target.value) }>
         <h2> selectedModes</h2>
            <option value="">Select Mode</option>
            {modes.map((mode) => (
              <option key={mode.id} value={mode.id}>{mode.name}</option>
            ))}
          </select>
          <button className="create-new-setfile-btn" onClick={() => setModeModalOpen(true)}>Add Mode</button>
        </div>
        <AddModeModal
          isOpen={isModeModalOpen}
          onClose={() => setModeModalOpen(false)}
          customerId={selectedCustomer}
          refreshModes={() => fetchModes(selectedCustomer).then(setModes)}
        />
      </div>

      <div className="create-new-setfile-section">
        <div className="create-new-setfile-dropdown-row">
          <label className="create-new-setfile-label">MKCL Table:</label>
          <select className="create-new-setfile-select" value={selectedMkclTable} onChange={(e) => setSelectedMkclTable(e.target.value)}>
            <option value="">Select MIPI Datarate</option>
            {mkclTables.map((table) => (
              <option key={table.table_name} value={table.table_name}>{table.name}</option>
            ))}
          </select>
          <button className="create-new-setfile-btn" onClick={() => setmkclModalOpen(true)}>Add MIPI Datarate</button>
        </div>
        <AddMkclTableModal
          isOpen={ismkclModalOpen}
          onClose={() => setmkclModalOpen(false)}
          projectName={projectName}
          customerName={selectedCustomer}
          customerId={selectedCustomer}
          uniqueArray1={[]}
          refreshModes={() => fetchSettings(selectedCustomer).then(setMkclTables)}
        />
      </div>
      </div>

      <div className="create-new-setfile-section create-new-setfile-inputs">
        <input
          type="text"
          placeholder="Setfile Name Prefix"
          value={setfilePrefix}
          onChange={(e) => setSetfilePrefix(e.target.value)}
          className="create-new-setfile-input"
        />
        <input
          type="text"
          placeholder="Resolution"
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          className="create-new-setfile-input"
        />
        <input
          type="text"
          placeholder="FPS"
          value={fps}
          onChange={(e) => setFps(e.target.value)}
          className="create-new-setfile-input"
        />
        <input
          type="text"
          placeholder="Setfile Name Suffix"
          value={setfileSuffix}
          onChange={(e) => setSetfileSuffix(e.target.value)}
          className="create-new-setfile-input"
        />
      </div>

      <div className="create-new-setfile-section">
        <h3 className="create-new-setfile-label">Setfile Name:</h3>
        <div className="create-new-setfile-display">
          <strong>{generatedSetfileName}</strong>
        </div>
      </div>
    </nav>
  );
};

export default CreateNewSetfileNavbar;