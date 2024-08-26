import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../../Footer";
import "./Sandh.css";

const sem1sandhr23 = () => {
  const [printaction, setPrintAction] = useState(false);
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [totals, setTotals] = useState({
    credit: 0,
    sum: 0,
    gpa: 0,
  });

  var vale1 = { O: 10, Aplus: 9, A: 8, Bplus: 7, B: 6, C: 5, other: 0 };

  useEffect(() => {
    // Fetch course data from the backend
    axios
      .get("http://localhost:5000/courses/sem1")
      .then((response) => {
        setCourses(response.data); // Assuming data is an array of courses with {courseName, credit} fields
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  const handleGradeChange = (index, value) => {
    const newGrades = [...grades];
    newGrades[index] = value;
    setGrades(newGrades);
    calculateTotals(newGrades);
  };

  const calculateTotals = (grades) => {
    let sum = 0;
    let credit = 0;

    grades.forEach((grade, index) => {
      const gradeValue = vale1[grade];
      const courseCredit = courses[index].credit;
      sum += gradeValue * courseCredit;
      credit += courseCredit;
    });

    const gpa = credit ? (sum / credit).toFixed(3) : 0;
    setTotals({ credit, sum, gpa });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      regno: e.target.regno.value,
      credit: totals.credit,
      sum: totals.sum,
      gpa: totals.gpa,
    };

    try {
      const response = await axios.post("http://localhost:5000/sem1", data);
      if (response.status === 200) {
        alert("Data inserted successfully");
      }
    } catch (error) {
      console.error("Error posting data:", error);
      if (error.response && error.response.status === 409) {
        alert("Registration number already exists");
      } else {
        alert("Not registered");
      }
    }
  };

  return (
    <div className="container flex flex-wrap justify-center">
      <div className="flex flex-wrap gap-4 m-5 p-5 flex-col justify-center">
        <h1 className="roboto-bold flex flex-wrap justify-center text-xl text-center">
          CGPA FOR SEMESTER-I
        </h1>
        <div className="justify-center flex flex-wrap p-3 gap-3 ">
          <table className="table-bordered border-2 rounded-sm gap-5 bg-white text-center ">
            <thead>
              <tr>
                <th>COURSE</th>
                <th>CREDIT SCORE</th>
                <th>GRADE</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={index}>
                  <th>{course.courseName}</th>
                  <th>{course.credit}</th>
                  <td>
                    <div className="input-group m-3 p-3">
                      <select
                        className="form-select selectsem1"
                        value={grades[index] || "Choose..."}
                        onChange={(e) =>
                          handleGradeChange(index, e.target.value)
                        }
                      >
                        <option value="Choose...">Choose...</option>
                        <option value="O">O</option>
                        <option value="Aplus">Aplus</option>
                        <option value="A">A</option>
                        <option value="Bplus">Bplus</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="other">OTHER</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form
          onSubmit={handleSubmit}
          className="container flex flex-wrap justify-center gap-4"
        >
          <div className="card shadow-2xl p-3 rounded-lg">
            <div className="card-body flex flex-col flex-wrap justify-center items-center gap-4">
              <input
                type="text"
                id="totcreditreg"
                name="totcredit"
                value={totals.credit}
                placeholder="TOTAL Credits"
                className={`${
                  printaction
                    ? "printaction"
                    : "p-2 m-3 font-bold border-blue-700 border rounded-lg w-72 text-center"
                }`}
                readOnly
              />
              <input
                type="text"
                id="totsumvalue"
                name="totsum"
                value={totals.sum}
                placeholder="TOTAL SUM"
                className={`${
                  printaction
                    ? "printaction"
                    : "p-2 m-3 font-bold border-blue-700 border rounded-lg w-72 text-center"
                }`}
                readOnly
              />
              <input
                type="text"
                className="p-2 m-3 font-bold border-blue-700 border rounded-lg w-72 text-center"
                name="gpa"
                id="gpa1"
                value={totals.gpa}
                readOnly
              />
              <input
                type="text"
                className="p-2 m-3 font-bold border-blue-700 border rounded-lg w-72 text-center"
                name="cgpa"
                id="totcgpa1"
                value={totals.gpa} // Assuming GPA for this semester only
                readOnly
              />
              <div className="flex flex-wrap flex-col p-3 m-2 gap-4 justify-center items-center">
                <input
                  type="text"
                  name="regno"
                  placeholder="enter your reg no"
                  className="p-2 m-3 font-bold text-center border-blue-700 border rounded-lg w-72 "
                  required
                />
                <button
                  className="bg-blue-800 text-center text-white p-3 rounded-md content-center"
                  type="submit"
                >
                  add to db
                </button>
                <button
                  className="bg-blue-800 text-center text-white p-3 rounded-md content-center"
                  type="button"
                  onClick={() => {
                    setPrintAction(true);
                    setTimeout(() => {
                      window.print();
                    }, 1000);
                  }}
                >
                  PRINT
                </button>
                <button
                  className="bg-blue-800 text-white p-3 text-center rounded-md content-center"
                  type="button"
                  onClick={() => document.location.reload()}
                >
                  RELOAD
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default sem1sandhr23;
