import React from "react";

import icons from "../utils/_icons";
import "../styles/index.scss";

class Footer extends React.Component {
  render(): React.ReactNode {
    return (
      <footer className="Footer">
        <div className="Footer-Text">
          Сделано с любовью by <a href="t.me/eoricus">Eoricus</a>
        </div>
        <div className="Footer-Icon">
          <icons.CupOfCoffee className="Footer-IconButton"/>
        </div>
      </footer>
    );
  }
}

export default Footer;
