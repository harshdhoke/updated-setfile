import React, { useState } from "react";
import Navbar from "./CreateNewSetfileNavbar";
import FileDataTable from "./FileDataTable";
import "../styles/Dashboard.css"; // reuse same styling

const CreateSetfilePage = () => {
  const [selectedModes, setSelectedModes] = useState(null);
  const [selectedSetFiles, setSelectedSetFiles] = useState({});

  return (
    <div>
      {/* Navbar */}
      <Navbar
        selectedModes={selectedModes}
        setSelectedModes={setSelectedModes}
      />

      <div className="dashboard-container expanded">
        {/* File Data Table only */}
        <div className="section data-table">
          <h2>File Data Table</h2>
          <FileDataTable selectedSetFiles={selectedSetFiles} />
        </div>
      </div>
    </div>
  );
};

export default CreateSetfilePage;
