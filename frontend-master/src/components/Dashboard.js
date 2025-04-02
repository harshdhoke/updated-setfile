import React, { useState } from "react";
import Navbar from "./Navbar";
import FileList from "./FileList";
import FileDataTable from "./FileDataTable";
import GlobalFile from "./GlobalFile";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [showGlobal, setShowGlobal] = useState(true);
  const [showFileList, setShowFileList] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Combine dynamic class names
  const containerClass = `dashboard-container 
    ${!showGlobal ? "expanded" : ""} 
    ${!showFileList ? "expanded-filelist" : ""}`.trim();

  return (
    <div>
      {/* Navbar with props */}
      <Navbar
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
        selectedFile={selectedFile}
      />

      <div className={containerClass}>
        {/* File Data Table Section */}
        <div className="section data-table">
          <h2>File Data Table</h2>
          <FileDataTable selectedFile={selectedFile} />
        </div>

        {/* File List Section */}
        {showFileList && (
          <div className="section file-list">
            <button
              className="toggle-btn hide-btn filelist"
              onClick={() => setShowFileList(false)}
            >
              <span className="toggle-icon">−</span>
            </button>
            <h2>Available Files</h2>
            <FileList setSelectedFile={setSelectedFile} />
          </div>
        )}

        {/* Global File Section */}
        {showGlobal && (
          <div className="section global-data">
            <button
              className="toggle-btn hide-btn global"
              onClick={() => setShowGlobal(false)}
            >
              <span className="toggle-icon">−</span>
            </button>
            <GlobalFile />
          </div>
        )}
      </div>

      {/* Show File List Button */}
      {!showFileList && (
        <button
          className="show-btn-filelist"
          onClick={() => setShowFileList(true)}
        >
          +
        </button>
      )}

      {/* Show Global File Button */}
      {!showGlobal && (
        <button
          className="show-btn-global"
          onClick={() => setShowGlobal(true)}
        >
          +
        </button>
      )}
    </div>
  );
};

export default Dashboard;