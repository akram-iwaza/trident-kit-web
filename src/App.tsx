import "./App.css";
import {
  cn,
  fetchUserGuilds,
  fetchUserRolesInGuild,
  loginStep,
  allSteps,
  refreshDiscordAccessToken,
} from "./lib/utils";
import React, { useEffect, useState, useCallback } from "react";
import MainDashboard from "./components/tabsComponent/dashboard/MainDashboard";
import MainSettings from "./components/tabsComponent/settings/MainSettings";
import MainTasks from "./components/tabsComponent/tasks/MainTasks";
import Sidebar from "./components/sidebar/Sidebar";
import MainWallets from "./components/tabsComponent/wallets/MainWallets";
import MainProxies from "./components/tabsComponent/proxies/MainProxies";
import HeaderComponent from "./components/custom/HeaderComponent";
import MainAccounts from "./components/tabsComponent/accounts/MainAccounts";
import useLocalStorageManager from "./hooks/useLocalStorageManager";
import { CallBackProps, STATUS } from "react-joyride";
import JoyrideComponent from "./components/ui/JoyrideComponent";
import { toast } from "./components/ui/use-toast";
import { useTheme } from "./hooks/ThemeContext";
export type TabName =
  | "Home"
  | "Tasks"
  | "Accounts"
  | "Wallets"
  | "Proxies"
  | "Settings";

interface ApiConfiguration {
  KEY: string;
  accessToBot?: boolean;
  firstTime?: boolean;
  access_token: string;
  refresh_token: string;
}

