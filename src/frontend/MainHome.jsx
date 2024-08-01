import React from "react";
import logoclg from "../assets/logoclg.png";
import "./Home.css";
import Footer from "./Footer";
import { Link } from "react-router-dom";

const MainHome = () => {
  // welcome screen
  return (
    <>
      <div>
        <div className="alameenbg">
          <div className="backdrop-blur-sm">
            <div
              className="w-auto md:w-auto flex items-center justify-center h-screen flex-wrap flex-col  "
              data-aos="fade-down"
              data-aos-duration="1000"
            >
              <img src={logoclg} alt="" className=" h-20 w-20  " />
              <h1 className=" roboto-bold text-4xl text-center  text-blue-950 ">
                AL-AMEEN ENGINEERING COLLEGE <br />
              </h1>
              <h2>(AUTONOMOUS)</h2>
            </div>
          </div>
        </div>
        <br />
        <div
          className="alameenbghome flex flex-wrap justify-end pr-4 roboto-regular"
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          <div>
            <div
              className="w-auto md:w-auto flex items-center text-blue-900 text-5xl  justify-center h-screen flex-wrap flex-col"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <h1 className=" text-5xl text-center font-semibold">
                REGISTER / LOGIN
              </h1>
              <br />
              <div
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-anchor-placement="center-bottom"
              >
                <div className="text-center text-3xl text-blue-900 font-mono font-extrabold  flex flex-wrap justify-center items-center">
                  LET'S{"  "}
                  {"  "}
                  BEGIN{" "}
                </div>
                <div className="items-center flex flex-wrap justify-center p-4 m-3  gap-2 text-lg">
                  <button
                    className=" bg-blue-800 rounded-md m-3 p-2 items-center text-white font-bold hover:scale-125"
                    data-aos="flip-left"
                    data-aos-duration="1000"
                  >
                    <Link to="/adminlogin">For Admin</Link>
                  </button>
                  <button
                    className=" bg-blue-800 rounded-md  m-4 p-2 items-center text-white font-bold"
                    data-aos="flip-up"
                    data-aos-duration="1000"
                  >
                    <Link to={"/facultyLogin"}>For Faculty</Link>
                  </button>
                  <button
                    className=" bg-blue-800 rounded-md  m-4 p-2 items-center text-white font-bold"
                    data-aos="flip-up"
                    data-aos-duration="1000"
                  >
                    <Link to={"/studentlogin"}>For Student</Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default MainHome;
