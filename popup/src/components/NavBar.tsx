import React from "react";

import icons from "../utils/_icons";
import "../styles/index.scss";

class NavBar extends React.Component<{
  changeTab: any;
  activeTab: "Users" | "Settings";
}> {
  constructor(props: { changeTab: any; activeTab: "Users" | "Settings" }) {
    super(props);
  }

  Tab(props: {
    tabName: string;
    isActive: boolean;
    title: string;
    Icon: JSX.Element;
    onClickMethod: Function;
  }) {
    return (
      <div
        onClick={() => {
          props.onClickMethod(props.tabName);
        }}
        className={props.isActive ? "Tab _active" : "Tab _unActive"}
        title={props.title}
      >
        <div className={`Tab-Item Tab-Item_${props.tabName}`}>
          <div className="Tab-Item_content_icon">{props.Icon}</div>
          <div className="Tab-Item_content_title">
            <h2>{props.title}</h2>
          </div>
        </div>
        <div className="Tab-Indicator"></div>
      </div>
    );
  }

  render(): React.ReactNode {
    return (
      <nav className="NavBar">
        <this.Tab
          tabName="Users"
          isActive={this.props.activeTab === "Users"}
          title="Пользователи"
          Icon={<icons.Users className="TabIcon" />} // TODO
          onClickMethod={() => this.props.changeTab("Users")}
        />
        <this.Tab
          tabName="Settings"
          isActive={this.props.activeTab === "Settings"}
          title="Настройки"
          Icon={<icons.Settings className="TabIcon" />} // TODO
          onClickMethod={() => this.props.changeTab("Settings")}
        />
      </nav>
    );
  }
}

export default NavBar;
