import React, { FC, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icons } from "../icons/Icons";
import {
  cn,
  fetchUserGuilds,
  fetchUserProfile,
  fetchUserRolesInGuild,
  getAvatarUrl,
} from "../../lib/utils";
import { sidebarTabs } from "../../lib/globalVariables";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { SiSolana } from "react-icons/si";
import { MdLogin, MdLogout } from "react-icons/md";
import logoGif from "../../assets/gifs/The-Trident-Kit----Logo--emblem.jpg";
import fullLogoGif from "../../assets/gifs/The-Trident-Kit----Logo-01-copy.jpg";
import DeleteModal from "../modals/DeleteModal";
import ButtonTabs from "../custom/ButtonTabs";
import fullLogoGifTransparent from "../../assets/gifs/The-Trident-Kit----Logo---transparent.jpg";
import logoGifTransparent from "../../assets/gifs/The-Trident-Kit-emblem-transparent.jpg";
import SidebarTab from "./SidebarTab";
import useLocalStorageManager from "../../hooks/useLocalStorageManager";
import useFetchV2 from "../../hooks/useFetchV2";
import { useTheme } from "../../hooks/ThemeContext";
import { FaRegUserCircle } from "react-icons/fa";

interface IProps {
  onCallback: (value: boolean) => void;
  onActiveTabChange: (activeTab: string) => void;
  setIsOpen: any;
  isOpen: boolean;
  disableTabs: boolean;
  checkUnlockApp: any;
  isTourOpen: boolean;
  isReady: boolean;
  activeTabMain: string;
  unlockApp: boolean;
}
interface Prices {
  [key: string]: { USD: number };
}

interface PriceTrends {
  [key: string]: boolean;
}

interface PricesResponse {
  prices: Prices;
  priceTrends: PriceTrends;
}

interface DiscordUserProfile {
  accent_color?: number; // The accent color can be undefined (optional)
  avatar: string | null; // Avatar hash or null if not set
  avatar_decoration_data: any | null; // The type is unknown; it could be any, but is null for now
  banner: string | null; // Banner image URL or null if not set
  banner_color: string | null; // Banner color as a hex string or null
  clan: string | null; // Clan or null if not set
  discriminator: string; // The user discriminator (usually a 4-digit string)
  flags: number; // User flags as a number
  global_name: string; // Global display name for the user
  id: string; // The user's unique ID
  locale: string; // Locale setting for the user
  mfa_enabled: boolean; // Whether the user has multi-factor authentication enabled
  premium_type: number; // Type of Nitro subscription, 0 if none
  public_flags: number; // Public flags as a number
  username: string; // The username of the user
}

interface OAuthTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

