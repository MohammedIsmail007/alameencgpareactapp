import React from "react";

const Footer = () => {
  const year = new Date();
  return (
    <div className="text-center font-light font-sans">
      &copy;{year.getFullYear()} By Mohammed Ismail IV CSE{" "}
    </div>
  );
};

export default Footer;
