import React from "react";
import ReactDOM from "react-dom/client";
import icons from "../utils/_icons";
import "../styles/index.scss";

class Header extends React.Component {
  constructor(props: any) {
    super(props);
  }

  render(): React.ReactNode {
    return (
      <header className="Header">
        <div className="Header-Name">
          <icons.Favicon className="Header-Favicon" title="muteVK"/>
          <div className="Header-Tittle">
            <h1>muteVK</h1>
          </div>
        </div>

        <div className="Header-Options">
          
          <icons.Message className="Header-Icon" title="Отправить пожелания"/>
          <icons.Palette className="Header-Icon" title="Тема приложения"/>
        </div>
      </header>
    );
  }
}

export default Header;
