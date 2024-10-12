import { OptionType } from "../components/dropdowns/LabelWithDropdownIcons";
import { Icons } from "../components/icons/Icons";
import { ITab, ModeOption } from "../components/interfaces/global";
import React from "react"; // <-- Add this line

export const sidebarTabs: ITab[] = [
  {
    name: "Home",
    icon: <Icons.Home className="w-[1.4rem] h-[1.4rem]" />,
    activeIcon: (
      <Icons.ActiveHome className="w-[1.4rem] h-[1.4rem] text-primary" />
    ),
    // subTabs: [{
    //     name: 'Home',
    //     icon: <Icons.GridView className="h-6 w-6" />,
    // }]
  },
  {
    name: "Tasks",
    icon: <Icons.Tasks2 className="w-[1.4rem] h-[1.4rem]" />,
    activeIcon: (
      <Icons.ActiveTasks2 className="w-[1.4rem] h-[1.4rem] text-primary" />
    ),
  },
  {
    name: "Accounts",
    icon: <Icons.Accounts className="w-[1.4rem] h-[1.4rem]" />,
    activeIcon: (
      <Icons.ActiveAccounts className="w-[1.4rem] h-[1.4rem] text-primary" />
    ),
  },
  {
    name: "Wallets",
    icon: <Icons.Wallets className="w-[1.4rem] h-[1.4rem]" />,
    activeIcon: (
      <Icons.ActiveWallets className="w-[1.4rem] h-[1.4rem] text-primary" />
    ),
  },
  {
    name: "Proxies",
    icon: <Icons.Proxies className="w-[1.4rem] h-[1.4rem]" />,
    activeIcon: (
      <Icons.ActiveProxies className="w-[1.4rem] h-[1.4rem] text-primary" />
    ),
  },
  {
    name: "Settings",
    icon: <Icons.Settings className="w-[1.4rem] h-[1.4rem]" />,
    activeIcon: (
      <Icons.ActiveSettings className="w-[1.4rem] h-[1.4rem] text-primary" />
    ),
  },
];
export const cateogryOptions = ["Discord", "Twitter"];

export const ModesOptions: ModeOption[] = [
  {
    id: 1,
    label: "Airdrop Farming",
    value: "Airdrop Farming",
    icon: (
      <Icons.AidropFarming className="w-[1.25rem] h-[1.25rem] rounded-full text-white dark:text-default" />
    ),
    subTasks: [
      {
        id: 1.1,
        label: "Scroll",
        value: "Scroll",
        icon: <Icons.Scroll className="w-[1.25rem] h-[1.25rem] rounded-full" />,
      },
      {
        id: 1.2,
        label: "Zkysync Era",
        value: "ZkysyncEra",
        icon: <Icons.Era className="w-[1.25rem] h-[1.25rem] rounded-full" />,
      },
    ],
  },
  {
    id: 2,
    label: "Contract Minting",
    value: "Contract Minting",
    icon: (
      <Icons.Mint className="w-[1.25rem] h-[1.25rem]  rounded-full text-white dark:text-default" />
    ),
  },
  {
    id: 3,
    label: "Magiceden Sniper",
    value: "Magiceden Sniper",
    icon: (
      <Icons.Magiceden2 className="w-[1.25rem] h-[1.25rem]  rounded-full text-white dark:text-default" />
    ),
  },
  {
    id: 4,
    label: "Bidders",
    value: "Bidders",
    icon: (
      <Icons.Bidders className="w-[1.25rem] h-[1.25rem] rounded-full text-white dark:text-default" />
    ),
    subTasks: [
      {
        id: 4.1,
        label: "Blur",
        value: "Blur",
        icon: <Icons.Blur className="w-[1.25rem] h-[1.25rem] rounded-full" />,
      },
      {
        id: 4.2,
        label: "Tensor",
        value: "Tensor",
        icon: <Icons.Tensor className="w-[1.25rem] h-[1.25rem] rounded-full" />,
      },
      {
        id: 4.3,
        label: "Magiceden",
        value: "Magiceden Farmer",
        icon: (
          <Icons.MagicEden className="w-[1.25rem] h-[1.25rem] rounded-full" />
        ),
      },
      {
        id: 4.4,
        label: "Opensea Bidder",
        value: "Opensea Bidder",
        icon: (
          <Icons.OpenSeaBidder className="w-[1.25rem] h-[1.25rem] rounded-full" />
        ),
      },
    ],
  },
  {
    id: 5,
    label: "Socialify",
    value: "Socialify",
    icon: (
      <Icons.Socialify className="w-[1.25rem] h-[1.25rem] rounded-full text-white dark:text-default rotate-90" />
    ),
    subTasks: [
      {
        id: 5.1,
        label: "MultiFarm",
        value: "MultiFarm",
        icon: (
          <Icons.Multifarm className="w-[1.25rem] h-[1.25rem] rounded-full" />
        ),
      },
      {
        id: 5.2,
        label: "QBX",
        value: "QBX",
        icon: <Icons.QBX className="w-[1.25rem] h-[1.25rem] rounded-full" />,
      },
      {
        id: 5.3,
        label: "District One",
        value: "DistrictOne",
        icon: (
          <Icons.DistrictOne className="w-[1.25rem] h-[1.25rem] rounded-full" />
        ),
      },
    ],
  },
];

