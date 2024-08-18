import React, { useState, useEffect } from "react";
import axios from "axios";

const FacultyManage = () => {
  const [rows, setRows] = useState([
    { course_code: "", course_title: "", course_cred: "" },
  ]);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tables")
      .then((response) => {
        setTables(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the tables!", error);
      });
  }, []);

  const handleInputChange = (index, event) => {
    const values = [...rows];
    values[index][event.target.name] = event.target.value;
    setRows(values);
  };

  const handleAddRow = () => {
    setRows([...rows, { course_code: "", course_title: "", course_cred: "" }]);
  };

  const handleRemoveRow = (index) => {
    const values = [...rows];
    values.splice(index, 1);
    setRows(values);
  };

  const handleTableSelect = (e) => {
    const tableName = e.target.value;
    setSelectedTable(tableName);

    // Fetch the data of the selected table
    axios
      .get(`http://localhost:5000/api/tableData?table=${tableName}`)
      .then((response) => {
        setTableData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the table data!", error);
      });
  };

  const handleSubmit = () => {
    if (!selectedTable) {
      alert("Please select a table.");
      return;
    }

    axios
      .post(`http://localhost:5000/api/insert`, { rows, table: selectedTable })
      .then((response) => {
        alert("Data inserted successfully!");
      })
      .catch((error) => {
        console.error("There was an error inserting data!", error);
      });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">
        FACULTY PANEL
      </h3>

      <div className="mb-6">
        <label
          htmlFor="tableSelect"
          className="block text-gray-700 font-medium mb-2"
        >
          Select Table
        </label>
        <select
          id="tableSelect"
          value={selectedTable}
          onChange={handleTableSelect}
          className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Select a table
          </option>
          {tables.map((table) => (
            <option key={table} value={table}>
              {table}
            </option>
          ))}
        </select>
      </div>

      {rows.map((row, index) => (
        <div key={index} className="grid grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            name="course_code"
            value={row.course_code}
            onChange={(event) => handleInputChange(index, event)}
            placeholder="Course Code"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="course_title"
            value={row.course_title}
            onChange={(event) => handleInputChange(index, event)}
            placeholder="Course Title"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="course_cred"
            value={row.course_cred}
            onChange={(event) => handleInputChange(index, event)}
            placeholder="Course Credits"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleRemoveRow(index)}
            className="text-red-500 hover:text-red-700 font-medium"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="flex justify-between mb-6">
        <button
          onClick={handleAddRow}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Row
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Submit
        </button>
      </div>

      {tableData.length > 0 && (
        <div className="mt-8">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">
            Data of Selected Table: {selectedTable}
          </h4>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                {Object.keys(tableData[0]).map((key) => (
                  <th
                    key={key}
                    className="py-2 px-4 bg-gray-200 border-b text-left"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, idx) => (
                    <td key={idx} className="py-2 px-4 border-b text-left">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FacultyManage;
