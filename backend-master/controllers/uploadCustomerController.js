const pool = require("../config/db");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const ROOT_DIR = "D:\\Setfile_Manager_2.0";
const UPLOAD_DIR = "D:\\Setfile_Manager_2.0\\PROJECTS";
const DUMP_DIR = "D:\\Setfile_Manager_2.0\\DATABASE";
const pathd="C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe"
const DB_NAME = "my_db";
const DB_USER = "root";
const DB_PASS = "Harsh@123";
const mergedGroups = [/* ... your MV4 and MV6 strings ... */
    "//$MV4[MCLK:[*MCLK*],mipi_phy_type:[*PHY_TYPE*],mipi_lane:[*PHY_LANE*],mipi_datarate:[*MIPI_DATA_RATE*]]",
    "//$MV4_Sensor[fps:[*FPS*]]",
    "//$MV4_CPHY_LRTE[enable:[*LRTE_EN*],longPacketSpace:2,shortPacketSpace:2]]",
    "//$MV4_Scramble[enable:[*SCRAMBLE_EN*]]",
    "//$MV4_MainData[width:[*WIDTH*],height:[*HEIGHT*],data_type:[*DATA_TYPE*],virtual_channel:[*MAIN_VC*]]",
    "//$MV4_InterleavedData[isUsed:[*ILD_IS_USED_LCG*],width:[*ILD_WIDTH_LCG*],height:[*ILD_HEIGHT_LCG*],data_type:[*DATA_TYPE*],virtual_channel:[*ILD_LCG_VC*]]",
    "//$MV4_InterleavedData[isUsed:[*ILD_IS_USED1*],width:[*ILD_WIDTH1*],height:[*ILD_HEIGHT1*],data_type:MIPI_RAW10 (0x2B),virtual_channel:[*ILD1_VC*]]",
    "//$MV4_InterleavedData[isUsed:[*ILD_IS_USED2*],width:[*ILD_WIDTH2*],height:[*ILD_HEIGHT2*],data_type:MIPI_RAW10 (0x2B),virtual_channel:[*ILD2_VC*]]",
    "//$MV4_InterleavedData[isUsed:[*ILD_ELG_IS_USED3*],width:[*WIDTH*],height:[*ILD_ELG_HEIGHT3*],data_type:Embedded_Data (0x12),virtual_channel:[*ILD3_ELG_VC*]]",
    "//$MV4_InterleavedData[isUsed:[*ILD_ELG_IS_USED4*],width:[*WIDTH*],height:[*ILD_ELG_HEIGHT4*],data_type:User_Defined_1 (0x30),virtual_channel:[*ILD4_ELG_VC*]]",
    "//$MV4_SFR[address:[*SFR_ADDRESS_1*],data:[*SFR_DATA_1*]]",
    "//$MV4_SFR[address:[*SFR_ADDRESS_2*],data:[*SFR_DATA_2*]]",
    "//$MV4_SFR[address:[*SFR_ADDRESS_3*],data:[*SFR_DATA_3*]]",
    "//$MV4_SFR[address:[*SFR_ADDRESS_4*],data:[*SFR_DATA_4*]]",
    "//$MV4_SFR[address:[*SFR_ADDRESS_5*],data:[*SFR_DATA_5*]]",
    "//$MV4_SFR[address:[*SFR_ADDRESS_6*],data:[*SFR_DATA_6*]]",
    "//$MV4_SFR[address:[*SFR_ADDRESS_7*],data:[*SFR_DATA_7*]]",
    "//$MV4_Start[]",

    "//$MV6[MCLK:[*MCLK*],mipi_phy_type:[*PHY_TYPE*],mipi_lane:[*PHY_LANE*],mipi_datarate:[*MIPI_DATA_RATE*]]",
    "//$MV6_Sensor[fps:[*FPS*]]",
    "//$MV6_CPHY_LRTE[enable:[*LRTE_EN*],longPacketSpace:2,shortPacketSpace:2]]",
    "//$MV6_Scramble[enable:[*SCRAMBLE_EN*]]",
    "//$MV6_MainData[width:[*WIDTH*],height:[*HEIGHT*],data_type:[*DATA_TYPE*],virtual_channel:[*MAIN_VC*]]",
    "//$MV6_InterleavedData[isUsed:[*ILD_IS_USED_LCG*],width:[*ILD_WIDTH_LCG*],height:[*ILD_HEIGHT_LCG*],data_type:[*DATA_TYPE*],virtual_channel:[*ILD_LCG_VC*]]",
    "//$MV6_InterleavedData[isUsed:[*ILD_IS_USED1*],width:[*ILD_WIDTH1*],height:[*ILD_HEIGHT1*],data_type:MIPI_RAW10 (0x2B),virtual_channel:[*ILD1_VC*]]",
    "//$MV6_InterleavedData[isUsed:[*ILD_IS_USED2*],width:[*ILD_WIDTH2*],height:[*ILD_HEIGHT2*],data_type:MIPI_RAW10 (0x2B),virtual_channel:[*ILD2_VC*]]",
    "//$MV6_InterleavedData[isUsed:[*ILD_ELG_IS_USED3*],width:[*WIDTH*],height:[*ILD_ELG_HEIGHT3*],data_type:Embedded_Data (0x12),virtual_channel:[*ILD3_ELG_VC*]]",
    "//$MV6_InterleavedData[isUsed:[*ILD_ELG_IS_USED4*],width:[*WIDTH*],height:[*ILD_ELG_HEIGHT4*],data_type:User_Defined_1 (0x30),virtual_channel:[*ILD4_ELG_VC*]]",
    "//$MV6_SFR[address:[*SFR_ADDRESS_1*],data:[*SFR_DATA_1*]]",
    "//$MV6_SFR[address:[*SFR_ADDRESS_2*],data:[*SFR_DATA_2*]]",
    "//$MV6_SFR[address:[*SFR_ADDRESS_3*],data:[*SFR_DATA_3*]]",
    "//$MV6_SFR[address:[*SFR_ADDRESS_4*],data:[*SFR_DATA_4*]]",
    "//$MV6_SFR[address:[*SFR_ADDRESS_5*],data:[*SFR_DATA_5*]]",
    "//$MV6_SFR[address:[*SFR_ADDRESS_6*],data:[*SFR_DATA_6*]]",
    "//$MV6_SFR[address:[*SFR_ADDRESS_7*],data:[*SFR_DATA_7*]]",
    "//$MV6_Start[]"
    ];