export const ModesOptionsTabs: ModeOption[] = [
  {
    id: 1,
    label: "Airdrop Farming",
    value: "Airdrop Farming",
    icon: (
      <Icons.AidropFarming className="w-[1.25rem] h-[1.25rem] rounded-full text-white dark:text-default" />
    ),
    subTasks: [
      {
        id: 1.1,
        label: "Scroll",
        value: "Scroll",
        icon: <Icons.Scroll className="w-[1.25rem] h-[1.25rem] rounded-full" />,
      },
      {
        id: 1.2,
        label: "Zkysync Era",
        value: "ZkysyncEra",
        icon: <Icons.Era className="w-[1.25rem] h-[1.25rem] rounded-full" />,
      },
    ],
  },
  // {
  //     id: 2,
  //     label: 'Contract Minting',
  //     value: 'Contract Minting',
  //     icon: <Icons.Mint className="w-[1.25rem] h-[1.25rem]  rounded-full" />,
  // },
  // {
  //     id: 3,
  //     label: 'Magiceden Sniper',
  //     value: 'Magiceden Sniper',
  //     icon: (
  //         <Icons.MagicEden className="w-[1.25rem] h-[1.25rem]  rounded-full" />
  //     ),
  // },
  {
    id: 4,
    label: "Bidders",
    value: "Bidders",
    icon: (
      <Icons.Bidders className="w-[1.25rem] h-[1.25rem] rounded-full text-white dark:text-default" />
    ),
    subTasks: [
      // {
      //     id: 4.1,
      //     label: 'Blur',
      //     value: 'Blur',
      //     icon: (
      //         <Icons.Blur className="w-[1.25rem] h-[1.25rem] rounded-full" />
      //     ),
      // },
      {
        id: 4.2,
        label: "Tensor",
        value: "Tensor",
        icon: <Icons.Tensor className="w-[1.25rem] h-[1.25rem] rounded-full" />,
      },
      {
        id: 4.3,
        label: "Magiceden",
        value: "Magiceden Farmer",
        icon: (
          <Icons.MagicEden className="w-[1.25rem] h-[1.25rem] rounded-full" />
        ),
      },
    ],
  },
  {
    id: 5,
    label: "Socialify",
    value: "Socialify",
    icon: (
      <Icons.Socialify className="w-[1.25rem] h-[1.25rem] rounded-full text-white dark:text-default rotate-90" />
    ),
    subTasks: [
      {
        id: 5.1,
        label: "MultiFarm",
        value: "MultiFarm",
        icon: (
          <Icons.Multifarm className="w-[1.25rem] h-[1.25rem] rounded-full" />
        ),
      },
      {
        id: 5.2,
        label: "QBX",
        value: "QBX",
        icon: <Icons.QBX className="w-[1.25rem] h-[1.25rem] rounded-full" />,
      },
    ],
  },
];

export const flowOptions = [
  "Swapping",
  "Bridging",
  "Minting",
  "Others",
  "Liquidity",
];
export const swapOptions = [
  "zksyncOfficial",
  "Layerswap",
  "Lifi",
  "cryptomaze",
  "Dmail",
  "velocoreSwap",
  "syncSwap",
  "muteSwap",
  "spacefiSwap",
  "vesyncSwap",
  "MuteSwapPool",
  "zksyncDomain",
  "Zkcodex",
  "zigZag",
];
export const bridgeOptions = [
  "zksyncOfficial",
  "Lifi",
  "Layerswap",
  "LayerswapLite",
];
export const mintingOptions = ["cryptomaze", "zksyncDomain", "Zkcodex"];
export const liquidityOptions = ["Mute"];
export const othersOptions = ["Dmail"];

export const gasOptions = ["Base", "Rapid", "Aggressive"];

export const keyConfig = [
  { key: "F1", code: "F1" },
  { key: "F2", code: "F2" },
  { key: "F3", code: "F3" },
  { key: "F4", code: "F4" },
  { key: "F5", code: "F5" },
  { key: "F6", code: "F6" },
];

