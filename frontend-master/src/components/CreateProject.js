import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../services/api";
import { addCustomers } from "../services/api";
import { addSettings } from "../services/api";
import "../styles/CreateProject.css";

const CreateProject = () => {
  const [name, setName] = useState("");
  const [customers, setCustomers] = useState(["PRS"]);
  const [newCustomer, setNewCustomer] = useState("");
  const [clockRate, setClockRate] = useState("");
  const [cphy, setCphy] = useState(false);
  const [dphy, setDphy] = useState(false);
  const [regmapFile, setRegmapFile] = useState(null);
  const [regmapBinFile, setRegmapBinFile] = useState(null);
  const [showMv4, setShowMv4] = useState(false);
  const [showMv6, setShowMv6] = useState(false);
  const [selectedLinesmv4, setSelectedLinesmv4] = useState([]);
  const [selectedLinesmv6, setSelectedLinesmv6] = useState([]);
  const [error, setError] = useState("");
 
  const [loading, setLoading] = useState(false);
 
  const mv4Groups = [
    "//$MV4[MCLK:[*MCLK*],mipi_phy_type:[*PHY_TYPE*],mipi_lane:[*PHY_LANE*],mipi_datarate:[*MIPI_DATA_RATE*]]",
    "//$MV4_CPHY_LRTE[enable:[*LRTE_EN*],longPacketSpace:2,shortPacketSpace:2]",
    "//$MV4_Scramble[enable:[*SCRAMBLE_EN*]]",
    "//$MV4_MainData[width:[*WIDTH*],height:[*HEIGHT*],data_type:[*DATA_TYPE*],virtual_channel:[*MAIN_VC*]]",
    "//$MV4_InterleavedData[isUsed:[*ILD_IS_USED_LCG*],width:[*ILD_WIDTH_LCG*],height:[*ILD_HEIGHT_LCG*],data_type:[*DATA_TYPE*],virtual_channel:[*ILD_LCG_VC*]]",
    "//$MV4_InterleavedData[isUsed:[*ILD_IS_USED1*],width:[*ILD_WIDTH1*],height:[*ILD_HEIGHT1*],data_type:MIPI_RAW10 (0x2B),virtual_channel:[*ILD1_VC*]]",
    "//$MV4_InterleavedData[isUsed:[*ILD_IS_USED2*],width:[*ILD_WIDTH2*],height:[*ILD_HEIGHT2*],data_type:MIPI_RAW10 (0x2B),virtual_channel:[*ILD2_VC*]]",
    "//$MV4_InterleavedData[isUsed:[*ILD_ELG_IS_USED3*],width:[*WIDTH*],height:[*ILD_ELG_HEIGHT3*],data_type:Embedded_Data (0x12),virtual_channel:[*ILD3_ELG_VC*]]",
    "//$MV4_InterleavedData[isUsed:[*ILD_ELG_IS_USED4*],width:[*WIDTH*],height:[*ILD_ELG_HEIGHT4*],data_type:User_Defined_1 (0x30),virtual_channel:[*ILD4_ELG_VC*]]",
    "//$MV4_Start[]"
  ];
  const mv6Groups = [
    "//$MV6[MCLK:[*MCLK*],mipi_phy_type:[*PHY_TYPE*],mipi_lane:[*PHY_LANE*],mipi_datarate:[*MIPI_DATA_RATE*]]",
    "//$MV6_CPHY_LRTE[enable:[*LRTE_EN*],longPacketSpace:2,shortPacketSpace:2]",
    "//$MV6_Scramble[enable:[*SCRAMBLE_EN*]]",
    "//$MV6_MainData[width:[*WIDTH*],height:[*HEIGHT*],data_type:[*DATA_TYPE*],virtual_channel:[*MAIN_VC*]]",
    "//$MV6_InterleavedData[isUsed:[*ILD_IS_USED_LCG*],width:[*ILD_WIDTH_LCG*],height:[*ILD_HEIGHT_LCG*],data_type:[*DATA_TYPE*],virtual_channel:[*ILD_LCG_VC*]]",
    "//$MV6_InterleavedData[isUsed:[*ILD_IS_USED1*],width:[*ILD_WIDTH1*],height:[*ILD_HEIGHT1*],data_type:MIPI_RAW10 (0x2B),virtual_channel:[*ILD1_VC*]]",
    "//$MV6_InterleavedData[isUsed:[*ILD_IS_USED2*],width:[*ILD_WIDTH2*],height:[*ILD_HEIGHT2*],data_type:MIPI_RAW10 (0x2B),virtual_channel:[*ILD2_VC*]]",
    "//$MV6_InterleavedData[isUsed:[*ILD_ELG_IS_USED3*],width:[*WIDTH*],height:[*ILD_ELG_HEIGHT3*],data_type:Embedded_Data (0x12),virtual_channel:[*ILD3_ELG_VC*]]",
    "//$MV6_InterleavedData[isUsed:[*ILD_ELG_IS_USED4*],width:[*WIDTH*],height:[*ILD_ELG_HEIGHT4*],data_type:User_Defined_1 (0x30),virtual_channel:[*ILD4_ELG_VC*]]",
    "//$MV6_Start[]"
  ];

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleAddCustomer = () => {
    if (newCustomer && !customers.includes(newCustomer)) {
      setCustomers([...customers, newCustomer]);
      setNewCustomer("");
    }
  };

  const handleCheckboxChange = (line, setSelectedLines) => {
    setSelectedLines((prev) =>
      prev.includes(line) ? prev.filter((item) => item !== line) : [...prev, line]
    );
  };

  const handleRemoveCustomer = (customer) => {
    setCustomers(customers.filter((c) => c !== customer));
  };

  const handleRadioChange = (type) => {
    setCphy(type === "cphy");
    setDphy(type === "dphy");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Validation checks
    if (!name) return setError("Project Name is required.");
    if (customers.length === 0) return setError("At least one customer is required.");
    if (!cphy && !dphy) return setError("Please select an Interface Type (CPHY/DPHY).");
    if (!clockRate) return setError("Clock Rate is required.");
    if (showMv4 && selectedLinesmv4.length === 0) return setError("At least one MV4 selection is required.");
    if (showMv6 && selectedLinesmv6.length === 0) return setError("At least one MV6 selection is required.");
    if (!regmapFile) return setError("Regmap file is required.");
    if (!regmapBinFile) return setError("Regmap Bin file is required.");
    
    setError("");
    let interfaceType=cphy ? "cphy" : "dphy";
        interfaceType+='_'+clockRate;
    console.log(interfaceType);
    const projectData = new FormData();
    projectData.append("name", name);
    projectData.append("mv4", showMv4 ? selectedLinesmv4.join(", ") : "");
    projectData.append("mv6", showMv6 ? selectedLinesmv6.join(", ") : "");
    projectData.append("regmap", regmapFile);
    projectData.append("regmapBin", regmapBinFile);
    const mv4txt=showMv4 ? selectedLinesmv4.join(", ") : "";
    const mv6txt=showMv6 ? selectedLinesmv6.join(", ") : "";
    const regex = /\[\*(.*?)\*\]/g;
   // const table_names=[];
      // Use a Set to store unique variables
      const uniqueVariables1 = new Set();

      let match1;
      while ((match1 = regex.exec(mv4txt)) !== null) {
          uniqueVariables1.add(match1[1]); // Add unique variable to Set
      }

      // Convert Set to array
     // const uniqueArray1 = [...uniqueVariables1];

     // console.log(uniqueArray1);
     // const uniqueVariables2= new Set();

      let match2;
      while ((match2 = regex.exec(mv6txt)) !== null) {
          uniqueVariables1.add(match2[1]); // Add unique variable to Set
      }

      // Convert Set to array
      const uniqueArray1 = [...uniqueVariables1];
      console.log(uniqueArray1);
     // console.log(uniqueArray2);
    try {
      const response = await createProject(projectData);
      localStorage.setItem("projectId", response.projectId); // Store project ID in local storage
      console.log(`Project created successfully: ID ${response.projectId}`);
      const customerResponse = await addCustomers(parseInt(response.projectId), customers);
  
      if (customerResponse && customerResponse.customers) {
    // Prepare settings data
      const settings = customerResponse.customers.map((customer) => ({
      name: interfaceType, // Common name for all settings
      table_name: `${name}_${customer.name}_${interfaceType}`,
      customer_id: customer.id
      }));
      // customerResponse.customers.map((customer) => {
      // table_names.push(`${name}_${customer.name}_${interfaceType}`);
      // });
      //console.log(table_names);
      
    // Send settings to backend
    console.log(uniqueArray1)
     await addSettings(settings,uniqueArray1);
     localStorage.setItem("projectId", response.projectId);
     localStorage.setItem("projectName", name);
    console.log("Project, customers, and settings added successfully!");

    navigate("/dashboard");
     }
    } catch (error) {
      setError(`Error: ${error}`|| "Project creation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("projectId");
    navigate("/");
  };

  return (
    <div>
        
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="project-form">
        <div className="user-header">
          <span className="username">Welcome, {user.name}</span>
          <button type="button" className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        
        <h2 className="project-title">Create New Project</h2>
        
        <div className="box-container">
          <div className="form-group">
            <div className="project">
            <h4>Project Name</h4>
            <input
              type="text"
              placeholder="Enter Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            </div>
          </div>
        </div>


        <div className="box-container">
          <div className="customer-section">
            <h4>Customers</h4>
            <div className="customer-input">
              <input
                type="text"
                placeholder="Add Customer"
                value={newCustomer}
                onChange={(e) => setNewCustomer(e.target.value)}
                className="customer-textbox"
              />
              <button type="button" className="add-customer-btn" onClick={handleAddCustomer}>
                Add
              </button>
            </div>
            <div className="customer-list">
              {customers.map((customer) => (
                <span key={customer} className="customer-item">
                  {customer}
                  <button
                    type="button"
                    className="small-btn remove-btn"
                    onClick={() => handleRemoveCustomer(customer)}
                  >
                    ❌
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>


        <div className="box-container">
          <div className="form-group">
            <h4>Data Rate Type</h4>
            <div className="radio-section">
              <label>
                <input type="radio" checked={cphy} onChange={() => handleRadioChange("cphy")} /> CPHY
              </label>
              <label>
                <input type="radio" checked={dphy} onChange={() => handleRadioChange("dphy")} /> DPHY
              </label>
            </div>
          </div>
          <div className="form-group">
            <h4>Clock Rate</h4>
            <input
              type="text"
              placeholder="Enter Clock Rate"
              value={clockRate}
              onChange={(e) => setClockRate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="box-container">
          <div className="file-upload">
            <h4>Upload Regmap.h</h4>
            <input type="file" onChange={(e) => setRegmapFile(e.target.files[0])} />
          </div>
          <div className="file-upload">
            <h4>Upload Regmap.bin</h4>
            <input type="file" onChange={(e) => setRegmapBinFile(e.target.files[0])} />
          </div>
        </div>

        <div className="box-container">
          <div className="form-group">
            <label className="h4">
              <input type="checkbox" checked={showMv4} onChange={() => setShowMv4(!showMv4)} /> Add MV4 Header
            </label>
            {showMv4 && (
              <div className="mv-container">
                {mv4Groups.map((line, index) => (
                  <label key={index} className="mv-line">
                    <input
                      type="checkbox"
                      checked={selectedLinesmv4.includes(line)}
                      onChange={() => handleCheckboxChange(line, setSelectedLinesmv4)}
                    />
                    {line}
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="h4">
              <input type="checkbox" checked={showMv6} onChange={() => setShowMv6(!showMv6)} /> Add MV6 Header
            </label>
            {showMv6 && (
              <div className="mv-container">
                {mv6Groups.map((line, index) => (
                  <label key={index} className="mv-line">
                    <input
                      type="checkbox"
                      checked={selectedLinesmv6.includes(line)}
                      onChange={() => handleCheckboxChange(line, setSelectedLinesmv6)}
                    />
                    {line}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        

        {error && <div className="error-message">{error}</div>}
        <div className="submit-container">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;