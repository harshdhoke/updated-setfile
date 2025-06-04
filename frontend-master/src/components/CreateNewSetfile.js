import React, { useEffect, useState } from "react";
import Navbar1 from "./CreateNewSetfileNavbar";
import FileList from "./CreateNewSetfileFileList";
import CloneFIleDataTable from "./CloneFIleDataTable";
import CreateOwnSetfile from "./CreateOwnSetfile";
import "../styles/Dashboard.css"; // reuse same styling
import CloneFromAny from "./CloneFromAny";
const CreateSetfilePage = () => {
 
  const [selectedSetFiles, setSelectedSetFiles] = useState({});
  const [setfilePrefix, setSetfilePrefix] = useState("");
  const[generatedSetfileName,setgeneratedSetfileName]=useState("");
  const [selectedModes, setSelectedModes] = useState(null);
  const [selectedMkclTable, setSelectedMkclTable] = useState("");
  const [selectedMkclTableFromClone,setSelectedMkclTableFromClone]=useState("");
  const [ShowCloneFIleDataTable,setShowCloneFIleDataTable]=useState(false);
  const [ShowCloneFromAny,setShowCloneFromAny]=useState(false);
  const [showCreatenew,setshowCreatenew]=useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedMkclTableKey,setSelectedMkclTableKey]=useState("");
  useEffect(() => {
    if (selectedMkclTable!=""&&selectedMkclTableFromClone!=""&&selectedMkclTable==selectedMkclTableFromClone) {
          setShowCloneFIleDataTable(true);
          setShowCloneFromAny(false);
          setshowCreatenew(false);
    }else if(selectedMkclTable!=""&&selectedMkclTableFromClone!=""&&selectedMkclTable!=selectedMkclTableFromClone&&selectedModes){
      console.log("ssssssss",selectedModes)
      setShowCloneFIleDataTable(false);
      setShowCloneFromAny(true);
      setshowCreatenew(false);
    }else if(selectedMkclTable!=""&&selectedMkclTableFromClone==""&&generatedSetfileName!=""){
      setShowCloneFIleDataTable(false);
      setShowCloneFromAny(false);
      setshowCreatenew(true);
    }else{
      setShowCloneFIleDataTable(false);
      setShowCloneFromAny(false);
      setshowCreatenew(false);
    }
}, [selectedMkclTable,selectedMkclTableFromClone,selectedCustomer,selectedModes,generatedSetfileName]);
  return (
    <div>
      {/* Navbar */}
      <Navbar1
        
        setfilePrefix={setfilePrefix}
        setSetfilePrefix={setSetfilePrefix}
        generatedSetfileName={generatedSetfileName}
        setgeneratedSetfileName={setgeneratedSetfileName}
        selectedModes={selectedModes}
        setSelectedModes={setSelectedModes}
        selectedMkclTable={selectedMkclTable}
        setSelectedMkclTable={setSelectedMkclTable}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        selectedMkclTableKey={selectedMkclTableKey}
        setSelectedMkclTableKey={setSelectedMkclTableKey}
      />
      
      <div className="dashboard-container expanded">
       {
        ShowCloneFIleDataTable && (<div className="section data-table">
          
          <CloneFIleDataTable
           selectedSetFiles={selectedSetFiles}
           setfilePrefix={setfilePrefix}
           generatedSetfileName={generatedSetfileName}
           selectedModes={selectedModes}
           selectedCustomer={selectedCustomer}
          />
        </div>)}
        {
        ShowCloneFromAny && (<div className="section data-table">
          
          <CloneFromAny
           selectedSetFiles={selectedSetFiles}
           setfilePrefix={setfilePrefix}
           generatedSetfileName={generatedSetfileName}
           selectedModes={selectedModes}
           selectedCustomer={selectedCustomer}
           selectedMkclTable={selectedMkclTable}
           selectedMkclTableKey={selectedMkclTableKey}
          />
        </div>)}
        {
        showCreatenew && (<div className="section data-table">
         <CreateOwnSetfile
         setfilePrefix={setfilePrefix}
         generatedSetfileName={generatedSetfileName}
         selectedModes={selectedModes}
         selectedCustomer={selectedCustomer}
         selectedMkclTable={selectedMkclTable}
         selectedMkclTableKey={selectedMkclTableKey}
         />
        </div>)}
        
        <div className="section file-list">
        
          <FileList
          selectedSetFiles={selectedSetFiles}
          setSelectedSetFiles={setSelectedSetFiles}
          selectedMkclTableFromClone={selectedMkclTableFromClone}
          setSelectedMkclTableFromClone={setSelectedMkclTableFromClone}
          
        />
        </div>
      </div>
    </div>
  );
};

export default CreateSetfilePage;