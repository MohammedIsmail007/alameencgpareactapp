import React, { useState } from "react";
import axios from "axios";

const FacultyManage = () => {
  const [rows, setRows] = useState([
    { course_code: "", course_title: "", course_cred: "" },
  ]);

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

  const handleSubmit = () => {
    axios
      .post("http://localhost:5000/api/insert", { rows })
      .then((response) => {
        alert("Data inserted successfully!");
      })
      .catch((error) => {
        console.error("There was an error inserting data!", error);
      });
  };

  return (
    <div>
      <h3>Create Table</h3>
      {rows.map((row, index) => (
        <div key={index}>
          <input
            type="text"
            name="course_code"
            value={row.course_code}
            onChange={(event) => handleInputChange(index, event)}
          />
          <input
            type="text"
            name="course_title"
            value={row.course_title}
            onChange={(event) => handleInputChange(index, event)}
          />
          <input
            type="text"
            name="course_cred"
            value={row.course_cred}
            onChange={(event) => handleInputChange(index, event)}
          />
          <button onClick={() => handleRemoveRow(index)}>Remove</button>
        </div>
      ))}
      <button onClick={handleAddRow}>Add Row</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default FacultyManage;
