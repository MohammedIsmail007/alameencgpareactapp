import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../../Footer";

const sem1sandhr23 = () => {
  const [printaction, setPrintAction] = useState(false);
  const [courses, setCourses] = useState([]);

  var vale1 = { O: 10, Aplus: 9, A: 8, Bplus: 7, B: 6, C: 5, other: 0 };
  var sum1 = 0;
  var gpa1 = [];
  var tot1 = 0;
  var mulsum1 = 0;

  useEffect(() => {
    // Fetch course data from backend
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "https://alameencgpareactappserver.onrender.com/sem1r2023"
        );
        setCourses(response.data); // Assuming the response contains an array of courses
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  function get1() {
    var ses = document.getElementsByClassName("selectsem1");
    var creditreg = 0; // Initialize creditreg to 0
    sum1 = 0; // Ensure sum1 is reset
    gpa1 = []; // Ensure gpa1 is reset

    for (var i = 0; i < ses.length; i++) {
      var val1 = ses[i].options[ses[i].selectedIndex].value;
      gpa1.push(vale1[val1] * courses[i].credit_score); // Use credit score from courses data
      sum1 += vale1[val1] * courses[i].credit_score;

      // Update creditreg only if the selected option is not "other"
      if (val1 !== "other") {
        creditreg += courses[i].credit_score;
      }
    }

    // Calculate the GPA
    mulsum1 = sum1;
    tot1 = creditreg === 0 ? 0 : (mulsum1 / creditreg).toFixed(3);

    // Update the form fields
    document.getElementById("totcreditreg").value = creditreg;
    document.getElementById("totsumvalue").value = sum1;
    document.getElementById("gpa1").value = tot1;
  }

  function sem1cgpacalc() {
    const sem1credit = document.getElementById("totcreditreg").value;
    const sem1totsum = document.getElementById("totsumvalue").value;

    const totalsum = parseFloat(sem1totsum);
    const totalcredit = parseFloat(sem1credit);

    const cgpasem2total = totalsum / totalcredit;
    document.getElementById("totcgpa1").value = cgpasem2total.toFixed(2);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      const response = await axios.post(
        "https://alameencgpareactappserver.onrender.com/sem1",
        data
      );

      if (response.status) {
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
        <div>
          <div className="justify-center flex flex-wrap p-3 gap-3 ">
            <form
              onSubmit={handleSubmit}
              className="container flex flex-wrap justify-center gap-4"
            >
              <div className="card shadow-2xl p-3 rounded-lg">
                <div className="card-body flex flex-col flex-wrap justify-center items-center gap-4">
                  {courses.length > 0 ? (
                    <table className="table-bordered border-2 rounded-sm gap-5 bg-white text-center">
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
                            <th>{course.course_title}</th>
                            <th>{course.course_cred}</th>
                            <td>
                              <div className="input-group m-3 p-3">
                                <select
                                  className="form-select selectsem1"
                                  id={`inputGroupSelect${index}`}
                                >
                                  <option>Choose...</option>
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
                  ) : (
                    <p>Loading courses...</p>
                  )}

                  {/* GPA and CGPA calculation buttons and inputs */}
                  <input
                    type="text"
                    id="totcreditreg"
                    name="totcredit"
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
                    placeholder="TOTAL SUM"
                    name="totsum"
                    className={`${
                      printaction
                        ? "printaction"
                        : "p-2 m-3 font-bold border-blue-700 border rounded-lg w-72 text-center"
                    }`}
                    readOnly
                  />
                  <label
                    tabIndex="0"
                    className={`p-2 m-3 font-bold text-center border-blue-700 border rounded-lg w-72 bg-blue-800 text-white hover:transition-all ${
                      printaction ? "hidden" : ""
                    }`}
                    onClick={() => {
                      get1();
                    }}
                  >
                    FOR GPA{" "}
                  </label>
                  <input
                    type="text"
                    className="p-2 m-3 font-bold border-blue-700 border rounded-lg w-72 text-center"
                    name="gpa"
                    id="gpa1"
                    readOnly
                  />
                  <label
                    tabIndex="0"
                    className="p-2 m-3 font-bold border-blue-700 border text-center rounded-lg w-72 bg-blue-800 text-white hover:transition-all"
                    onClick={() => {
                      sem1cgpacalc();
                    }}
                  >
                    YOUR CGPA{" "}
                  </label>
                  <input
                    type="text"
                    className="p-2 m-3 font-bold border-blue-700 border text-center rounded-lg w-72"
                    name="cgpa"
                    id="totcgpa1"
                    readOnly
                  />

                  {/* Registration number input and submit button */}
                  <div className="flex flex-wrap flex-col p-3 m-2 gap-4 justify-center items-center">
                    <p className="text-center font-sans">
                      <b>
                        ADD YOUR GPA & CGPA TO YOUR DATABASE TO CALCULATE NEXT
                        SEM CGPA
                      </b>
                    </p>
                    <input
                      type="text"
                      name="regno"
                      placeholder="enter your reg no"
                      className="p-2 m-3 font-bold text-center border-blue-700 border rounded-lg w-72"
                      required="required"
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
                      value="print"
                      onClick={() => {
                        setPrintAction(true);
                        setTimeout(() => {
                          window.print();
                        }, 100);
                      }}
                    >
                      Print your score
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default sem1sandhr23;
