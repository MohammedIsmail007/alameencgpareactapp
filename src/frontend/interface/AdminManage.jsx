import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminManage = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [rows, setRows] = useState([
    { id: "", course_code: "", course_title: "", course_cred: "" },
  ]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // Fetch table names from the server
    axios
      .get("http://localhost:5000/api/admin/tables")
      .then((response) => {
        setTables(response.data);
        if (response.data.length > 0) {
          setSelectedTable(response.data[0]); // Set the first table as default
        }
      })
      .catch((error) => {
        console.error("Error fetching tables:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch data of the selected table
    if (selectedTable) {
      axios
        .get(`http://localhost:5000/api/admin/tabledata?table=${selectedTable}`)
        .then((response) => {
          setTableData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching table data:", error);
        });
    }
  }, [selectedTable]);

  const handleInputChange = (index, event) => {
    const values = [...rows];
    values[index][event.target.name] = event.target.value;
    setRows(values);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      { id: "", course_code: "", course_title: "", course_cred: "" },
    ]);
  };

  const handleRemoveRow = (index) => {
    const values = [...rows];
    values.splice(index, 1);
    setRows(values);
  };

  const handleSubmit = () => {
    if (!selectedTable) {
      alert("Please select a table.");
      return;
    }

    axios
      .post("http://localhost:5000/api/insert", { table: selectedTable, rows })
      .then((response) => {
        alert("Data inserted successfully!");
      })
      .catch((error) => {
        console.error("There was an error inserting data!", error);
      });
  };

  const handleUpdate = (index) => {
    const row = rows[index];
    if (!selectedTable) {
      alert("Please select a table.");
      return;
    }

    if (!row.id) {
      alert("Cannot update row without ID.");
      return;
    }

    axios
      .put("http://localhost:5000/api/update", {
        table: selectedTable,
        id: row.id,
        course_code: row.course_code,
        course_title: row.course_title,
        course_cred: row.course_cred,
      })
      .then((response) => {
        alert("Data updated successfully!");
      })
      .catch((error) => {
        console.error("There was an error updating data!", error);
      });
  };

  return (
    <div
      className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">ADMIN PANEL</h3>

      {/* Table selection dropdown */}
      <div className="mb-6">
        <label
          className="block text-gray-700 font-medium mb-2"
          htmlFor="table-select"
        >
          Select Table:
        </label>
        <select
          id="table-select"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          {tables.map((table, index) => (
            <option key={index} value={table}>
              {table}
            </option>
          ))}
        </select>
      </div>

      {/* Display data from the selected table */}
      <div className="mt-8">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">
          Data from {selectedTable} Table
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                {Object.keys(tableData[0] || {}).map((key) => (
                  <th
                    key={key}
                    className="px-4 py-2 border-b border-gray-200 text-left text-gray-600"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-4 py-2 border-b border-gray-200 text-left"
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManage;
