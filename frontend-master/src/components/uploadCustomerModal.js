import React, { useState } from "react";
import { uploadCustomer } from "../services/api";

const UploadCustomerModal = ({ isOpen, onClose }) => {
  const [interfaceType, setInterfaceType] = useState("");
  const [customerToCreate, setCustomerToCreate] = useState("");
  const [customerToUpload, setCustomerToUpload] = useState("");
  const [addModes, setAddModes] = useState([]);
  const [newAddMode, setNewAddMode] = useState("");
  const [clockRate, setClockRate] = useState("");
  const [folderHandle, setFolderHandle] = useState(null);
  const [fileNames, setFileNames] = useState([]);
  const [parsedData, setParsedData] = useState(null);
  const [parsingError, setParsingError] = useState(null);
  const [isParsing, setIsParsing] = useState(false);

  // Parsing constants (unchanged)
  const mergedGroups = [
    "//$MV4[MCLK:[*MCLK*],mipi_phy_type:[*PHY_TYPE*],mipi_lane:[*PHY_LANE*],mipi_datarate:[*MIPI_DATA_RATE*]]",
    "//$MV4_Sensor[fps:[*FPS*]]",
    "//$MV4_CPHY_LRTE[enable:[*LRTE_EN*],longPacketSpace:[*PACKET_lONG_SPACE*],shortPacketSpace:[*PACKET_SHORT_SPACE*]]",
    "//$MV4_Scramble[enable:[*SCRAMBLE_EN*]]",
    "//$MV4_MainData[width:[*WIDTH*],height:[*HEIGHT*],data_type:[*DATA_TYPE*],virtual_channel:[*MAIN_VC*]]",
    "//$MV4_InterleavedData[isUsed:[*ILD_IS_USED_LCG*],width:[*ILD_WIDTH_LCG*],height:[*ILD_HEIGHT_LCG*],data_type:[*DATA_TYPE*],virtual_channel:[*ILD_LCG_VC*]]",
    "//$MV4_InterleavedData[isUsed:[*ILD_IS_USED1*],width:[*ILD_WIDTH1*],height:[*ILD_HEIGHT1*],data_type:[*MIPI_RAW10 (0x2B)*],virtual_channel:[*ILD1_VC*]]",
    "//$MV4_InterleavedData[isUsed:[*ILD_IS_USED2*],width:[*ILD_WIDTH2*],height:[*ILD_HEIGHT2*],data_type:[*MIPI_RAW10 (0x2B)*],virtual_channel:[*ILD2_VC*]]",
    "//$MV4_InterleavedData[isUsed:[*ILD_ELG_IS_USED3*],width:[*WIDTH*],height:[*ILD_ELG_HEIGHT3*],data_type:[*Embedded_Data (0x12)*],virtual_channel:[*ILD3_ELG_VC*]]",
    "//$MV4_InterleavedData[isUsed:[*ILD_ELG_IS_USED4*],width:[*WIDTH*],height:[*ILD_ELG_HEIGHT4*],data_type:[*User_Defined_1 (0x30)*],virtual_channel:[*ILD4_ELG_VC*]]",
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
    "//$MV6_LRTE[enable:[*LRTE_EN*],longPacketSpace:[*PACKET_lONG_SPACE*],shortPacketSpace:[*PACKET_SHORT_SPACE*]]",
    "//$MV6_Scramble[enable:[*SCRAMBLE_EN*]]",
    "//$MV6_MainData[width:[*WIDTH*],height:[*HEIGHT*],data_type:[*DATA_TYPE*],virtual_channel:[*MAIN_VC*]]",
    "//$MV6_InterleavedData[isUsed:[*ILD_IS_USED_LCG*],width:[*ILD_WIDTH_LCG*],height:[*ILD_HEIGHT_LCG*],data_type:[*DATA_TYPE*],virtual_channel:[*ILD_LCG_VC*]]",
    "//$MV6_InterleavedData[isUsed:[*ILD_IS_USED1*],width:[*ILD_WIDTH1*],height:[*ILD_HEIGHT1*],data_type:[*MIPI_RAW10 (0x2B)*],virtual_channel:[*ILD1_VC*]]",
    "//$MV6_InterleavedData[isUsed:[*ILD_IS_USED2*],width:[*ILD_WIDTH2*],height:[*ILD_HEIGHT2*],data_type:[*MIPI_RAW10 (0x2B)*],virtual_channel:[*ILD2_VC*]]",
    "//$MV6_InterleavedData[isUsed:[*ILD_ELG_IS_USED3*],width:[*WIDTH*],height:[*ILD_ELG_HEIGHT3*],data_type:[*Embedded_Data (0x12)*],virtual_channel:[*ILD3_ELG_VC*]]",
    "//$MV6_InterleavedData[isUsed:[*ILD_ELG_IS_USED4*],width:[*WIDTH*],height:[*ILD_ELG_HEIGHT4*],data_type:[*User_Defined_1 (0x30)*],virtual_channel:[*ILD4_ELG_VC*]]",
    "//$MV6_SFR[address:[*SFR_ADDRESS_1*],data:[*SFR_DATA_1*]]",
    "//$MV6_SFR[address:[*SFR_ADDRESS_2*],data:[*SFR_DATA_2*]]",
    "//$MV6_SFR[address:[*SFR_ADDRESS_3*],data:[*SFR_DATA_3*]]",
    "//$MV6_SFR[address:[*SFR_ADDRESS_4*],data:[*SFR_DATA_4*]]",
    "//$MV6_SFR[address:[*SFR_ADDRESS_5*],data:[*SFR_DATA_5*]]",
    "//$MV6_SFR[address:[*SFR_ADDRESS_6*],data:[*SFR_DATA_6*]]",
    "//$MV6_SFR[address:[*SFR_ADDRESS_7*],data:[*SFR_DATA_7*]]",
    "//$MV6_Start[]",
  ];

  const result = {};
  mergedGroups.forEach((item, index) => {
    const regex = /\[\*(.*?)\*\]/g;
    let a = "";
    let match;
    while ((match = regex.exec(item)) !== null) {
      a += match[1];
    }
    if (!result[a]) result[a] = [];
    result[a].push(index);
  });

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
      console.log("Selected folder:", directoryHandle.name);
      setParsedData(null);
      setParsingError(null);

      // Collect .nset file names that match any mode in addModes
      const files = [];
      for await (const entry of directoryHandle.values()) {
        if (
          entry.kind === "file" &&
          entry.name.toLowerCase().endsWith(".nset") &&
          addModes.some((mode) => entry.name.includes(mode))
        ) {
          files.push(entry.name);
        }
      }
      console.log("Modes:", addModes, "Matching files:", files);
      setFileNames(files);

      if (files.length === 0) {
        setParsingError("No .nset files matching the specified modes found in the folder");
      }
    } catch (error) {
      console.error("Error selecting folder:", error);
      setParsingError("Failed to select folder");
    }
  };

  const parseConfigFile = async (file, placeholderMap, fileName) => {
    const output = new Map();
    let firstCommentSkipped = false;
    let inIgnoreSection = false;
    let markerLines = [];
    const mvIndices = [];

    try {
      const text = await file.text();
      const lines = text.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const trimmedLine = lines[i].trim();
        if (trimmedLine.startsWith("//===") || trimmedLine.startsWith("//====")) {
          markerLines.push(i);
        }
      }

      const firstMarkerIndex = markerLines.length > 0 ? markerLines[0] : -1;
      const lastMarkerIndex = markerLines.length > 0 ? markerLines[markerLines.length - 1] : -1;

      const sfrCounts = { MV4_SFR: 0, MV6_SFR: 0 };
      const ildCounts = { MV4_InterleavedData: 0, MV6_InterleavedData: 0 };

      for (let i = 0; i < lines.length; i++) {
        const trimmedLine = lines[i].trim();
        if (!trimmedLine) continue;

        if (firstMarkerIndex !== -1) {
          if (i === firstMarkerIndex) {
            inIgnoreSection = true;
            continue;
          } else if (i === lastMarkerIndex) {
            inIgnoreSection = false;
            continue;
          }
        }

        if (inIgnoreSection) continue;
        if (trimmedLine.startsWith("////$")) continue;

        if (
          trimmedLine.startsWith("//") &&
          !trimmedLine.startsWith("//$") &&
          !firstCommentSkipped
        ) {
          firstCommentSkipped = true;
          continue;
        }

        if (
          trimmedLine === "//$MV4_Start[]" ||
          trimmedLine === "//$MV6_Start[]"
        ) {
          const prefix = trimmedLine.slice(3, -2);
          const index = mergedGroups.indexOf(`//$${prefix}[]`);
          if (index !== -1) {
            mvIndices.push(index);
          }
          continue;
        }

        if (trimmedLine.startsWith("//$")) {
          const match = trimmedLine.match(/^\/\/\$([^\[]+)\[(.*)\]/);
          if (!match) {
            console.warn(`[${fileName}] Line ${i + 1}: Invalid format: ${trimmedLine}`);
            continue;
          }

          const prefix = match[1];
          const content = match[2];

          if ((prefix === "MV4_Start" || prefix === "MV6_Start") && !content) {
            const index = mergedGroups.indexOf(`//$${prefix}[]`);
            if (index !== -1) {
              mvIndices.push(index);
            }
            continue;
          }

          if (prefix.startsWith("MV4") || prefix.startsWith("MV6")) {
            if (!content) {
              output.set(prefix, "");
              continue;
            }

            const pairs = content.split(",").map((pair) => pair.trim());
            const keys = [];
            const values = [];

            for (const pair of pairs) {
              const [key, value] = pair.split(":").map((s) => s.trim());
              if (!key) continue;
              keys.push(key);
              values.push(value);
            }

            if (keys.length === 0) continue;

            const firstKey = keys[0];
            const firstValue = values[0];
            let instanceIndex = 0;
            if (prefix === "MV4_SFR" || prefix === "MV6_SFR") {
              instanceIndex = sfrCounts[prefix]++;
            } else if (
              prefix === "MV4_InterleavedData" ||
              prefix === "MV6_InterleavedData"
            ) {
              instanceIndex = ildCounts[prefix]++;
            }

            if (placeholderMap[prefix] && placeholderMap[prefix].keys[firstKey]) {
              const candidates = placeholderMap[prefix].keys[firstKey].filter(
                (p) => p.instance === instanceIndex
              );
              if (candidates.length > 0) {
                const candidate = candidates[0];
                if (
                  candidate.value.includes("[*") &&
                  candidate.value.includes("*]")
                ) {
                  mvIndices.push(candidate.index);
                } else if (candidate.value === firstValue) {
                  mvIndices.push(candidate.index);
                }
              }
            }

            const keyMap = {
              MV4: {
                MCLK: "MCLK",
                mipi_phy_type: "PHY_TYPE",
                mipi_lane: "PHY_LANE",
                mipi_datarate: "MIPI_DATA_RATE",
              },
              MV4_CPHY_LRTE: {
                enable: "LRTE_EN",
                longPacketSpace: "PACKET_lONG_SPACE",
                shortPacketSpace: "PACKET_SHORT_SPACE",
              },
              MV4_Scramble: { enable: "SCRAMBLE_EN" },
              MV4_MainData: {
                width: "WIDTH",
                height: "HEIGHT",
                data_type: "DATA_TYPE",
                virtual_channel: "MAIN_VC",
              },
              MV4_InterleavedData: {
                isUsed: [
                  "ILD_IS_USED_LCG",
                  "ILD_IS_USED1",
                  "ILD_IS_USED2",
                  "ILD_ELG_IS_USED3",
                  "ILD_ELG_IS_USED4",
                ],
                width: [
                  "ILD_WIDTH_LCG",
                  "ILD_WIDTH1",
                  "ILD_WIDTH2",
                  "WIDTH",
                  "WIDTH",
                ],
                height: [
                  "ILD_HEIGHT_LCG",
                  "ILD_HEIGHT1",
                  "ILD_HEIGHT2",
                  "ILD_ELG_HEIGHT3",
                  "ILD_ELG_HEIGHT4",
                ],
                data_type: [
                  "DATA_TYPE",
                  "MIPI_RAW10 (0x2B)",
                  "MIPI_RAW10 (0x2B)",
                  "Embedded_Data (0x12)",
                  "User_Defined_1 (0x30)",
                ],
                virtual_channel: [
                  "ILD_LCG_VC",
                  "ILD1_VC",
                  "ILD2_VC",
                  "ILD3_ELG_VC",
                  "ILD4_ELG_VC",
                ],
              },
              MV4_Sensor: { fps: "FPS" },
              MV4_SFR: {
                address: [
                  "SFR_ADDRESS_1",
                  "SFR_ADDRESS_2",
                  "SFR_ADDRESS_3",
                  "SFR_ADDRESS_4",
                  "SFR_ADDRESS_5",
                  "SFR_ADDRESS_6",
                  "SFR_ADDRESS_7",
                ],
                data: [
                  "SFR_DATA_1",
                  "SFR_DATA_2",
                  "SFR_DATA_3",
                  "SFR_DATA_4",
                  "SFR_DATA_5",
                  "SFR_DATA_6",
                  "SFR_DATA_7",
                ],
              },
              MV6: {
                MCLK: "MCLK",
                mipi_phy_type: "PHY_TYPE",
                mipi_lane: "PHY_LANE",
                mipi_datarate: "MIPI_DATA_RATE",
              },
              MV6_LRTE: {
                enable: "LRTE_EN",
                longPacketSpace: "PACKET_lONG_SPACE",
                shortPacketSpace: "PACKET_SHORT_SPACE",
              },
              MV6_Scramble: { enable: "SCRAMBLE_EN" },
              MV6_MainData: {
                width: "WIDTH",
                height: "HEIGHT",
                data_type: "DATA_TYPE",
                virtual_channel: "MAIN_VC",
              },
              MV6_InterleavedData: {
                isUsed: [
                  "ILD_IS_USED_LCG",
                  "ILD_IS_USED1",
                  "ILD_IS_USED2",
                  "ILD_ELG_IS_USED3",
                  "ILD_ELG_IS_USED4",
                ],
                width: [
                  "ILD_WIDTH_LCG",
                  "ILD_WIDTH1",
                  "ILD_WIDTH2",
                  "WIDTH",
                  "WIDTH",
                ],
                height: [
                  "ILD_HEIGHT_LCG",
                  "ILD_HEIGHT1",
                  "ILD_HEIGHT2",
                  "ILD_ELG_HEIGHT3",
                  "ILD_ELG_HEIGHT4",
                ],
                data_type: [
                  "DATA_TYPE",
                  "MIPI_RAW10 (0x2B)",
                  "MIPI_RAW10 (0x2B)",
                  "Embedded_Data (0x12)",
                  "User_Defined_1 (0x30)",
                ],
                virtual_channel: [
                  "ILD_LCG_VC",
                  "ILD1_VC",
                  "ILD2_VC",
                  "ILD3_ELG_VC",
                  "ILD4_ELG_VC",
                ],
              },
              MV6_Sensor: { fps: "FPS" },
              MV6_SFR: {
                address: [
                  "SFR_ADDRESS_1",
                  "SFR_ADDRESS_2",
                  "SFR_ADDRESS_3",
                  "SFR_ADDRESS_4",
                  "SFR_ADDRESS_5",
                  "SFR_ADDRESS_6",
                  "SFR_ADDRESS_7",
                ],
                data: [
                  "SFR_DATA_1",
                  "SFR_DATA_2",
                  "SFR_DATA_3",
                  "SFR_DATA_4",
                  "SFR_DATA_5",
                  "SFR_DATA_6",
                  "SFR_DATA_7",
                ],
              },
            };

            let ans = "";
            keys.forEach((key, index) => {
              const value = values[index];
              if (!value) return;

              let mappedKey = key;

              if (keyMap[prefix] && keyMap[prefix][key]) {
                const possibleKeys = Array.isArray(keyMap[prefix][key])
                  ? keyMap[prefix][key]
                  : [keyMap[prefix][key]];

                if (prefix === "MV4_SFR" || prefix === "MV6_SFR") {
                  if (instanceIndex < possibleKeys.length) {
                    mappedKey = possibleKeys[instanceIndex];
                  }
                } else if (
                  prefix === "MV4_InterleavedData" ||
                  prefix === "MV6_InterleavedData"
                ) {
                  if (instanceIndex < possibleKeys.length) {
                    mappedKey = possibleKeys[instanceIndex];
                  }
                } else if (Array.isArray(keyMap[prefix][key])) {
                  mappedKey = possibleKeys[0];
                } else {
                  mappedKey = keyMap[prefix][key];
                }
              }

              output.set(mappedKey, value);
              ans += mappedKey;
            });

            const var1 = result[ans]?.[0];
            const var2 = result[ans]?.[1];

            if (prefix.startsWith("MV4")) {
              if (var1 !== undefined && mergedGroups[var1].startsWith("//$MV4")) {
                mvIndices.push(var1);
              } else if (var2 !== undefined && mergedGroups[var2].startsWith("//$MV4")) {
                mvIndices.push(var2);
              }
            } else if (prefix.startsWith("MV6")) {
              if (var1 !== undefined && mergedGroups[var1].startsWith("//$MV6")) {
                mvIndices.push(var1);
              } else if (var2 !== undefined && mergedGroups[var2].startsWith("//$MV6")) {
                mvIndices.push(var2);
              }
            }
          } else {
            if (!content) {
              output.set(prefix, "");
              continue;
            }

            const regex = /(\w+):(?:\[\*(.*?)\*\]|([^,\\]\]]*(?=(?:,|\]))))/g;
            let match;
            const keys = [];
            const values = [];
            while ((match = regex.exec(content)) !== null) {
              const key = match[1];
              const value = (match[2] || match[3] || "").trim();
              if (value) {
                output.set(key.toUpperCase(), value);
                keys.push(key);
                values.push(value);
              }
            }
          }
          continue;
        }

        if (trimmedLine.startsWith("//") && !trimmedLine.startsWith("//$")) {
          output.set(trimmedLine, "");
          continue;
        }

        if (trimmedLine.startsWith("WRITE")) {
          const parts = trimmedLine.split(/\s+/);
          if (parts.length >= 3) {
            const key = parts[1];
            const value = parts.slice(2).join(" ").trim();
            if (key.startsWith("#")) {
              output.set(key.substring(1), value);
            } else {
              output.set(key, value);
            }
          }
          continue;
        }
      }

      console.log(`Parsed ${fileName}:`, Object.fromEntries(output));
      return { output, mvIndices };
    } catch (error) {
      console.error(`Error parsing "${fileName}":`, error.message);
      return { output: new Map([["error", "Failed to parse file"]]), mvIndices: [] };
    }
  };

  const processFolder = async (directoryHandle) => {
    setIsParsing(true);
    try {
      setParsingError(null);

      const generatePlaceholderMap = (mergedGroups) => {
        const placeholderMap = {};
        mergedGroups.forEach((line, index) => {
          const match = line.match(/\/\/\$([^\[]+)\[(.*)\]/);
          if (!match) return;
          const prefix = match[1];
          const content = match[2];
          if (!content) return;

          if (!placeholderMap[prefix])
            placeholderMap[prefix] = { instanceCount: 0, keys: {} };
          const pairs = content.split(",").map((p) => p.trim());
          if (prefix.includes("SFR") || prefix.includes("InterleavedData")) {
            placeholderMap[prefix].instanceCount++;
          }

          pairs.forEach((pair) => {
            const [key, value] = pair.split(":").map((s) => s.trim());
            if (!placeholderMap[prefix].keys[key])
              placeholderMap[prefix].keys[key] = [];
            placeholderMap[prefix].keys[key].push({
              value,
              index,
              instance: placeholderMap[prefix].instanceCount - 1,
            });
          });
        });
        return placeholderMap;
      };

      const placeholderMap = generatePlaceholderMap(mergedGroups);

      const files = [];
      for await (const entry of directoryHandle.values()) {
        if (
          entry.kind === "file" &&
          entry.name.toLowerCase().endsWith(".nset") &&
          addModes.some((mode) => entry.name.includes(mode))
        ) {
          files.push(entry);
        }
      }

      console.log("Processing files:", files.map((f) => f.name));

      if (files.length === 0) {
        setParsingError("No .nset files matching the specified modes found in the folder");
        setIsParsing(false);
        return;
      }

      const buildPrefixRegex = (customer) => {
        const escapedCustomer = customer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const pattern = `^(.+?)_${escapedCustomer}_(.+)$`;
        return new RegExp(pattern, "i");
      };
      const prefixRegex = buildPrefixRegex(customerToCreate.trim());

      const parsedFiles = {};
      const mvIndices = {};
      const finaldata = {};
      const prefixFileMap = {};
      const endNameData = {};

      for (const entry of files) {
        const file = await entry.getFile();
        const fileName = file.name;

        console.log(`Processing file: ${fileName}, Prefix regex: ${prefixRegex.source}`);

        try {
          const { output, mvIndices: fileMvIndices } = await parseConfigFile(file, placeholderMap, fileName);
          parsedFiles[fileName] = Object.fromEntries(output);

          mvIndices[fileName] = fileMvIndices;

          for (const mode of addModes) {
            if (fileName.includes(mode)) {
              if (!finaldata[mode]) finaldata[mode] = [];
              finaldata[mode].push(fileName);

              const index = fileName.indexOf(mode) + mode.length;
              const endName = fileName.substring(index);
              endNameData[fileName] = endName;
            }
          }

          const match = fileName.match(prefixRegex);
          console.log(`File: ${fileName}, Match: ${match ? match : "null"}`);
          if (match) {
            const prefix = match[1];
            prefixFileMap[fileName] = prefix;
            console.log(`Prefix mapped: ${fileName} -> ${prefix}`);
          } else {
            console.warn(`No prefix match for file: ${fileName}`);
          }
        } catch (err) {
          console.error(`Error parsing "${fileName}":`, err.message);
          parsedFiles[fileName] = { error: "Failed to parse file" };
          mvIndices[fileName] = [];
        }
      }

      let parsedFilesJson = "{\n";
      const fileEntries = Object.entries(parsedFiles);
      fileEntries.forEach(([fileName, mapData], fileIdx) => {
        parsedFilesJson += `  ${JSON.stringify(fileName)}: {\n`;
        const entries = Object.entries(mapData);
        entries.forEach(([key, value], index) => {
          const keyStr = JSON.stringify(key);
          const valueStr = JSON.stringify(value);
          parsedFilesJson += `    ${keyStr}: ${valueStr}`;
          if (index < entries.length - 1) {
            parsedFilesJson += ",";
          }
          parsedFilesJson += "\n";
        });
        parsedFilesJson += "  }";
        if (fileIdx < fileEntries.length - 1) {
          parsedFilesJson += ",";
        }
        parsedFilesJson += "\n";
      });
      parsedFilesJson += "}";

      const formDataJson = JSON.stringify({
        customerToCreate,
        customerToUpload,
        interfaceType,
        clockRate,
        addModes,
      }, null, 2);

      const modesJson = JSON.stringify(finaldata, null, 2);
      const mvIndicesJson = JSON.stringify(mvIndices, null, 2);
      const prefixMapJson = JSON.stringify(prefixFileMap, null, 2);
      const endNamesJson = JSON.stringify(endNameData, null, 2);

      const result = {
        formDataJson,
        parsedFilesJson,
        modesJson,
        mvIndicesJson,
        prefixMapJson,
        endNamesJson,
        parsedFiles,
        modes: finaldata,
        mvIndices,
        prefixFileMap,
        endNameData,
      };

      // Log JSON outputs to console
      console.log("Form Data JSON:", formDataJson);
      console.log("Parsed Files JSON:", parsedFilesJson);
      console.log("Modes JSON:", modesJson);
      console.log("MV Indices JSON:", mvIndicesJson);
      console.log("Prefix Map JSON:", prefixMapJson);
      console.log("End Names JSON:", endNamesJson);
      console.log("Parsed data set:", result);

      setParsedData(result);
      if (Object.keys(parsedFiles).length === 0) {
        setParsingError("No valid .nset files parsed");
      }
    } catch (err) {
      console.error("Error processing folder:", err.message);
      setParsingError("Failed to process folder");
    } finally {
      console.log("Parsing complete, parsedData:", parsedData);
      setIsParsing(false);
    }
  };

  const handleUpload = async () => {
  if (!folderHandle) {
    setParsingError("No folder selected");
    return;
  }

  if (!parsedData) {
    console.log("No parsed data, running processFolder...");
    await processFolder(folderHandle);
  }

  console.log("Parsed data in handleUpload:", parsedData);

  if (!parsedData) {
    setParsingError("No parsed data available after processing");
    return;
  }

  try {
    const payload = {
      formData: {
        customerToCreate,
        customerToUpload,
        interfaceType,
        clockRate,
        addModes,
      },
      parsedFiles: parsedData.parsedFiles,
      modes: parsedData.modes,
      mvIndices: parsedData.mvIndices,
      prefixFileMap: parsedData.prefixFileMap,
      endNameData: parsedData.endNameData,
      formDataJson: parsedData.formDataJson,
      parsedFilesJson: parsedData.parsedFilesJson,
      modesJson: parsedData.modesJson,
      mvIndicesJson: parsedData.mvIndicesJson,
      prefixMapJson: parsedData.prefixMapJson,
      endNamesJson: parsedData.endNamesJson,
    };

    // Log JSON outputs for debugging
    console.log("Form Data JSON:", parsedData.formDataJson);
    console.log("Parsed Files JSON:", parsedData.parsedFilesJson);
    console.log("Modes JSON:", parsedData.modesJson);
    console.log("MV Indices JSON:", parsedData.mvIndicesJson);
    console.log("Prefix Map JSON:", parsedData.prefixMapJson);
    console.log("End Names JSON:", parsedData.endNamesJson);
    console.log("Full Payload JSON:", JSON.stringify(payload, null, 2));

    // Use the new uploadCustomer API function
    const data = await uploadCustomer(payload);

    console.log("Upload successful:", JSON.stringify(data, null, 2));
    setParsedData(null);
    setFolderHandle(null);
    setFileNames([]);
    onClose();
  } catch (err) {
    console.error("Error uploading data:", err);
    setParsingError(`Failed to upload: ${err}`);
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
        <h2 style={{ marginTop: 0, color: "#2d3748", fontSize: "1.5rem", fontWeight: "600" }}>
          Upload Customer
        </h2>

        {parsingError && (
          <p style={{ color: "#e53e3e", marginBottom: "10px", fontSize: "0.9rem" }}>
            {parsingError}
          </p>
        )}
        {isParsing && (
          <p style={{ color: "#3182ce", marginBottom: "10px", fontSize: "0.9rem" }}>
            Parsing...
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
            <label style={{ display: "flex", alignItems: "center", fontSize: "0.9rem" }}>
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
            <label style={{ display: "flex", alignItems: "center", fontSize: "0.9rem" }}>
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
            onMouseOver={(e) => !isParsing && (e.target.style.backgroundColor = "#2d3748")}
            onMouseOut={(e) => !isParsing && (e.target.style.backgroundColor = "#4a5568")}
          >
            Select Folder
          </button>
          {folderHandle && (
            <p style={{ marginTop: "10px", color: "#2d3748", fontSize: "0.9rem" }}>
              Selected folder: {folderHandle.name}
            </p>
          )}
          {fileNames.length > 0 && (
            <div style={{ marginTop: "10px", color: "#2d3748", fontSize: "0.9rem" }}>
              <p>Files to be parsed ({fileNames.length}):</p>
              <ul style={{ paddingLeft: "20px", margin: 0, listStyleType: "disc" }}>
                {fileNames.map((fileName, idx) => (
                  <li key={idx} style={{ marginBottom: "5px" }}>
                    {fileName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {(customerToCreate || customerToUpload || interfaceType || clockRate || addModes.length > 0) && (
          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
              backgroundColor: "#f7fafc",
            }}
          >
            <h3 style={{ color: "#2d3748", fontSize: "1.1rem", fontWeight: "500", marginBottom: "10px" }}>
              Form Data
            </h3>
            <div style={{ fontSize: "0.85rem", color: "#2d3748" }}>
              <p><strong>Customer to Create:</strong> {customerToCreate || "Not set"}</p>
              <p><strong>Customer to Upload:</strong> {customerToUpload || "Not set"}</p>
              <p><strong>Interface Type:</strong> {interfaceType || "Not set"}</p>
              <p><strong>Clock Rate:</strong> {clockRate || "Not set"}</p>
              <p><strong>Modes:</strong> {addModes.length > 0 ? addModes.join(", ") : "None"}</p>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
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
            onMouseOver={(e) => !isParsing && (e.target.style.backgroundColor = "#276749")}
            onMouseOut={(e) => !isParsing && (e.target.style.backgroundColor = "#2f855a")}
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