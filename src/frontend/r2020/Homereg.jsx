import React from "react";
import Footer from "../Footer";
import "./Homereg.css";
import { Link } from "react-router-dom";
import RegistrationFormModal from "../../../src/RegistrationFormNodal";

const Homereg = () => {
  return (
    <>
      <RegistrationFormModal />
      <div
        data-aos="fadeIn"
        data-aos-duration="1000"
        className="homereg flex flex-wrap justify-center content-center   m-9 p-9 gap-10 rounded-lg"
      >
        <div className="backdrop-blur-sm  rounded-md  flex flex-wrap justify-center">
          <div className="text-5xl p-3">
            <h1 className="text-center text-blue-800 roboto-bold">
              REGULATION 2020
            </h1>
          </div>
        </div>
        {/* departments */}
        <div
          className="flex flex-wrap justify-center  gap-12 rounded-lg backdrop-blur-sm p-6 w-full content-center"
          data-aos="fadeIn"
          data-aos-duration="1000"
        >
          <button className=" bg-blue-800 rounded-lg p-2 text-white  hover:scale-110 hover:transition hover:ease-linear">
            <Link to="/sandhhome">
              <h2>SCIENCE & HUMANITIES</h2>
            </Link>
          </button>

          <button className=" bg-blue-800 rounded-lg p-2 text-white  hover:scale-110 hover:transition hover:ease-linear">
            <Link to="/cser2020">
              <h2>COMPUTER SCIENCE & ENGINEERING</h2>
            </Link>
          </button>
          <button className=" bg-blue-800 rounded-lg p-2 text-white  hover:scale-110 hover:transition hover:ease-linear">
            <Link to="/itr2020">
              <h2>INFORMATION TECHNOLOGY</h2>
            </Link>
          </button>
          <button className=" bg-blue-800 rounded-lg p-3 text-white  hover:scale-110 hover:transition hover:ease-linear">
            <Link to="/aidsr2020">
              {" "}
              <h2>ARTIFICIAL INTELLIGENCE AND DATA SCIENCE</h2>
            </Link>
          </button>
          <button className=" bg-blue-800 rounded-lg p-3 text-white  hover:scale-110 hover:transition hover:ease-linear">
            <Link to="/eeer2020">
              <h2>ELECTRONICS & ELECTRICAL ENGINEERING</h2>
            </Link>
          </button>

          <button className=" bg-blue-800 rounded-lg p-3 text-white  hover:scale-110 hover:transition hover:ease-linear">
            <Link to="/civilr2020">
              <h2>CIVIL ENGINEERING</h2>
            </Link>
          </button>
          <button className=" bg-blue-800 rounded-lg p-3 text-white  hover:scale-110 hover:transition hover:ease-linear">
            <Link to="/mechr2020">
              {" "}
              <h2>MECHANICAL ENGINEERING</h2>
            </Link>
          </button>

          <button className=" bg-blue-800 rounded-lg p-3 text-white  hover:scale-110 hover:transition hover:ease-linear">
            <Link to="/ecer2020">
              <h2>ELECTRONICS & COMMUNICATION ENGINEERING</h2>
            </Link>
          </button>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default Homereg;
