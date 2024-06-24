import React, { useState } from "react";
import "./Sandh.css";
import Sem1sandh from "./Sem1sandh";

import Footer from "../../Footer";
import Sem2sandh from "./Sem2sandh";
import Eceeeesem2r2020 from "./Eceeeesem2r2020";
import Mechsem2r2020 from "./Mechsem2r2020";
import Civilsem2r2020 from "./Civilsem2r2020";

const Sandhhome = () => {
  const [sem1, setSem1] = useState(false);
  const [sem2, setSem2] = useState(false);
  const [cseaidsit, setCseaidsit] = useState(false);
  const [eceeee, setEceeee] = useState(false);
  const [mech, setMech] = useState(false);
  const [civil, setCivil] = useState(false);
  const [printaction, setPrintAction] = useState(false);

  return (
    <>
      <div className="container flex flex-wrap justify-center flex-col">
        <h1 className="font-extrabold text-center text-2xl roboto-regular p-2 m-2 flex flex-wrap justify-center">
          SELECT YOUR SEM TO CALCULATE YOUR CGPA
        </h1>
        <div className="flex flex-wrap justify-center m-5">
          <div
            className={`${
              printaction ? "printaction" : "rounded-lg p-2 m-2 justify-center"
            }`}
          >
            <button
              className="text-white bg-blue-700 p-2 m-2 rounded-md  roboto-regular"
              onClick={() => {
                setSem1(!sem1);
                setSem2(false);
              }}
            >
              <h2>sem 1</h2>
            </button>

            <button
              className="text-white bg-blue-700 p-2 m-2 rounded-md roboto-regular"
              onClick={() => {
                setSem2(!sem2);
                setSem1(false);
              }}
            >
              <h2>sem 2</h2>
            </button>
          </div>
        </div>
        {/* END OF SEM SELECTION------------------------------------------------------ */}
        <div className=" flex flex-wrap justify-center flex-col container">
          <div className={`${sem1 ? "sem1calc container" : "semcalc"} `}>
            <Sem1sandh />
          </div>
          <div className={`${sem2 ? "sem1calc container" : "semcalc"} `}>
            <div className="flex flex-wrap justify-center">
              <button
                className="text-white bg-blue-700 p-2 m-2 rounded-md  roboto-regular"
                onClick={() => {
                  setCseaidsit(!cseaidsit);
                  setEceeee(false);
                  setMech(false);
                  setCivil(false);
                }}
              >
                <h2>CSE / IT / AI&DS</h2>
              </button>
              <button
                className="text-white bg-blue-700 p-2 m-2 rounded-md  roboto-regular"
                onClick={() => {
                  setEceeee(!eceeee);
                  setCseaidsit(false);
                  setCivil(false);
                  setMech(false);
                }}
              >
                <h2>ECE / EEE</h2>
              </button>
              <button
                className="text-white bg-blue-700 p-2 m-2 rounded-md  roboto-regular"
                onClick={() => {
                  setMech(!mech);
                  setCivil(false);
                  setCseaidsit(false);
                  setEceeee(false);
                }}
              >
                <h2>MECHANICAL</h2>
              </button>
              <button
                className="text-white bg-blue-700 p-2 m-2 rounded-md  roboto-regular"
                onClick={() => {
                  setCivil(!civil);
                  setCseaidsit(false);
                  setEceeee(false);
                  setMech(false);
                }}
              >
                <h2>CIVIL</h2>
              </button>
            </div>
            <div className={`${cseaidsit ? "sem1calc container" : "semcalc"} `}>
              <Sem2sandh />
            </div>
            <div className={`${eceeee ? "sem1calc container" : "semcalc"} `}>
              <Eceeeesem2r2020 />
            </div>
            <div className={`${mech ? "sem1calc container" : "semcalc"} `}>
              <Mechsem2r2020 />
            </div>
            <div className={`${civil ? "sem1calc container" : "semcalc"} `}>
              <Civilsem2r2020 />
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default Sandhhome;
