import React from "react";

const Footer = () => {
  const year = new Date();
  return (
    <div className="text-center font-light font-sans">
      &copy; By Mohammed Ismail III CSE {year.getFullYear()}{" "}
    </div>
  );
};

export default Footer;
