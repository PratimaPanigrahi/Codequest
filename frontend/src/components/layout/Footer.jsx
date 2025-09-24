import React from "react";
import "./Footer.css";

const Footer = () => (
  <footer className="layout-footer">
    &copy; {new Date().getFullYear()} CodeQuest. All rights reserved.
  </footer>
);

export default Footer;
