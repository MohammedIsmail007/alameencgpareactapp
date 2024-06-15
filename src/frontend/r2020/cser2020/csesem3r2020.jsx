import React, { useEffect, useState } from "react";
import axios from "axios";

const Csesem3r2020 = () => {
  const [regnos, setRegnos] = useState([]);
  const [selectedRegno, setSelectedRegno] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetchRegnos();
  }, [refresh]);

  const fetchRegnos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/sem2"); // Update this endpoint as necessary
      setRegnos(response.data);
    } catch (error) {
      console.error("Error fetching registration numbers:", error);
    }
  };

  const fetchStudentData = async (regno) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/sem2/${regno}`);
      setStudentData(response.data);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (e) => {
    const regno = e.target.value;
    setSelectedRegno(regno);
    fetchStudentData(regno);
  };
  // For arrears calculations only
  const [arrears, setArrears] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [arreartotalcreditscore, setArreartotalcreditscore] = useState(0);
  const [arreartotalgrades, setArreartotalgrades] = useState(0);

  const handleArrearsChange = (event) => {
    const numArrears = parseInt(event.target.value, 10);
    setArrears(numArrears);
    setSubjects(
      Array.from({ length: numArrears }, () => ({
        creditScore: "0.0",
        grade: "0.0",
      }))
    );
  };

  const handleCreditScoreChange = (index, event) => {
    const newSubjects = [...subjects];
    newSubjects[index].creditScore = event.target.value;
    setSubjects(newSubjects);
  };

  const handleGradeChange = (index, event) => {
    const newSubjects = [...subjects];
    newSubjects[index].grade = event.target.value;
    setSubjects(newSubjects);
  };

  const handleSubmitArrear = () => {
    //console.log("Selected Subjects:", subjects);

    let totalCreditScore = 0;
    let totalGradePoints = 0;

    subjects.forEach((subject) => {
      const creditScore = parseFloat(subject.creditScore, 10);
      const grade = parseFloat(subject.grade, 10);
      totalCreditScore += creditScore;
      totalGradePoints += creditScore * grade;
    });

    setArreartotalcreditscore(totalCreditScore);
    setArreartotalgrades(totalGradePoints);

    //console.log("Total Credit Score:", totalCreditScore);
    //console.log("Total Grade (multiplied by credit score):", totalGradePoints);
  };

  //arrear calculation ----------------------------------------------------------------

  const [printaction, setPrintAction] = useState(false);
  var csevale3 = { O: 10, Aplus: 9, A: 8, Bplus: 7, B: 6, C: 5, other: 0 };
  var csesem3 = [4, 4, 3, 3, 3, 1.5, 1.5, 1.5, 0, 0];
  var csesum3 = 0;
  var csegpa3 = [];
  var csetot3 = 0;
  var mulcsesum3 = 0;
  var creditregcse3 = 0;
  function get3() {
    var ses = document.getElementsByClassName("selectcsesem3");
    var creditregcse3 = 0; // Initialize creditreg to 0
    csesum3 = 0; // Ensure sum1 is reset
    csegpa3 = []; // Ensure gpa1 is reset

    for (var i = 0; i < ses.length; i++) {
      var val2 = ses[i].options[ses[i].selectedIndex].value;
      csegpa3.push(csevale3[val2] * csesem3[i]);
      csesum3 += csevale3[val2] * csesem3[i];

      // Update creditreg only if the selected option is not "other"
      if (val2 !== "other") {
        creditregcse3 += csesem3[i];
      }
    }

    // Calculate the GPA
    mulcsesum3 = csesum3;
    //const prevcredit = parseFloat(studentData.prevcredit);

    ////console.log(creditreg);
    csetot3 = creditregcse3 === 0 ? 0 : (mulcsesum3 / creditregcse3).toFixed(3);

    // Update the form fields
    document.getElementById("totcreditregcse3").value = creditregcse3;
    document.getElementById("totsumvaluecse3").value = csesum3;
    document.getElementById("csegpa3").value = csetot3;
  }

  // //console.log(studentData.totcredit);
  function sem3cgpacalc() {
    const prevcredit = document.getElementById("cseprevcredit3").value;
    const sem2credit =
      parseFloat(studentData.totcredit2) + parseFloat(prevcredit);
    const sem2totsum = parseFloat(studentData.totsum2);
    const sem3totsum = document.getElementById("totsumvaluecse3").value;
    const sem3credit = document.getElementById("totcreditregcse3").value;

    const totalsum =
      parseFloat(sem2totsum) +
      parseFloat(sem3totsum) +
      parseFloat(arreartotalgrades);
    const totalcredit =
      parseFloat(sem2credit) +
      parseFloat(sem3credit) +
      parseFloat(arreartotalcreditscore);
    const cgpasem2total = totalsum / totalcredit;
    document.getElementById("totccsegpa3").value = cgpasem2total.toFixed(2);
    ////console.log(prevcredit);
    // //console.log(cgpasem2total);
    ////console.log(parseFloat(sem2credit) + parseFloat(sem3credit));
    // //console.log(sem3credit);
    // //console.log(sem1totsum);
    // //console.log(sem2totsum);
    // //console.log(totalsum);
    // //console.log(totalcredit);
    // //console.log(cgpasem2total);
    document.getElementById("totalcsesum3").value =
      parseFloat(totalsum).toFixed(3);
    document.getElementById("totalcreditcse3").value = totalcredit;
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
      const response = await axios.post("http://localhost:5000/csesem3", data);

      //console.log(response.data);
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
    <>
      <div className="container flex flex-wrap justify-center">
        {/* STARTING OF SEMESTER 2 TABLE CGPA CALCULATION */}
        <div className="container ">
          {" "}
          {/* CGPA RENDER AREA ------------------------------------------------------- */}
          <div className=" flex flex-wrap gap-4 m-5 p-5 flex-col  justify-center">
            <div className="container flex flex-wrap justify-center ">
              <h1 className=" roboto-bold flex flex-wrap justify-center text-xl text-center">
                CGPA FOR SEMESTER-III
              </h1>
              <div>
                {/* TABLE STARTING--------------------------------------------------- */}
                <div className="justify-center flex flex-wrap p-3  gap-3">
                  {" "}
                  <table className="table-bordered border-2 rounded-sm gap-5 bg-white text-center">
                    <thead>
                      <tr>
                        <th>COURSE</th>
                        <th>CREDIT SCORE</th>
                        <th>GRADE</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>Probability and Queuing Theory</th>
                        <th>4</th>
                        <td>
                          <div className="input-group mb-3">
                            <select
                              className="form-select selectcsesem3"
                              id="inputGroupSelect01"
                            >
                              <option selected="">Choose...</option>
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

                      <tr>
                        <th>
                          Data Structures &amp; <br />
                          Algorithms
                        </th>
                        <th>4</th>
                        <td>
                          <div className="input-group mb-3">
                            <select
                              className="form-select selectcsesem3"
                              id="inputGroupSelect02"
                            >
                              <option selected="">Choose...</option>
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

                      <tr>
                        <th>
                          Digital Principles and <br />
                          System Designs
                        </th>
                        <th>3</th>
                        <td>
                          <div className="input-group mb-3">
                            <select
                              className="form-select selectcsesem3"
                              id="inputGroupSelect03"
                            >
                              <option selected="">Choose...</option>
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

                      <tr>
                        <th>Computer Architecture</th>
                        <th>3</th>
                        <td>
                          <div className="input-group mb-3">
                            <select
                              className="form-select selectcsesem3"
                              id="inputGroupSelect04"
                            >
                              <option selected="">Choose...</option>
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

                      <tr>
                        <th>Object Oriented programing with java</th>
                        <th>3</th>
                        <td>
                          <div className="input-group mb-3">
                            <select
                              className="form-select selectcsesem3"
                              id="inputGroupSelect05"
                            >
                              <option selected="">Choose...</option>
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

                      <tr>
                        <th>
                          Data Structures <br />
                          Laboratory
                        </th>
                        <th>1.5</th>
                        <td>
                          <div className="input-group mb-3">
                            <select
                              className="form-select selectcsesem3"
                              id="inputGroupSelect06"
                            >
                              <option selected="">Choose...</option>
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

                      <tr>
                        <th>
                          Object Oriented Programming with Java Laboratory
                        </th>
                        <th>1.5</th>
                        <td>
                          <div className="input-group mb-3">
                            <select
                              className="form-select selectcsesem3"
                              id="inputGroupSelect07"
                            >
                              <option selected="">Choose...</option>
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

                      <tr>
                        <th>
                          Digital Systems <br />
                          Laboratory
                        </th>
                        <th>1.5</th>
                        <td>
                          <div className="input-group mb-3">
                            <select
                              className="form-select selectcsesem3"
                              id="inputGroupSelect07"
                            >
                              <option selected="">Choose...</option>
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

                      <tr>
                        <th>Constitution Of India</th>
                        <th>0</th>
                        <td>
                          <div className="input-group mb-3">
                            <select
                              className="form-select selectcsesem3"
                              id="inputGroupSelect07"
                            >
                              <option selected="">Choose...</option>
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
                      <tr>
                        <th>Tamils and Technology</th>
                        <th>0</th>
                        <td>
                          <div className="input-group mb-3">
                            <select
                              className="form-select selectaidssem3"
                              id="inputGroupSelect07"
                            >
                              <option selected="">Choose...</option>
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
                    </tbody>
                  </table>
                </div>
                {/* TABLE END ---------------------------------------------------------------- */}
                {/* arrear calculation start```````````````````````````````````````````````````````````````` */}
                <div
                  className={`${
                    printaction
                      ? "printaction"
                      : "p-5 flex flex-wrap justify-center gap-4"
                  }`}
                >
                  <h2 className="text-xl mb-4 font-bold text-blue-900 text-center">
                    IF YOU HAVE CLEARED CURRENT SEM ARREARS <br /> THEN SELECT
                    NUMBER OF ARREARS
                  </h2>
                  <select
                    className="p-2 border border-gray-300 rounded mb-4"
                    onChange={handleArrearsChange}
                    value={arrears}
                  >
                    {[...Array(11).keys()].map((number) => (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    ))}
                  </select>

                  {arrears > 0 && (
                    <>
                      <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                          <tr>
                            <th className="border border-gray-300 px-4 py-2">
                              Subject
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                              Credit Score
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                              Grade
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjects.map((subject, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 px-4 py-2">
                                Subject {index + 1}
                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                <select
                                  className="w-full p-2 border border-gray-300 rounded"
                                  value={subject.creditScore}
                                  onChange={(e) =>
                                    handleCreditScoreChange(index, e)
                                  }
                                >
                                  <option value="0.0">choose</option>
                                  <option value="4.0">4.0</option>
                                  <option value="3.0">3.0</option>
                                  <option value="1.5">1.5</option>
                                  <option value="0.0">0.0</option>
                                </select>
                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                <select
                                  className="w-full p-2 border border-gray-300 rounded"
                                  value={subject.grade}
                                  onChange={(e) => handleGradeChange(index, e)}
                                >
                                  <option value="0.0">choose</option>
                                  <option value="10.0">O</option>
                                  <option value="9.0">Aplus</option>
                                  <option value="8.0">A</option>
                                  <option value="7.0">Bplus</option>
                                  <option value="6.0">B</option>
                                  <option value="5.0">C</option>
                                  <option value="0.0">OTHER</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button
                        className="mt-4 p-2 bg-blue-500 text-white rounded"
                        onClick={handleSubmitArrear}
                      >
                        Add to calculation
                      </button>
                    </>
                  )}
                </div>
                {/* Arrear calculation end */}
                {/* CGPA CALCULATION BUTTON AREA STARTS */}
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-wrap justify-center gap-4 container "
                >
                  <div className="card  shadow-2xl  p-3 rounded-lg">
                    <div className="card-body flex flex-col flex-wrap justify-center items-center gap-4 ">
                      <br />
                      <input
                        type="text"
                        id="totcreditregcse3"
                        placeholder="TOTAL Credits"
                        className={`${
                          printaction
                            ? "printaction"
                            : "p-2 m-3 font-bold border-blue-700 border rounded-lg w-72 text-center"
                        }`}
                        readOnly
                      />
                      <br />
                      <input
                        type="text"
                        id="totsumvaluecse3"
                        placeholder="TOTAL SUM"
                        className={`${
                          printaction
                            ? "printaction"
                            : "p-2 m-3 font-bold border-blue-700 border rounded-lg w-72 text-center"
                        }`}
                        readOnly
                      />
                      <br />
                      <label
                        tabIndex="0"
                        className={`${
                          printaction
                            ? "printaction hidden"
                            : "hidden p-2 m-3 font-bold text-center border-blue-700 border rounded-lg w-72 bg-blue-800 text-white hover:transition-all"
                        }`}
                      >
                        Enter your previous sem Cleared arrear credit score if
                        you have any{" "}
                        <p className="text-yellow-400">or Enter 0</p>
                      </label>
                      <input
                        type="integer"
                        id="cseprevcredit3"
                        name="cseprevcredit"
                        value={"0"}
                        placeholder="Ex: 4.0 "
                        className={`${
                          printaction
                            ? "printaction hidden"
                            : "p-2 m-3 font-bold border-blue-700 border rounded-lg w-72 text-center hidden"
                        }`}
                        readOnly
                      />
                      <br />
                      <label
                        tabIndex="0"
                        className="p-2 m-3 font-bold border-blue-700 border text-center rounded-lg w-72 bg-blue-800 text-white hover:transition-all "
                        onClick={() => {
                          get3();
                          setRefresh(true);
                        }}
                      >
                        FOR GPA{" "}
                      </label>
                      <input
                        type="text"
                        className="p-2 m-3 font-bold border-blue-700 border rounded-lg w-72 text-center"
                        name="gpa3"
                        id="csegpa3"
                        readOnly
                      />
                      <br />
                      <div
                        className={`${
                          printaction
                            ? "printaction"
                            : "p-2 m-3 border-blue-700 border rounded-lg w-72 bg-blue-800 text-white "
                        }`}
                      >
                        <h1>Select Your register number to calculate CGPA</h1>
                        <select
                          value={selectedRegno}
                          onChange={handleSelectChange}
                          className=" rounded-md p-2 m-3 text-black"
                        >
                          <option value="" className="text-black">
                            Select a registration number
                          </option>
                          {regnos.map((student) => (
                            <option key={student.regno} value={student.regno}>
                              {student.regno}
                            </option>
                          ))}
                        </select>

                        {loading && <div>Loading...</div>}
                        {error && <div>Error: {error.message}</div>}

                        {studentData && (
                          <div>
                            <h2 className="text-center font-bold">
                              Student Information
                            </h2>
                            <p>
                              <strong>Regno:</strong> {studentData.regno}
                            </p>
                            <p>
                              <strong>Name:</strong> {studentData.name}
                            </p>
                            <p>
                              <strong>Department:</strong> {studentData.dpt}
                            </p>
                            <p>
                              <strong>Total Sum:</strong> {studentData.totsum2}
                            </p>
                            <p>
                              <strong>Total Credit:</strong>{" "}
                              {studentData.totcredit2}
                            </p>
                            <p>
                              <strong>Previous Credit:</strong>{" "}
                              {studentData.prevcredit2}
                            </p>
                            <p>
                              <strong>GPA:</strong> {studentData.gpa2}
                            </p>
                            <p>
                              <strong>CGPA:</strong> {studentData.cgpa2}
                            </p>
                          </div>
                        )}
                      </div>
                      <br />
                      <label
                        tabIndex="0"
                        className=" p-2 m-3 font-bold border-blue-700 border text-center rounded-lg w-72 bg-blue-800 text-white hover:transition-all"
                        onClick={() => {
                          sem3cgpacalc();
                        }}
                      >
                        YOUR CGPA{" "}
                      </label>{" "}
                      <input
                        type="text"
                        className="p-2 m-3 font-bold border-blue-700 border text-center rounded-lg w-72"
                        name="cgpa3"
                        id="totccsegpa3"
                        readOnly
                      />
                      {/* {to add total values in cse sem 3 table database} */}
                      <input
                        type="text"
                        className={`${
                          printaction
                            ? "printaction"
                            : "p-2 m-3 font-bold border-blue-700 border text-center rounded-lg w-72 hidden"
                        }`}
                        name="csetotsum"
                        id="totalcsesum3"
                        readOnly
                      />
                      <input
                        type="text"
                        className={`${
                          printaction
                            ? "printaction"
                            : "p-2 m-3 font-bold border-blue-700 border text-center rounded-lg w-72 hidden"
                        }`}
                        name="csetotcredit"
                        id="totalcreditcse3"
                        readOnly
                      />
                      {/* {-------------------------------------------------------------------} */}
                      <br />
                      <div className="flex flex-wrap p-3 m-2 gap-4 justify-center container">
                        <br />

                        <input
                          type="text"
                          name="regno"
                          placeholder="enter your reg no"
                          className="p-2 m-3 font-bold text-center border-blue-700 border rounded-lg w-72 "
                          required="required"
                        />
                        <button
                          className="bg-blue-800 text-center text-white p-3 rounded-md content-center"
                          type="submit"
                        >
                          add to db
                        </button>
                        <br />
                        <button
                          className="bg-blue-800 text-center text-white p-3 rounded-md content-center"
                          type="button"
                          value="print"
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
                          value="reload"
                          onClick={() => {
                            setTimeout(document.location.reload(), 1000);
                          }}
                        >
                          RELOAD
                        </button>
                        {/* RELOAD AND PRINT BUTTON COMMON FOR ALL END--------------------- */}
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* CGPA CALCULATION BUTTON AREA END ------------------*/}
              <br />
              <div className=" flex flex-wrap justify-center container">
                <p>
                  {" "}
                  <b>NOTE: </b>CLICK THE <b>RELOAD</b> BUTTON TO ENTER NEW
                  CALCULATION
                </p>
              </div>
            </div>{" "}
            <br />
          </div>
        </div>
      </div>
    </>
  );
};

export default Csesem3r2020;