export const animationVariants = {
  left: {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  right: {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  top: {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  bottom: {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  middle: {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  },
};

export const modeIcons: { [key: string]: JSX.Element } = {
  Scroll: <Icons.Scroll className="w-[1.25rem] h-[1.25rem] rounded-full" />,
  ZkysyncEra: <Icons.Era className="w-[1.25rem] h-[1.25rem] rounded-full" />,
  "Contract Minting": (
    <Icons.Mint className="w-[1.25rem] h-[1.25rem] rounded-full" />
  ),
  "Magiceden Sniper": (
    <Icons.MagicEden className="w-[1.25rem] h-[1.25rem] rounded-full" />
  ),
  Blur: <Icons.Blur className="w-[1.25rem] h-[1.25rem] rounded-full" />,
  Tensor: <Icons.Tensor className="w-[1.25rem] h-[1.25rem] rounded-full" />,
  "Magiceden Farmer": (
    <Icons.MagicEden className="w-[1.25rem] h-[1.25rem] rounded-full" />
  ),
  MultiFarm: (
    <Icons.Multifarm className="w-[1.25rem] h-[1.25rem] rounded-full" />
  ),
  QBX: <Icons.QBX className="w-[1.25rem] h-[1.25rem] rounded-full" />,
  DistrictOne: (
    <Icons.DistrictOne className="w-[1.25rem] h-[1.25rem] rounded-full" />
  ),
};

// export const modeOptions = [
//     'Scroll',
//     'ZkysyncEra',
//     'Contract Minting',
//     'Magiceden Sniper',
//     'Blur',
//     'Tensor',
//     'Magiceden Farmer',
//     'MultiFarm',
//     'QBX',
//     'DistrictOne',
// ];

export const modeOptions: OptionType[] = [
  {
    label: "Scroll",
    icon: <Icons.Scroll className="w-[1.25rem] h-[1.25rem] rounded-full" />,
  },
  {
    label: "ZkysyncEra",
    icon: <Icons.Era className="w-[1.25rem] h-[1.25rem] rounded-full" />,
  },
  {
    label: "Contract Minting",
    icon: <Icons.Mint className="w-[1.25rem] h-[1.25rem] rounded-full" />,
  },
  {
    label: "Magiceden Sniper",
    icon: <Icons.MagicEden className="w-[1.25rem] h-[1.25rem] rounded-full" />,
  },
  {
    label: "Blur",
    icon: <Icons.Blur className="w-[1.25rem] h-[1.25rem] rounded-full" />,
  },
  {
    label: "Tensor",
    icon: <Icons.Tensor className="w-[1.25rem] h-[1.25rem] rounded-full" />,
  },
  {
    label: "Magiceden Farmer",
    icon: <Icons.MagicEden className="w-[1.25rem] h-[1.25rem] rounded-full" />,
  },
  {
    label: "MultiFarm",
    icon: <Icons.Multifarm className="w-[1.25rem] h-[1.25rem] rounded-full" />,
  },
  {
    label: "DistrictOne",
    icon: (
      <Icons.DistrictOne className="w-[1.25rem] h-[1.25rem] rounded-full" />
    ),
  },
  {
    label: "QBX",
    icon: <Icons.QBX className="w-[1.25rem] h-[1.25rem] rounded-full" />,
  },
  {
    label: "Opensea Bidder",
    icon: (
      <Icons.OpenSeaBidder className="w-[1.25rem] h-[1.25rem] rounded-full" />
    ),
  },
];

export const modeOptionsAccount: OptionType[] = [
  {
    label: "Twitter",
    icon: (
      <Icons.Twitter className="w-[1.25rem] h-[1.25rem] rounded-full text-default dark:text-white" />
    ),
  },
  {
    label: "Discord",
    icon: <Icons.Discord className="w-[1.25rem] h-[1.25rem] rounded-full" />,
  },
  {
    label: "link",
    icon: (
      <Icons.Connect className="w-[1.25rem] h-[1.25rem] rounded-full text-default dark:text-white" />
    ),
  },
  {
    label: "link-twitter-to-wallet",
    icon: (
      <Icons.Connect className="w-[1.25rem] h-[1.25rem] rounded-full text-default dark:text-white" />
    ),
  },
  {
    label: "link-twitter-to-discord",
    icon: (
      <Icons.Connect className="w-[1.25rem] h-[1.25rem] rounded-full text-default dark:text-white" />
    ),
  },
  {
    label: "link-discord-to-wallet",
    icon: (
      <Icons.Connect className="w-[1.25rem] h-[1.25rem] rounded-full text-default dark:text-white" />
    ),
  },
  {
    label: "link-discord-to-twitter",
    icon: (
      <Icons.Connect className="w-[1.25rem] h-[1.25rem] rounded-full text-default dark:text-white" />
    ),
  },
];
