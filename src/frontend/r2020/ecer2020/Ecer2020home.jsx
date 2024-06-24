import React from "react";
import { useState } from "react";
import Footer from "../../Footer.jsx";

import Ecesem3r2020 from "./Ecesem3r2020.jsx";
import Ecesem4r2020 from "./Ecesem4r2020.jsx";
import Ecesem5r2020 from "./Ecesem5r2020.jsx";
import Ecesem6r2020 from "./Ecesem6r2020.jsx";

const Ecer2020home = () => {
  const [sem3, setSem3] = useState(false);
  const [sem4, setSem4] = useState(false);
  const [sem5, setSem5] = useState(false);
  const [sem6, setSem6] = useState(false);
  const [sem7, setSem7] = useState(false);
  const [sem8, setSem8] = useState(false);

  const [printaction, setPrintAction] = useState(false);

  return (
    <>
      <div className="container flex flex-wrap gap-2 p-5 flex-col justify-center ">
        <h1 className="font-extrabold text-center text-2xl roboto-regular flex flex-wrap justify-center">
          SELECT YOUR SEM TO CALCULATE YOUR CGPA
        </h1>
        <div className="flex flex-wrap justify-center container">
          <div
            className={`${
              printaction ? "printaction" : "rounded-lg  m-2 justify-center"
            }`}
          >
            <button
              className="text-white bg-blue-700 p-2 m-2 rounded-md  roboto-regular"
              onClick={() => {
                setSem3(!sem3);
                setSem4(false);
                setSem5(false);
                setSem6(false);
                setSem7(false);
                setSem8(false);
              }}
            >
              <h2>sem 3</h2>
            </button>

            <button
              className="text-white bg-blue-700 p-2 m-2 rounded-md roboto-regular"
              onClick={() => {
                setSem4(!sem4);
                setSem5(false);
                setSem6(false);
                setSem3(false);
                setSem7(false);
                setSem8(false);
              }}
            >
              <h2>sem 4</h2>
            </button>
            <button
              className="text-white bg-blue-700 p-2 m-2 rounded-md roboto-regular"
              onClick={() => {
                setSem5(!sem5);
                setSem6(false);
                setSem3(false);
                setSem4(false);
                setSem7(false);
                setSem8(false);
              }}
            >
              <h2>sem 5</h2>
            </button>
            <button
              className="text-white bg-blue-700 p-2 m-2 rounded-md roboto-regular"
              onClick={() => {
                setSem6(!sem6);
                setSem7(false);
                setSem3(false);
                setSem4(false);
                setSem5(false);
                setSem8(false);
              }}
            >
              <h2>sem 6</h2>
            </button>
            <button
              className="text-white bg-blue-700 p-2 m-2 rounded-md roboto-regular"
              onClick={() => {
                setSem7(!sem7);
                setSem8(false);
                setSem3(false);
                setSem4(false);
                setSem5(false);
                setSem6(false);
              }}
            >
              <h2>sem 7</h2>
            </button>
            <button
              className="text-white bg-blue-700 p-2 m-2 rounded-md roboto-regular"
              onClick={() => {
                setSem8(!sem8);
                setSem3(false);
                setSem4(false);
                setSem5(false);
                setSem6(false);
                setSem7(false);
              }}
            >
              <h2>sem 8</h2>
            </button>
          </div>
        </div>
        {/* END OF SEM SELECTION------------------------------------------------------ */}
        <div className=" flex flex-wrap justify-center flex-col container">
          <div className={`${sem3 ? "sem1calc container" : "semcalc"} `}>
            <Ecesem3r2020 />
          </div>
          <div className={`${sem4 ? "sem1calc container" : "semcalc"} `}>
            <Ecesem4r2020 />
          </div>
          <div className={`${sem5 ? "sem1calc container " : "semcalc"} `}>
            <Ecesem5r2020 />
          </div>
          <div className={`${sem6 ? "sem1calc container" : "semcalc"} `}>
            <Ecesem6r2020 />
          </div>
          <div className={`${sem7 ? "sem1calc container" : "semcalc"} `}>
            sem 7
          </div>
          <div className={`${sem8 ? "sem1calc container" : "semcalc"} `}>
            sem 8
          </div>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
};

export default Ecer2020home;
