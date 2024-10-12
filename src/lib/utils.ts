import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface User {
  accent_color: number | null;
  avatar: string | null;
  avatar_decoration_data: any | null; // 'any' since it's unclear what type it is; replace it if you know the type
  banner: string | null;
  banner_color: string | null;
  clan: string | null;
  discriminator: string;
  flags: number;
  global_name: string | null;
  id: string;
  public_flags: number;
  username: string;
}
interface MemberData {
  avatar: string | null;
  banner: string | null;
  bio: string;
  communication_disabled_until: string | null;
  deaf: boolean;
  flags: number;
  joined_at: string;
  mute: boolean;
  nick: string | null;
  pending: boolean;
  premium_since: string | null;
  roles: string[]; // Array of role IDs as strings
  unusual_dm_activity_until: string | null;
  user: User; // Reference to the nested 'user' interface
}

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (
    !/^\d$/.test(e.key) &&
    e.key !== "Backspace" &&
    e.key !== "Delete" &&
    e.key !== "ArrowLeft" &&
    e.key !== "ArrowRight"
  ) {
    e.preventDefault();
  }
};
export const checkIfValidProxyFormat = (proxy: string): boolean => {
  if (!proxy) return false;

  const proxyParts = proxy.split(":");
  if (proxyParts.length !== 4) return false;

  return true;
};

export const getRandomNumber = (
  min: number,
  max: number,
  shouldUseFloat: boolean = true
): number => {
  const range = max - min;
  const randomValue = Math.random() * range + min;

  return shouldUseFloat ? Math.floor(randomValue) : randomValue;
};

export const getStepContent = (tabName: string) => {
  switch (tabName) {
    case "Home":
      return "Welcome to the Home tab. Here, you can access an overview of your dashboard, including key metrics and recent activity to keep you up to date with your performance.";
    case "Settings":
      return "The Settings tab allows you to customize and manage all your preferences, configurations, and application settings for a personalized experience.";
    case "Tasks":
      return "In the Tasks tab, you can manage and organize your tasks efficiently. Create, edit, and prioritize tasks to stay productive and on track.";
    case "Accounts":
      return "The Accounts tab provides tools to manage user accounts, including adding new users, updating profiles, and managing roles and permissions.";
    case "Wallets":
      return "In the Wallets tab, you can securely manage your cryptocurrency wallets, track balances, and monitor transactions for all connected accounts.";
    case "Proxies":
      return "The Proxies tab enables you to manage proxy settings and configurations, helping you navigate securely and privately through various networks.";
    default:
      return `This is the ${tabName} tab. Here, you can find various tools and features to enhance your workflow. Click Next to continue.`;
  }
};