const runDump = (tableName, outputPath) => {
  return new Promise((resolve, reject) => {
    const cmd = `"${pathd}" --skip-extended-insert -u ${DB_USER} -p${DB_PASS} ${DB_NAME} ${tableName} > "${outputPath}"`;
    
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`mysqldump error for table ${tableName}:`, error);
        return reject(error);
      }
      console.log(`✅ Dumped table ${tableName} to ${outputPath}`);
      resolve();
    });
  });
};

const commitAndPushToGit = () => {
    return new Promise((resolve, reject) => {
      // Step 1: git add .
      exec(`git -C "${ROOT_DIR}" add .`, (err) => {
        if (err) {
          console.error("❌ Git add failed:", err);
          return reject(err);
        }
  
        // Step 2: check if there are any staged changes
        exec(`git -C "${ROOT_DIR}" diff --cached --quiet`, (err) => {
          if (!err) {
            console.log("ℹ️ Nothing to commit. Working tree clean.");
            return resolve(); // Exit early — nothing to commit
          }
  
          // Step 3: commit and push if there are changes
          exec(`git -C "${ROOT_DIR}" commit -m "Created project with all related tables"`, (err) => {
            if (err) {
              console.error("❌ Git commit failed:", err);
              return reject(err);
            }
  
            exec(`git -C "${ROOT_DIR}" push`, (err) => {
              if (err) {
                console.error("❌ Git push failed:", err);
                return reject(err);
              }
  
              console.log("✅ Git commit and push completed successfully.");
              resolve();
            });
          });
        });
      });
    });
  };
  
  
exports.uploadCustomerData = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const {parsedFilesJson,modesJson,mvIndicesJson,prefixMapJson,endNamesJson,projectName, Customertocreate,customertoUpload,interfaceType,projectId } = req.body;
    const modes= JSON.parse(parsedFilesJson);
    console.log(modes[0][value])
    // Object.entries(modes).forEach(({key,value})=>{
    //   console.log(key);
    //   console.log(value)
    // })
    // Object.entries(mvIndicesJson).forEach(([filename, indices]) => {
    //   if (!Array.isArray(indices)) {
    //     console.warn(`Invalid index data for file ${filename}`);
    //     return;
    //   }else{
    //     console.log(indices);
    //   }
    //   // Processing logic...
    // });
    // Start DB transaction
    // await connection.beginTransaction();

    // Object.entries(mvIndicesJson).forEach(([filename, indices]) => {
    //   console.log(`\nFile: ${filename}`);
    //   console.log(`Indices (${indices}):`, indices);
    // });
    

    // await connection.commit();
   
    res.json({
      message: " uploaded successfully",
    });

  } catch (err) {
    console.error("Error uploading ", err);
    //wait connection.rollback();
    res.status(500).json({ message: "Internal server error", error: err.message });
  } finally {
    connection.release();
  }
};