const Sidebar: FC<IProps> = ({
  onCallback,
  onActiveTabChange,
  setIsOpen,
  isOpen,
  disableTabs,
  checkUnlockApp,
  isTourOpen,
  isReady,
  activeTabMain,
  unlockApp,
}) => {
  type SignInResponse = OAuthTokenResponse | "close-window";
  const [isModalLogoutOpen, setIsModalLogoutOpen] = useState<boolean>(false);
  const manageLocalStorage = useLocalStorageManager<any>();
  const storedData = manageLocalStorage("get", "userSignInData");
  const isUser = storedData && storedData.length > 0;
  const [isSigningIn, setIsSigningIn] = useState(false);
  const isMac = window.navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const { data } = useFetchV2<PricesResponse>("get-prices");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [openTab, setOpenTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(
    disableTabs ? "Settings" : activeTabMain
  );
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null);
  const { isDarkMode } = useTheme();
  const prices = data?.prices || {};
  const priceTrends = data?.priceTrends || {};

  const handleToggleTab = (tabName: string, subTabs: any[] | undefined) => {
    const isSameTab = openTab === tabName;
    setOpenTab(isSameTab ? null : tabName);
    setActiveTab(tabName);
    setActiveSubTab(subTabs?.[0]?.name || null);
    onActiveTabChange(subTabs?.[0]?.name || tabName);
  };

  const handleToggleSidebar = (shouldCollapse = !isCollapsed) => {
    setIsCollapsed(shouldCollapse);
    if (shouldCollapse) {
      setOpenTab(null);
      setActiveSubTab(null);
    }
  };

  const getCoinIcon = (coin: string) => {
    switch (coin) {
      case "BTC":
        return <FaBitcoin />;
      case "ETH":
        return <FaEthereum />;
      case "SOL":
        return <SiSolana />;
      default:
        return null;
    }
  };

  const getTrendIcon = (isIncreasing: boolean) => {
    return isIncreasing ? (
      <Icons.ArrowTop className="text-[#234c38]" />
    ) : (
      <Icons.ArrowBottom className="text-[#592826]" />
    );
  };

  useEffect(() => {
    if (isCollapsed) {
      setOpenTab(null);
      setActiveSubTab(null);
    }
  }, [isCollapsed]);

  useEffect(() => {
    if (activeTabMain) {
      setActiveTab(activeTabMain);
    }
  }, [activeTabMain]);

  return (
    <motion.div
      className={cn(
        `h-screen bg-lightSidebarColor dark:bg-backgroundApp  text-whiteColor relative flex flex-col z-30 border-r-[1px] border-borderAppLight dark:border-borders shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-[20px] `
      )}
      animate={{ width: isCollapsed ? "120px" : "250px" }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => {
          if (!isTourOpen) {
            handleToggleSidebar();
            onCallback(isCollapsed);
          }
        }}
        className={cn(
          "absolute z-40 top-[50%] w-fit rounded-full h-fit p-1.5 bg-white dark:bg-[#2b2b2d] -right-4 border-borderLight border dark:border-none  shadow-[0_4px_30px_rgba(0,0,0,0.1)] ",
          // isCollapsed ? '-right-6' : '-right-7',
          !unlockApp && "blur-none "
        )}
      >
        {/* {isCollapsed ? <Icons.SidebarToggleRight /> : <Icons.SidebarToggleLeft />} */}
        {!isCollapsed ? (
          <Icons.ChevronDown className="w-5 h-5 rotate-90 text-darkBlue  dark:text-primary" />
        ) : (
          <Icons.ChevronDown className="w-5 h-5 -rotate-90 text-darkBlue  dark:text-primary " />
        )}
      </button>
      <div className="w-full h-full flex flex-col items-start justify-between pb-5">
        <div
          className={cn(
            `w-full max-h-screen scrollbar-hide`,
            !unlockApp && "blur-none "
          )}
        >
          <div
            className={cn(
              `flex items-center justify-center px-6 w-full text-center`,
              isCollapsed ? "py-3" : "py-[1.4rem]"
            )}
          >
            {isCollapsed ? (
              <div className="w-auto h-auto relative">
                <img
                  src={!isDarkMode ? logoGifTransparent : logoGif}
                  alt="logo"
                  className="w-auto h-auto"
                />
              </div>
            ) : (
              <div className="w-auto h-auto relative">
                <img
                  src={!isDarkMode ? fullLogoGifTransparent : fullLogoGif}
                  alt="logo"
                  className="w-auto h-auto"
                />
              </div>
            )}
          </div>
          <div className="w-full flex flex-col items-start gap-4">
            <div className="w-full h-[1px] bg-buttonLightMode  dark:bg-borders" />
            <nav className="w-full flex flex-col items-center gap-1">
              {sidebarTabs.map((tab) => (
                <SidebarTab
                  key={tab.name}
                  tab={tab}
                  activeTab={activeTab}
                  isCollapsed={isCollapsed}
                  isTourOpen={isTourOpen}
                  isMac={isMac}
                  openTab={openTab}
                  disableTabs={disableTabs}
                  handleToggleTab={handleToggleTab}
                  setActiveSubTab={setActiveSubTab}
                  onActiveTabChange={onActiveTabChange}
                  activeSubTab={activeSubTab}
                />
              ))}
            </nav>
          </div>
        </div>
        <div className="w-full px-6">
          <div className="w-full flex flex-col items-start gap-3">
            {!isCollapsed && Object.keys(prices).length > 0 ? (
              <div
                className={cn(
                  `w-full border border-white dark:border-[#2a2c2e] rounded-sm p-2 flex flex-col items-center justify-center bg-[#fff] dark:bg-[#232323] shadow-[0_4px_30px_rgba(0,0,0,0.1)]`,
                  !unlockApp && "blur-none "
                )}
              >
                {Object.keys(prices).map((coin, index) => (
                  <div
                    key={coin}
                    className={`w-full flex items-center justify-between py-2 ${
                      index !== Object.keys(prices).length - 1
                        ? "border-b-[1px] border-borderLight dark:border-[#2a2c2e]"
                        : ""
                    }`}
                  >
                    <div className="flex gap-2 items-center">
                      {getCoinIcon(coin)}
                      <span className="text-default dark:text-[#e3e3e3] text-xs-plus">
                        {coin}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-default dark:text-[#777777] text-xs-plus">
                        {prices[coin]?.USD !== undefined
                          ? `$${prices[coin].USD.toFixed(2)}`
                          : "N/A"}
                      </span>
                      {getTrendIcon(priceTrends[coin])}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              Object.keys(prices).length > 0 && (
                <div
                  className={cn(
                    `w-full border border-white dark:border-[#2a2c2e] rounded-sm p-2 flex flex-col items-center justify-center bg-[#fff] dark:bg-[#232323] shadow-[0_4px_30px_rgba(0,0,0,0.1)]`,
                    !unlockApp && "blur-none "
                  )}
                >
                  {Object.keys(prices).map((coin, index) => (
                    <div
                      key={coin}
                      className={`w-full flex items-center justify-between py-2 ${
                        index !== Object.keys(prices).length - 1
                          ? "border-b-[1px] border-borderLight dark:border-[#2a2c2e]"
                          : ""
                      }`}
                    >
                      <div className="flex gap-2 items-center">
                        {getCoinIcon(coin)}
                      </div>
                      <div className="flex gap-2 items-center">
                        {getTrendIcon(priceTrends[coin])}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
            {!isCollapsed ? (
              <button
                disabled={disableTabs}
                onClick={() => {
                  setIsModalLogoutOpen(true);
                }}
                className="shadow-[0_4px_30px_rgba(0,0,0,0.1)] bg-white dark:bg-transparent w-full border border-borderLight dark:border-[#2a2c2e] rounded-sm p-2 group flex items-center justify-between hover:text-red hover:border-red dark:hover:border-darkRed transform transition duration-500"
              >
                <div className="flex items-center gap-2">
                  <div className="relative w-5 h-5">
                    <FaRegUserCircle className="w-5 h-5" />
                  </div>
                  <span className="text-xs-plus font-normal text-default dark:text-whiteColor group-hover:text-red transform transition duration-500">
                    User
                  </span>
                </div>

                <MdLogout />
              </button>
            ) : (
              <button
                disabled={disableTabs}
                onClick={() => {
                  setIsModalLogoutOpen(true);
                }}
                className="shadow-[0_4px_30px_rgba(0,0,0,0.1)] bg-white dark:bg-transparent w-full cursor-pointer border group border-borderLight dark:border-[#2a2c2e] rounded-sm p-2 flex items-center justify-center hover:text-red hover:border-red dark:hover:border-darkRed transform transition duration-500"
              >
                <MdLogout className="w-[1.2rem] h-[1.2rem]" />
              </button>
            )}
          </div>
        </div>
      </div>
      {isModalLogoutOpen && (
        <DeleteModal
          slug={undefined}
          callback={() => {
            setIsModalLogoutOpen(false);
          }}
          onClose={() => {
            setIsModalLogoutOpen(false);
          }}
          title={"Are you sure you want to Logout!!"}
        />
      )}
    </motion.div>
  );
};

export default Sidebar;
