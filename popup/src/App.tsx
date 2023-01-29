import React from "react";

import SettingsInterface from "./interfaces/settings.interface";

import Header from "./components/Header";
import NavBar from "./components/NavBar";
import Main from "./components/Main";
import Footer from "./components/Footer";

const settingsByDefault: SettingsInterface = {
  mode: "Simple",
  isBlurMode: false,
  isHideOnlyInChats: false,
  isAutoCensorship: false,
};

/**
 * @prop {"Users" | "Settings"} activeTab
 * Name of the active tab
 * @prop {SettingsInterface | null}    settings
 * Settings storage, loaded from chrome.storage.local
 *
 * @extends React.Component
 */
class App extends React.Component<
  {},
  {
    activeTab: "Users" | "Settings";
    settings?: SettingsInterface;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      activeTab: "Users",
    };

    this.changeTab = this.changeTab.bind(this);
  }

  /**
   * Init Settings. Get value from chrome.storage.local, or
   * set value by default
   */
  async init(): Promise<SettingsInterface> {
    let settings: SettingsInterface,
      settingsInChromeStorage: {
        [key: string]: any;
      } = await chrome.storage.local.get("settings");

    if (!settingsInChromeStorage) {
      settings = settingsByDefault;
      await chrome.storage.local.set({ settings: settings });
    } else {
      settings = {
        mode: settingsInChromeStorage.mode,
        isBlurMode: settingsInChromeStorage.inBlurMode,
        isHideOnlyInChats: settingsInChromeStorage.isHideOnlyInChats,
        isAutoCensorship: settingsInChromeStorage.isAutoCensorship,
      };
    }
    this.setState({ settings: settings });
    return settings;
  }

  /**
   * Change active tab in component state
   *
   * @param {"Users" | "Settings"} tabName
   * Name of tab, that was activated by the user
   */
  changeTab(tabName: "Users" | "Settings") {
    this.setState({
      activeTab: tabName,
    });
  }

  async componentDidMount(): Promise<void> {
    this.init();
  }

  async componentWillUnmount(): Promise<void> {
    if (this.state.settings) {
      let settings: SettingsInterface = {
        mode: this.state.settings.mode,
        isBlurMode: this.state.settings.isBlurMode,
        isHideOnlyInChats: this.state.settings.isHideOnlyInChats,
        isAutoCensorship: this.state.settings.isAutoCensorship,
      };
      await chrome.storage.local.set({ settings: settings });
    }
  }

  render(): React.ReactNode {
    return (
      <>
        <Header />

        <NavBar changeTab={this.changeTab} activeTab={this.state.activeTab} />

        <Main
          activeTab={this.state.activeTab}
          settings={
            this.state.settings ? this.state.settings : settingsByDefault
          }
        />

        <Footer />

        {/* <NavBar changeTab={this.changeTab} 
                activeTab={this.state.activeTab} />

        
        
        <Footer/> */}
      </>
    );
  }
}

export default App;
