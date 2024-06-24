import React from "react";
import { Link } from "react-router-dom";

const Regulations = () => {
  return (
    <>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-anchor-placement="center-bottom"
      >
        <div className="text-center text-4xl text-black  flex flex-wrap justify-center items-center">
          FOR YOUR{"  "}
          {"  "}
          REGULATION{" "}
        </div>
        <div className="items-center flex flex-wrap justify-center p-4 m-3 flex-col gap-2 text-lg">
          <button
            className=" bg-blue-800 rounded-md m-3 p-2 items-center text-white font-bold hover:scale-125"
            data-aos="flip-left"
            data-aos-duration="1000"
          >
            <Link to={"/regulations2020"}>REGULATION-2020</Link>
          </button>
          <button
            className=" bg-blue-800 rounded-md  m-4 p-2 items-center text-white font-bold"
            data-aos="flip-up"
            data-aos-duration="1000"
          >
            <Link to={"/regulations2023"}>REGULATION-2023</Link>
          </button>
        </div>
      </div>
    </>
  );
};

export default Regulations;