export default function App() {
  const window: any = "";
  const RemoteSettings: any = "";
  const [isReady, setIsReady] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGroupTab, setSelectedGroupTab] = useState("");
  const [activeTab, setActiveTab] = useState<TabName>("Home");
  const [unlockApp, setUnlockApp] = useState(true);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [returnedValueGroups, setReturnedValueGroups] = useState<any>(null);
  const [searchedValue, setSearchedValue] = useState<string>("");
  const [clearValue, setClearValue] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const manageLocalStorage = useLocalStorageManager<any>();
  const myLicense =
    RemoteSettings.appPath &&
    window.fs.readFileSync(
      RemoteSettings.appPath +
        `${window.path.pathSepration()}TaskConfigs${window.path.pathSepration()}myLicense.json`
    );
  const myLicenseData: ApiConfiguration = myLicense && JSON.parse(myLicense);

  const isAccountTab = activeTab === "Accounts";
  const isDashboardTab = activeTab === "Home";
  const isSettingsTab = activeTab === "Settings";
  const isSettingsAndDashboard = isDashboardTab || isSettingsTab;
  const checkUnlockApp = async (firstTime?: boolean) => {
    try {
      const licensePath = `${
        RemoteSettings.appPath
      }${window.path.pathSepration()}TaskConfigs${window.path.pathSepration()}myLicense.json`;
      const myLicense =
        RemoteSettings.appPath && window.fs.readFileSync(licensePath);
      const myLicenseData: ApiConfiguration =
        myLicense && JSON.parse(myLicense);

      if (!myLicenseData) {
        console.log("No license data found");
        setUnlockApp(true);
        manageLocalStorage("remove", "userSignInData");
        setActiveTab("Settings");
        return;
      }

      if (firstTime) {
        // Directly check the license data without refreshing the token
        const unlockAppValue = !!(
          myLicenseData &&
          myLicenseData.KEY &&
          myLicenseData.accessToBot === true
        );
        setUnlockApp(unlockAppValue);
        if (!unlockAppValue) {
          manageLocalStorage("remove", "userSignInData");
          toast({
            variant: "destructive",
            title: "Authentication Failed",
            description:
              "User does not have the required role in the Trident Kit guild.",
          });
        } else {
          toast({
            variant: "success",
            title: "Authentication Successful",
            description: "User has the required role in the Trident Kit guild.",
          });
        }
        return;
      }

      // If not the first time, proceed with refreshing the token and checking roles
      const refreshToken = myLicenseData.refresh_token;
      const tokenData = await refreshDiscordAccessToken(refreshToken);

      if (!tokenData) {
        console.log("Failed to refresh token");
        setUnlockApp(true);
        manageLocalStorage("remove", "userSignInData");
        setActiveTab("Settings");
        return;
      }

      const { access_token, refresh_token: newRefreshToken } = tokenData;

      // Fetch user's guilds
      const guilds = await fetchUserGuilds(access_token);
      if (!guilds) {
        console.log("Failed to fetch user guilds");
        setUnlockApp(true);
        manageLocalStorage("remove", "userSignInData");
        setActiveTab("Settings");
        return;
      }

      // Check if user has access to the Trident Kit guild
      const tridentKitGuild = guilds.find(
        (guild: { name: string }) => guild.name === "Trident Kit"
      );
      if (!tridentKitGuild) {
        setUnlockApp(true);
        manageLocalStorage("remove", "userSignInData");
        setActiveTab("Settings");
        return;
      }

      // Fetch user roles in the guild
      const accessToBot = await fetchUserRolesInGuild(
        tridentKitGuild.id,
        access_token
      );
      const canPass = accessToBot?.hasRole ?? false;
      const roleText = accessToBot?.roleText ?? "";

      // Unlock app if conditions are met
      // if (canPass) {
      //   setUnlockApp(true);
      //   window.electron.ipcRenderer.sendMessage("checking-sign-in", {
      //     accessToBot: canPass,
      //     access_token: access_token,
      //     refresh_token: newRefreshToken,
      //     KEY: roleText,
      //   });
      // } else {
      //   toast({
      //     variant: "destructive",
      //     title: "Authentication Failed",
      //     description:
      //       "User does not have the required role in the Trident Kit guild.",
      //   });
      //   setUnlockApp(false);
      //   window.electron.ipcRenderer.sendMessage("checking-sign-in", {
      //     accessToBot: false,
      //   });
      //   manageLocalStorage("remove", "userSignInData");
      //   setActiveTab("Settings");
      // }
    } catch (error) {
      console.log("Error during app unlock check:", error);
      setUnlockApp(true);
      setActiveTab("Settings");
    }
  };

  const extractAccountNames = (groups: any[]) => {
    const allAccountNames: any[] = [];

    if (Array.isArray(groups)) {
      groups.forEach((group: { myGroupAccounts: any[] }) => {
        if (group && Array.isArray(group.myGroupAccounts)) {
          group.myGroupAccounts.forEach((account: { accountName: any }) => {
            if (account && account.accountName) {
              allAccountNames.push(account.accountName);
            }
          });
        }
      });
    }

    return allAccountNames;
  };

  const accountNameOptions = extractAccountNames(returnedValueGroups ?? []);

  const clearSearchInput = () => {
    setSearchedValue("");
    setValue("");
    setClearValue(true);
  };

  const handleTabChange = (tab: TabName) => {
    if (unlockApp) {
      setActiveTab(tab);
    }
    handleClear();
  };

  const getActiveTabComponent = useCallback(() => {
    const tabComponents: Record<TabName, JSX.Element> = {
      Home: <MainDashboard isOpen={isOpen} isReady={isReady} />,
      Tasks: (
        <MainTasks
          isOpen={isOpen}
          onReturnValue={handleReturnedValue}
          searchedValue={searchedValue}
          isReady={isReady}
          setSelectedGroupTab={setSelectedGroupTab}
        />
      ),
      Accounts: (
        <MainAccounts
          clearSearchInput={clearSearchInput}
          isOpen={isOpen}
          isAccountTab={isAccountTab}
          isReady={isReady}
          searchedValue={searchedValue}
          onReturnValue={handleReturnedValue}
          clearValue={clearValue}
          setClearValue={setClearValue}
        />
      ),
      Wallets: (
        <MainWallets
          isOpen={isOpen}
          onReturnValue={handleReturnedValue}
          searchedValue={searchedValue}
          isReady={isReady}
        />
      ),
      Proxies: (
        <MainProxies
          isOpen={isOpen}
          onReturnValue={handleReturnedValue}
          searchedValue={searchedValue}
          isReady={isReady}
        />
      ),
      Settings: (
        <MainSettings
          isOpen={isOpen}
          unlockApp={unlockApp}
          checkUnlockApp={checkUnlockApp}
          getUserData={getUserData}
          isReady={isReady}
        />
      ),
    };
    return tabComponents[activeTab];
  }, [activeTab, isOpen, isAccountTab, searchedValue, unlockApp, isReady]);

  const getTitleForActiveTab = useCallback(() => {
    const tabTitles: Record<TabName, string> = {
      Home: "Home",
      Tasks: "Tasks",
      Accounts: "Accounts",
      Wallets: "Wallets",
      Proxies: "Proxies",
      Settings: "Settings",
    };
    return tabTitles[activeTab];
  }, [activeTab]);

  const handleReturnedValue = (value: any) => {
    setReturnedValueGroups(value);
  };

  const getUserData = async () => {
    try {
      const storeDataUnformatted: any = "";
      // await window.electron.ipcRenderer.invoke("user-data"); // Await the promise
      // manageLocalStorage("add", "userSignInData", storeDataUnformatted);
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

  const [isFirstStepDone, setIsFirstStepDone] = useState(false);

  const handleTourCallback = (data: CallBackProps) => {
    const { status, action, index } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    // Close the tour when finished or skipped
    if (finishedStatuses.includes(status)) {
      setIsTourOpen(false);
    }

    // Handle first step specifically
    if (status === "finished" && index === 0) {
      setIsFirstStepDone(true); // Mark the first step as done
      setIsTourOpen(false); // Close the tour after the first step
      return;
    }

    // Handle tab switching based on the tour step index
    const tabMap: Record<number, TabName> = {
      1: "Tasks", // Index 1 corresponds to "Tasks" tab
      9: "Accounts", // Index 9 corresponds to "Accounts" tab
      15: "Wallets", // Index 15 corresponds to "Wallets" tab
      23: "Proxies", // Index 23 corresponds to "Proxies" tab
      26: "Settings", // Index 26 corresponds to "Settings" tab
    };

    // If the action is 'next', switch to the corresponding tab
    if (action === "next") {
      const selectedTab: TabName | undefined = tabMap[index];
      if (selectedTab) {
        console.log(`Switching to ${selectedTab} tab.`);
        setActiveTab(selectedTab);
      }
    }

    // Send a message when the tour is finished or skipped
    if (finishedStatuses.includes(status) && isFirstStepDone) {
      // window.electron.ipcRenderer.sendMessage("finishTouring", true);
    }
  };

  const [steps, setSteps] = useState<any>([]);
  const startTour = (initialSteps: any) => {
    setSteps(initialSteps); // Set the steps to display
    setIsTourOpen(true); // Open the tour
  };

  // useEffect(() => {
  //   getUserData();
  // }, [isReady]);

  const handleClear = () => {
    setSearchedValue("");
    setValue("");
  };

  const { isDarkMode } = useTheme();

  useEffect(() => {
    const body = document.body;
    if (!isDarkMode) {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  // if (!isReady) {
  //     return (
  //         <div className='w-full bg-backgroundApp  flex items-center justify-center h-screen'>
  //             <div className='w-auto h-auto relative'>
  //                 <img
  //                     src={fullLogoGif}
  //                     alt='logo'
  //                     className='w-auto h-auto'
  //                 />
  //             </div>
  //         </div>
  //     )

  return (
    <div
      className={cn(
        `h-screen w-[100%] max-w-[100%] bg-lightBackgroundColor dark:bg-backgroundApp flex items-start font-sans overflow-x-hidden`
      )}
    >
      <JoyrideComponent
        handleTourCallback={handleTourCallback}
        isTourOpen={isTourOpen}
        steps={steps}
      />
      <div
        className={cn(
          `h-screen max-h-screen`,
          isOpen ? "w-[250px]" : "w-[120px]"
        )}
      >
        <Sidebar
          onCallback={setIsOpen}
          onActiveTabChange={(tab: any) => handleTabChange(tab)}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          checkUnlockApp={checkUnlockApp}
          disableTabs={!unlockApp}
          isTourOpen={isTourOpen}
          unlockApp={unlockApp}
          isReady={isReady}
          activeTabMain={activeTab}
        />
      </div>
      <div
        // className='w-full overflow-hidden'
        className={cn(
          `max-h-screen w-full`,
          isOpen ? "w-full" : "w-full",
          isDashboardTab && "overflow-y-auto scrollbar-hide"
        )}
      >
        <HeaderComponent
          value={value}
          setValue={setValue}
          titleActiveTabValue={getTitleForActiveTab()}
          groups={returnedValueGroups ?? []}
          setSearchedValue={setSearchedValue}
          clearSearchInput={clearSearchInput}
          accountNameOptions={accountNameOptions ?? []}
          isDashboardTab={isDashboardTab}
          unlockApp={unlockApp}
          isSettingsTab={isSettingsTab}
          activeTabMain={selectedGroupTab}
          isSettingsAndDashboard={isSettingsAndDashboard}
        />
        {getActiveTabComponent()}
      </div>
    </div>
  );
}
