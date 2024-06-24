import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../../Footer";
import "./Sandh.css";

const Sem1sandh = () => {
  const [printaction, setPrintAction] = useState(false);
  var vale1 = { O: 10, Aplus: 9, A: 8, Bplus: 7, B: 6, C: 5, other: 0 };
  var sem111 = [4, 3, 4, 3, 3, 1.5, 1.5];
  var sum1 = 0;
  var gpa1 = [];
  var tot1 = 0;
  var mulsum1 = 0;

  function get1() {
    var ses = document.getElementsByClassName("selectsem1");
    var creditreg = 0; // Initialize creditreg to 0
    sum1 = 0; // Ensure sum1 is reset
    gpa1 = []; // Ensure gpa1 is reset

    for (var i = 0; i < ses.length; i++) {
      var val1 = ses[i].options[ses[i].selectedIndex].value;
      gpa1.push(vale1[val1] * sem111[i]);
      sum1 += vale1[val1] * sem111[i];

      // Update creditreg only if the selected option is not "other"
      if (val1 !== "other") {
        creditreg += sem111[i];
      }
    }

    // Calculate the GPA
    mulsum1 = sum1;
    // const prevcredit = parseFloat(document.getElementById("prevcredit").value);
    // creditreg = creditreg + prevcredit;
    ////console.log(creditreg);
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
    // //console.log(sem1credit);
    // //console.log(sem1totsum);
    // //console.log(sem2totsum);
    // //console.log(arreartotalcreditscore);
    // //console.log(arreartotalgrades);
    // //console.log(totalsum);
    // //console.log(totalcredit);
    // //console.log(cgpasem2total);
    // //console.log(arreartotalcreditscore);
    // //console.log(arreartotalgrades);
    // document.getElementById("totalsum2").value = totalsum.toFixed(3);
    // document.getElementById("totalcredit").value = totalcredit;
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
      const response = await axios.post("http://localhost:5000/sem1", data);

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
    <div className="container flex flex-wrap justify-center">
      {" "}
      {/* CGPA RENDER AREA ------------------------------------------------------- */}
      <div className=" flex flex-wrap gap-4 m-5 p-5 flex-col  justify-center">
        <h1 className="roboto-bold flex flex-wrap justify-center text-xl text-center">
          CGPA FOR SEMESTER-I
        </h1>
        <div>
          {/* TABLE STARTING--------------------------------------------------- */}
          <div className="justify-center flex flex-wrap p-3 gap-3 ">
            {" "}
            <table className="table-bordered border-2 rounded-sm gap-5 bg-white text-center ">
              <thead>
                <tr>
                  <th>COURSE</th>
                  <th>CREDIT SCORE</th>
                  <th>GRADE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Engineering Mathematics-I</th>
                  <th>4</th>
                  <td>
                    <div className="input-group m-3 p-3">
                      <select
                        className="form-select selectsem1"
                        id="inputGroupSelect01"
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

                <tr>
                  <th>Engineering Chemistry</th>
                  <th>3</th>
                  <td>
                    <div className="input-group m-3 p-3">
                      <select
                        className="form-select selectsem1"
                        id="inputGroupSelect02"
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

                <tr>
                  <th>Communicative English-I</th>
                  <th>4</th>
                  <td>
                    <div className="input-group m-3 p-3">
                      <select
                        className="form-select selectsem1"
                        id="inputGroupSelect03"
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

                <tr>
                  <th>Engineering physics</th>
                  <th>3</th>
                  <td>
                    <div className="input-group m-3 p-3">
                      <select
                        className="form-select selectsem1"
                        id="inputGroupSelect04"
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

                <tr>
                  <th>
                    Fundamentals of <br />
                    Computing and programming
                  </th>
                  <th>3</th>
                  <td>
                    <div className="input-group m-3 p-3">
                      <select
                        className="form-select selectsem1"
                        id="inputGroupSelect05"
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

                <tr>
                  <th>Physics chemistry lab</th>
                  <th>1.5</th>
                  <td>
                    <div className="input-group m-3 p-3">
                      <select
                        className="form-select selectsem1"
                        id="inputGroupSelect06"
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

                <tr>
                  <th>Computer practices lab</th>
                  <th>1.5</th>
                  <td>
                    <div className="input-group m-3 p-3">
                      <select
                        className="form-select selectsem1"
                        id="inputGroupSelect07"
                      >
                        <option value="choose">Choose...</option>
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

          {/* CGPA CALCULATION BUTTON AREA STARTS */}
          <form
            onSubmit={handleSubmit}
            className="container flex flex-wrap  justify-center gap-4 "
          >
            <div className="card  shadow-2xl  p-3 rounded-lg">
              <div className="card-body flex flex-col flex-wrap justify-center items-center gap-4 ">
                <br />
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
                <br />
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
                <br />
                <label
                  tabIndex="0"
                  className={`${
                    printaction
                      ? "printaction hidden"
                      : "hidden p-2 m-3 font-bold text-center border-blue-700 border rounded-lg w-72 bg-blue-800 text-white hover:transition-all"
                  }`}
                >
                  Enter your previous sem Cleared arrear credit score if you
                  have any <p className="text-yellow-400">or Enter 0</p>
                </label>
                <input
                  type="integer"
                  id="prevcredit"
                  name="prevcredit"
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
                <br />
                <label
                  tabIndex="0"
                  className=" p-2 m-3 font-bold border-blue-700 border text-center rounded-lg w-72 bg-blue-800 text-white hover:transition-all"
                  onClick={() => {
                    sem1cgpacalc();
                  }}
                >
                  YOUR CGPA{" "}
                </label>{" "}
                <input
                  type="text"
                  className="p-2 m-3 font-bold border-blue-700 border text-center rounded-lg w-72"
                  name="cgpa"
                  id="totcgpa1"
                  readOnly
                />
                <br />
                <div className="flex flex-wrap flex-col p-3 m-2 gap-4 justify-center items-center">
                  <p className="text-center font-sans">
                    <b>
                      ADD YOUR GPA & CGPA TO YOUR DATABASE TO CALCULATE NEXT SEM
                      CGPA
                    </b>
                  </p>{" "}
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
      </div>
    </div>
  );
};

export default Sem1sandh;
