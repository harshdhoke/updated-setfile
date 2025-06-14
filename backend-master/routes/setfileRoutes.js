const express = require("express");
const { getSetFiles,getTableData,addRow,updateRow,deleteRow,markFileAsDeleted ,updateSelectedMV,clonesetfile,addSetfile,cloneFromAny,fetchTableDataFornew,FileDatatableSaveall} = require("../controllers/setfileController");

const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");


// Route to fetch setfiles by mode_id
router.get("/getSetFiles", authMiddleware,getSetFiles);
router.post("/get-table-data", authMiddleware,getTableData);
router.post("/add-row", authMiddleware,addRow);
router.post("/update-row", authMiddleware,updateRow);
router.post("/delete-row", authMiddleware,deleteRow); 
router.post("/mark-deleted",authMiddleware,markFileAsDeleted);
router.post("/update-mv",authMiddleware,updateSelectedMV);
router.post("/clone-from",authMiddleware,clonesetfile);
router.post("/add-setfile",authMiddleware,addSetfile);
router.post("/cloneFromAny",authMiddleware,cloneFromAny);
router.post("/fetchTableDataFornew",authMiddleware,fetchTableDataFornew);
router.post("/FileDatatableSaveall",authMiddleware,FileDatatableSaveall)
module.exports = router;

