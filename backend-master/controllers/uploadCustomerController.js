// controller/customer.js
const pool = require("../config/db");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const ROOT_DIR = "D:\\Setfile_Manager_2.0";
const UPLOAD_DIR = "D:\\Setfile_Manager_2.0\\PROJECTS";
const DUMP_DIR = "D:\\Setfile_Manager_2.0\\DATABASE";
const pathd = "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe";
const DB_NAME = "my_db";
const DB_USER = "root";
const DB_PASS = "Harsh@123";

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
        exec(`git -C "${ROOT_DIR}" commit -m "Created customer with related data"`, (err) => {
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

exports.uploadCustomer = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    // Extract JSON payload from frontend
    const {
      formData: { customerToCreate, customerToUpload, interfaceType, clockRate, addModes },
      parsedFiles,
      modes,
      mvIndices,
      prefixFileMap,
      endNameData,
    } = req.body;

    // Validate required fields
    if (!customerToCreate || !addModes || addModes.length === 0) {
      return res.status(400).json({ message: "customerToCreate and addModes are required" });
    }

    // Start DB transaction
    await connection.beginTransaction();

    try {
      // Insert customer data into the database
      const [customerResult] = await connection.query(
        `INSERT INTO customers (customer_name, interface_type, clock_rate, modes)
         VALUES (?, ?, ?, ?)`,
        [customerToCreate, interfaceType || null, clockRate || null, JSON.stringify(addModes)]
      );

      const customerId = customerResult.insertId;

      // Insert parsed files data (example table: customer_files)
      for (const [fileName, fileData] of Object.entries(parsedFiles)) {
        await connection.query(
          `INSERT INTO customer_files (customer_id, file_name, file_data, mv_indices, prefix, end_name)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            customerId,
            fileName,
            JSON.stringify(fileData),
            JSON.stringify(mvIndices[fileName] || []),
            prefixFileMap[fileName] || null,
            endNameData[fileName] || null,
          ]
        );
      }

      // Insert modes data (example table: customer_modes)
      for (const [mode, files] of Object.entries(modes)) {
        await connection.query(
          `INSERT INTO customer_modes (customer_id, mode_name, files)
           VALUES (?, ?, ?)`,
          [customerId, mode, JSON.stringify(files)]
        );
      }

      // Create a directory for the customer in UPLOAD_DIR
      const customerDir = path.join(UPLOAD_DIR, customerToCreate);
      if (!fs.existsSync(customerDir)) {
        fs.mkdirSync(customerDir, { recursive: true });
      }

      // Save parsed data as JSON file (optional, for reference)
      const outputPath = path.join(customerDir, `${customerToCreate}_data.json`);
      fs.writeFileSync(outputPath, JSON.stringify(req.body, null, 2));

      // Dump database tables to DUMP_DIR
      const tables = ["customers", "customer_files", "customer_modes"];
      for (const table of tables) {
        const dumpPath = path.join(DUMP_DIR, `${table}_${customerToCreate}_${Date.now()}.sql`);
        await runDump(table, dumpPath);
      }

      // Commit Git changes
      await commitAndPushToGit();

      // Commit DB transaction
      await connection.commit();

      res.status(200).json({
        message: "Customer data uploaded and processed successfully",
        data: {
          customerId,
          customerToCreate,
          modes: addModes,
          parsedFilesCount: Object.keys(parsedFiles).length,
        },
      });
    } catch (err) {
      console.error("Error processing customer data:", err);
      await connection.rollback();
      res.status(500).json({ message: "Failed to process customer data", error: err.message });
    }
  } catch (err) {
    console.error("Error establishing database connection:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  } finally {
    connection.release();
  }
};