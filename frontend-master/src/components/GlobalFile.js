import React, { useState, useEffect } from "react";
import { fetchRegmap } from "../services/api"; // Adjust this path if needed

const GlobalFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState({});
  const [defaultValues, setDefaultValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [regmapContent, setRegmapContent] = useState("");
  const [error, setError] = useState("");

  const styles = {
    tableContainer: {
      maxHeight: '78vh',
      overflowY: 'auto',
      border: '1px solid #ddd',
      marginTop: '20px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      border: '1px solid #ddd',
      padding: '8px',
      textAlign: 'left',
      backgroundColor: '#007bff',
      color: "white",
      fontWeight: 'bold',
      position: 'sticky',
      top: 0,
      zIndex: 1,
    },
    td: {
      border: '1px solid #ddd',
      padding: '8px',
      textAlign: 'left',
    },
    trEven: {
      backgroundColor: '#f9f9f9',
    },
    trHover: {
      backgroundColor: '#f1f1f1',
    },
  };

  // Fetch Regmap once when component mounts
  useEffect(() => {
    const fetchAndSetRegmap = async () => {
      const projectId = localStorage.getItem("projectId");
      if (projectId) {
        try {
          setLoading(true);
          const data = await fetchRegmap(projectId);
          if (data) {
            setRegmapContent(data);
          } else {
            setRegmapContent("Error: Failed to fetch or parse regmap data.");
          }
        } catch (err) {
          console.error("Error fetching regmap:", err);
          setError("Failed to fetch regmap.");
        } finally {
          setLoading(false);
        }
      } else {
        console.warn("No projectId found in localStorage");
        setRegmapContent("No project ID found.");
      }
    };

    fetchAndSetRegmap();
  }, []);

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const text = await file.text();
    if (text) {
      setSelectedFile(text);
    }
  };

  // Handle upload button click
  const handleUpload = () => {
    if (!selectedFile) return;

    const lines = selectedFile.trim().split("\n");
    const result1 = {};

    lines.forEach((line) => {
      if (line.startsWith("//WRITE")) {
        // Ignore
      } else if (line.startsWith("//")) {
        result1[line] = "";
      } else {
        const regex = /WRITE\s+#(\w+)\s+(.+)/;
        const match = line.match(regex);
        if (match) {
          const [_, Name, hexVal] = match;
          result1[Name] = hexVal;
        }
      }
    });

    if (result1) {
      setResult(result1);
      extractDefaultValues(result1);
    }
  };

  // Extract default values from regmap content
  const extractDefaultValues = (uploadedResult) => {
    const defaultVals = {};

    if (regmapContent && typeof regmapContent === "string") {
      const regmapLines = regmapContent.trim().split("\n");

      regmapLines.forEach((line) => {
        for (let key of Object.keys(uploadedResult)) {
          if (line.includes(key)) {
            // Assume default value is last word in the line
            const words = line.trim().split(/\s+/);
            const lastWord = words[words.length - 1];
            defaultVals[key] = lastWord;
          }
        }
      });
    }

    setDefaultValues(defaultVals);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ display: 'inline-block', marginRight: '10px' }}>Global Settings</h3>
      <input 
        type="file" 
        accept=".nset" 
        style={{ display: 'inline-block', marginRight: '10px' }} 
        onChange={handleFileUpload} 
      />
      <button onClick={handleUpload} style={{ display: 'inline-block' }}>
        Upload global.nset
      </button>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Tuning Parameter</th>
              <th style={styles.th}>Default Value</th>
              <th style={styles.th}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(result).map((key, index) => (
              <tr
                key={index}
                style={index % 2 === 0 ? styles.trEven : {}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? styles.trEven.backgroundColor : 'white'}
              >
                <td style={styles.td}>{key}</td>
                <td style={styles.td}>{defaultValues[key] || "-"}</td>
                <td style={styles.td}>{result[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && <p>Loading regmap...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GlobalFile;
