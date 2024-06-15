import React from "react";
import logoclg from "../assets/logoclg.png";

import Regulations from "./Regulations";
import Footer from "./Footer";

const Home = () => {
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
          className="alameenbg2 flex flex-wrap justify-end pr-4 roboto-regular"
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
                EASY TO CALCULATE YOUR CGPA
              </h1>
              <br />
              <Regulations />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Home;