export const loginStep: any = [
  {
    target: `#login-button`, // Step targeting the login button
    content: "All bot features will be disabled until you log in.",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
];

export const allSteps: any = [
  {
    target: `#sidebar-tab-home`, // Step targeting the Home tab
    content: getStepContent("Home"),
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: `#sidebar-tab-tasks`, // Step targeting the Tasks tab
    content: getStepContent("Tasks"),
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: "#main-task-step-1", // Unique ID for the element inside MainDashboard you want to target
    content:
      "To get started, create groups to categorize your tasks effectively. Groups help you organize and manage multiple tasks based on different criteria, such as project type or priority",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: "#main-task-step-2", // Unique ID for the element inside MainDashboard you want to target
    content:
      "Next, create individual tasks within the selected group. Define task details, assign priorities, and set deadlines to keep everything on track.",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: "#main-task-step-3", // Unique ID for the element inside MainDashboard you want to target
    content:
      "Specify the number of threads to run concurrently. This controls how many tasks will start at the same time, optimizing performance based on your system's capabilities.",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: "#main-task-step-4", // Unique ID for the element inside MainDashboard you want to target
    content:
      "Set the sleep time between thread starts to manage the delay before starting the next batch of tasks. This helps balance the workload and prevents system overload.",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: "#main-task-step-5", // Unique ID for the element inside MainDashboard you want to target
    content:
      "Choose the appropriate category module to define the context and parameters for your tasks. Selecting the right category ensures tasks are properly grouped and managed.",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: "#main-task-step-6", // Unique ID for the element inside MainDashboard you want to target
    content:
      "Click here to stop all running tasks instantly. Use this option if you need to pause all activities or address an issue without losing progress.",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: "#main-task-step-7", // Unique ID for the element inside MainDashboard you want to target
    content:
      "Start all tasks with a single click. This is useful when you want to execute multiple tasks at once, ensuring they run simultaneously for maximum efficiency.",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: `#sidebar-tab-accounts`, // Step targeting the Tasks tab
    content: getStepContent("Accounts"),
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: "#main-account-step-1", // Unique ID for the element inside MainDashboard you want to target
    content:
      "Start by adding new accounts to your system. You can manually enter account details or use existing templates to quickly create multiple accounts.",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: "#main-account-step-2", // Unique ID for the element inside MainDashboard you want to target
    content:
      "Use the search feature to quickly find a specific account by name. This helps you locate and manage accounts more efficiently.",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: "#main-account-step-3", // Unique ID for the element inside MainDashboard you want to target
    content:
      "Select the appropriate category for your accounts. Categorizing accounts helps in better organization and applying specific rules or actions to each group",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: "#main-account-step-4", // Unique ID for the element inside MainDashboard you want to target
    content:
      "Easily link accounts to Discord, wallets, or Twitter to integrate and manage connections across different platforms. This step is essential for seamless communication and transactions.",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: "#main-account-step-5", // Unique ID for the element inside MainDashboard you want to target
    content:
      "Quickly import multiple accounts from a TXT file. This feature allows you to add large batches of accounts at once, saving time and effort.",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: `#sidebar-tab-wallets`, // Step targeting the Tasks tab
    content: getStepContent("Wallets"),
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: "#main-wallets-step-1", // Unique ID for the element inside MainDashboard you want to target
    content:
      "Start by manually adding wallets to your account. Enter the required wallet details such as the address, name, and any other relevant information.",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: "#main-wallets-step-2", // Unique ID for the element inside MainDashboard you want to target
    content:
      "Quickly import multiple wallets from a TXT file. This allows you to bulk add wallets by uploading a file containing the necessary wallet information.",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: "#main-wallets-step-3", // Unique ID for the element inside MainDashboard you want to target
    content:
      "Export all wallets from the current tab to a TXT file for easy backup or sharing. This feature helps you maintain records of all your wallets in a portable format.",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: "#main-wallets-step-4", // Unique ID for the element inside MainDashboard you want to target
    content:
      "Automatically generate new wallets by specifying the number you need. This tool will create multiple wallets instantly, saving you time and effort.",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: "#main-wallets-step-5", // Unique ID for the element inside MainDashboard you want to target
    content:
      "Consolidate funds by transferring amounts from multiple wallets to a single wallet. This feature is useful for managing balances and reducing the number of wallets you actively use",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: "#main-wallets-step-6", // Unique ID for the element inside MainDashboard you want to target
    content:
      "Distribute funds from one wallet to multiple wallets based on your specified criteria. This tool helps in managing allocations and transactions efficiently.",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: "#main-wallets-step-7", // Unique ID for the element inside MainDashboard you want to target
    content:
      "Toggle the visibility of all private keys in the table. This feature allows you to securely manage private keys by hiding them when not needed or viewing them when necessary.",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: `#sidebar-tab-proxies`, // Step targeting the Tasks tab
    content: getStepContent("Proxies"),
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: "#main-proxies-step-1", // Unique ID for the element inside MainDashboard you want to target
    content:
      "Begin by adding new proxies to your list. Enter the proxy details, such as the IP address, port, username, and password, to ensure a secure and private browsing experience.",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: "#main-proxies-step-2", // Unique ID for the element inside MainDashboard you want to target
    content:
      "Test all the proxies to check their connectivity and performance. This step helps ensure that your proxies are working correctly and ready for use.",
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
  {
    target: `#sidebar-tab-all-settings`, // Step targeting the Tasks tab
    content: getStepContent("Settings"),
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: false,
    hideFooter: false,
    spotlightClicks: true,
    styles: {
      options: { zIndex: 10000 },
    },
  },
];

export async function refreshDiscordAccessToken(refreshToken: string) {
  const clientId = "1277951133851320343";
  const clientSecret = "Z_BgXJbOfLq-bSoAtghJ_ghlFLN11foP";
  const redirectUri = "http://localhost:1212/callback"; // Ensure this matches the initial OAuth2 flow
  try {
    const response = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        redirect_uri: redirectUri,
        scope: "identify guilds guilds.members.read", // Ensure this matches the original scope
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data; // Contains new access token, refresh token, and other info
  } catch (error: any) {
    console.log(
      "Failed to refresh access token:",
      error.response ? error.response.data : error.message
    );
  }
}

export const fetchUserGuilds = async (accessToken: string) => {
  try {
    const response = await axios.get(
      "https://discord.com/api/users/@me/guilds",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("Failed to fetch user guilds");
  }
};

export const fetchUserProfile = async (accessToken: string) => {
  try {
    const response = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data; // This will include the user's ID
  } catch (error) {
    console.log("Failed to fetch user profile");
  }
};

export const getAvatarUrl = (userProfile: {
  id: any;
  avatar: any;
  discriminator: any;
}) => {
  const { id, avatar, discriminator } = userProfile;

  if (avatar) {
    // If the user has a custom avatar
    return `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;
  } else {
    // If the user does not have a custom avatar, use the default one based on their discriminator
    const defaultAvatarNumber = parseInt(discriminator) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
  }
};

export const fetchUserRolesInGuild = async (
  guildId: string,
  accessToken: string
) => {
  try {
    const response = await axios.get(
      `https://discord.com/api/users/@me/guilds/${guildId}/member`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Make sure this is the latest valid token
        },
      }
    );
    const responseData: MemberData = response.data;
    const roles = responseData.roles;

    if (roles.includes("1247560623009697874")) {
      // If the user has the role '1247560623009697874', return true and 'Trident Holder'
      return { hasRole: true, roleText: "Trident Holder" };
    } else if (roles.includes("1260950003573067857")) {
      // If the user has the role '1260950003573067857', return true and 'Trident User'
      return { hasRole: true, roleText: "Trident User" };
    } else {
      // If no roles match, return false
      return { hasRole: false, roleText: "" };
    }
  } catch (error: any) {
    console.log(
      `Failed to fetch user roles in guild ${guildId}:`,
      error.response ? error.response.data : error.message
    );
  }
};
