import React, { FC, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { updateSettingsSchema } from "../../schema/Settings";
import useFetchV2 from "../../../hooks/useFetchV2";
import TableSkeleton from "../../skeletons/TableSkeleton";
import { toast } from "../../ui/use-toast";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import useLocalStorageManager from "../../../hooks/useLocalStorageManager";
import {
  cn,
  fetchUserGuilds,
  fetchUserProfile,
  fetchUserRolesInGuild,
  getAvatarUrl,
} from "../../../lib/utils";
import ButtonTabs from "../../custom/ButtonTabs";
import { Icons } from "../../icons/Icons";
import SettingsInput from "../../custom/SettingsInput";
import DelayInput from "../../custom/DelayInput";
import DeleteModal from "../../modals/DeleteModal";
import UpdateChecker from "../../custom/UpdateChecker";

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

// Interface for the main 'data' object

const MainSettings: FC<IPropsMainSettings> = ({
  isOpen,
  unlockApp,
  checkUnlockApp,
  getUserData,
  isReady,
}) => {
  const RemoteSettings: any = "";
  const window: any = "";
  type SignInResponse = OAuthTokenResponse | "close-window";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [check, setCheck] = useState(false);
  const manageLocalStorage = useLocalStorageManager<any>();
  const [isModalLogoutOpen, setIsModalLogoutOpen] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const storedData = manageLocalStorage("get", "userSignInData");

  const storedGroups = localStorage.getItem("mySettings");
  const settingsData = storedGroups ? JSON.parse(storedGroups) : [];

  console.log("settingsData: ", settingsData);

  const [globalVisibility, setGlobalVisibility] = useState(true);
  const [individualVisibility, setIndividualVisibility] = useState({
    BlocknativeApiKey: true,
    EtherscanApiKey: true,
    licenceKey: true,
    NodeApiKey: true,
    DiscordWebhook: true,
    MempoolWss: true,
  });

  const formik = useFormik<Partial<ICreateOrUpdateSettingsResponse>>({
    initialValues: {
      BlocknativeApiKey: settingsData?.BlocknativeApiKey ?? undefined,
      myEthDelay: settingsData?.myEthDelay ?? "",
      DiscordWebhook: settingsData?.DiscordWebhook ?? undefined,
      EtherscanApiKey: settingsData?.EtherscanApiKey,
      licenceKey: settingsData?.licenseKey?.KEY,
      MempoolWss: settingsData?.MempoolWss ?? undefined,
      NodeApiKey: settingsData?.NodeApiKey ?? undefined,
    },
    enableReinitialize: true,
    validationSchema: toFormikValidationSchema(updateSettingsSchema),
    onSubmit: (values) => {
      const { licenceKey, ...allSettings } = values;
      // Remove the old mySettings from localStorage (if exists)
      localStorage.removeItem("mySettings");

      // Set the new values in localStorage as mySettings
      localStorage.setItem("mySettings", JSON.stringify(values));

      // Optionally, log the new settings for debugging
      console.log("Updated mySettings: ", values);

      toast({
        variant: "success",
        title: "Updated Settings Successfully",
      });
    },
  });

  const { setValues, setFieldValue, values, handleSubmit } = formik;

  const toggleVisibility = (key: keyof typeof individualVisibility) => {
    setIndividualVisibility((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const toggleGlobalVisibility = () => {
    const newGlobalVisibility = !globalVisibility;
    setGlobalVisibility(newGlobalVisibility);
    setIndividualVisibility({
      BlocknativeApiKey: newGlobalVisibility,
      EtherscanApiKey: newGlobalVisibility,
      licenceKey: newGlobalVisibility,
      NodeApiKey: newGlobalVisibility,
      DiscordWebhook: newGlobalVisibility,
      MempoolWss: newGlobalVisibility,
    });
  };

  const ExportAllDatabase = () => {
    const files = [
      "myAccounts",
      "myDashboard",
      "myProxies",
      "myRaffles",
      "mySettings",
      "myTasks",
      "myUser",
      "myWallets",
    ];
    const zip = new JSZip(); // Create a new JSZip instance

    // Iterate over each file and add it to the zip
    files.forEach((file) => {
      try {
        const filePath = `${
          RemoteSettings.appPath
        }${window.path.pathSepration()}TaskConfigs${window.path.pathSepration()}${file}.json`;
        const fileContent =
          RemoteSettings.appPath && window.fs.readFileSync(filePath, "utf8");

        // Add the file to the zip archive
        if (fileContent) {
          zip.file(`${file}.json`, fileContent);
        }
      } catch (err) {
        console.log(`Error reading file ${file}.json:`, err);
      }
    });

    // Generate the zip file and trigger download
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "exported_files.zip"); // Triggers a download of the zip file
    });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const importFilesFromZip = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    console.log("files: ", files);

    if (!files || files.length === 0) {
      console.log("No file selected");
      return;
    }

    const zipFile = files[0];
    const zip = new JSZip();

    try {
      // Read the zip file
      const zipContent = await zip.loadAsync(zipFile);

      // Iterate through each file in the zip
      Object.keys(zipContent.files).forEach(async (filename) => {
        const fileData = await zipContent.file(filename)?.async("string");
        if (fileData) {
          // Create the full path for each file
          const filePath = `${
            RemoteSettings.appPath
          }${window.path.pathSepration()}TaskConfigs${window.path.pathSepration()}${filename}`;

          // Save the file to the desired path
          try {
            window.fs.writeFileSync(filePath, fileData, "utf8");
            console.log(`${filename} successfully imported to ${filePath}`);
            setTimeout(() => {
              setCheck(!check);
            }, 300);
          } catch (err) {
            console.log(`Error writing file ${filename}:`, err);
          }
        }
      });
    } catch (err) {
      console.log("Error reading zip file:", err);
    }
  };

  return (
    <div
      className={cn(
        `w-full flex flex-col items-start overflow-y-auto max-h-screen px-6 overflow-x-hidden`
      )}
    >
      <div className={cn(`w-full flex items-center justify-between py-6`)}>
        <div className="flex items-center gap-2.5">
          {/* {unlockApp ? (
                        <button
                            onClick={() => {
                                setIsModalLogoutOpen(true)

                            }}
                            className='w-[150px] flex items-center justify-between hover:bg-darkHoverBgBtn  transform transition duration-500 !font-normal !text-[16px] py-2 px-4 rounded-md h-8 whitespace-nowrap border border-backGround  bg-defaultBg  gap-2 outline-none disabled:cursor-not-allowed'>
                            <div className='flex items-center gap-[7px]'>
                                {storedData && storedData?.[0]?.avatarUrl ? (
                                    <div className='relative w-5 h-5'>
                                        <img
                                            alt='profileImage'
                                            src={storedData?.[0]?.avatarUrl}
                                            className='w-5 h-5 rounded-full'
                                        />
                                    </div>
                                ) : (
                                    <div className='relative w-5 h-5'>
                                        <BsPersonCircle className='text-white w-5 h-5' />
                                    </div>
                                )}

                                <span className='text-white text-xs-plus font-normal'>Log Out</span>
                            </div>
                            <MdLogout className='w-4 h-4 text-white' />
                        </button>
                    ) : isSigningIn ? (
                        <button disabled={true}
                            className='w-[150px] flex items-center justify-center hover:bg-darkHoverBgBtn  transform transition duration-500 !font-normal !text-[16px] py-2 px-4 rounded-md h-8 whitespace-nowrap border border-backGround  bg-defaultBg  gap-2 outline-none disabled:cursor-not-allowed'>
                            <Icons.Spinner className='w-5 h-5 text-primary' />
                        </button>

                    ) : (
                        <button onClick={handleSignIn} className='w-[150px] flex items-center justify-between hover:bg-darkHoverBgBtn  transform transition duration-500 !font-normal !text-[16px] py-2 px-4 rounded-md h-8 whitespace-nowrap border border-backGround  bg-defaultBg  gap-2 outline-none disabled:cursor-not-allowed'>
                            <div className='flex items-center gap-[7px]'>
                                <Icons.Discord className='w-4 h-4' />
                                <span className='text-white text-xs-plus font-normal'>Sign In</span>
                            </div>
                            <MdLogin className='w-4 h-4 text-white' />
                        </button>
                    )} */}

          <ButtonTabs
            disabled={!unlockApp}
            buttonClassName={cn(``, !unlockApp && "blur-none ")}
            onClick={() => {
              setValues(() => ({
                BlocknativeApiKey: undefined,
                DiscordWebhook: undefined,
                EtherscanApiKey: undefined,
                licenceKey: values.licenceKey,
                MempoolWss: undefined,
                NodeApiKey: undefined,
                myEthDelay: undefined,
              }));
            }}
          >
            Reset Settings
          </ButtonTabs>
          <ButtonTabs
            disabled={true}
            type={true ? "disabled" : "default"}
            buttonClassName={cn(``, !unlockApp && "blur-none ")}
            onClick={() => {
              ExportAllDatabase();
            }}
          >
            Export All
          </ButtonTabs>
          <div>
            <ButtonTabs
              disabled={true}
              type={true ? "disabled" : "default"}
              buttonClassName={cn(``, !unlockApp && "blur-none ")}
              onClick={handleButtonClick}
            >
              Import All
            </ButtonTabs>
            <input
              type="file"
              accept=".zip"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={importFilesFromZip}
            />
          </div>
          <div className="h-[25px] w-[1px] bg-darkBlue dark:bg-backGround " />
          <ButtonTabs
            buttonClassName={cn(``, !unlockApp && "blur-none ")}
            onClick={toggleGlobalVisibility}
            disabled={!unlockApp}
          >
            {globalVisibility ? (
              <div className="w-full flex items-center gap-[10px]">
                <span className="text-xs-plus text-default dark:text-white font-normal group-hover:text-default group-hover:border-primary dark:group-hover:text-white dark:group-hover:border-none dark:group-hover:bg-darkHoverBgBtn  transform transition duration-500">
                  View All
                </span>

                <Icons.EyeSvg className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-full flex items-center gap-[10px] group">
                <span className="text-xs-plus text-default dark:text-white font-normal group-hover:text-default group-hover:border-primary dark:group-hover:text-white dark:group-hover:border-none dark:group-hover:bg-darkHoverBgBtn  transform transition duration-500">
                  Hide All
                </span>
                <Icons.EyeSlashSvg className="w-4 h-4" />
              </div>
            )}
          </ButtonTabs>
        </div>
        <ButtonTabs
          onClick={handleSubmit}
          disabled={!unlockApp}
          buttonClassName={cn(``, !unlockApp && "blur-none ")}
          showShortcut={true}
          shortcutText="Ctrl + S"
          type="active"
        >
          Save Settings
        </ButtonTabs>
      </div>
      <div className="w-full flex flex-col items-start border border-borderLight dark:border-backGround  rounded-[0.875rem] pb-[1.375rem]">
        <div
          className={cn(
            `w-full flex items-center gap-3 p-[1.375rem] border-b-[1px] border-borderLight dark:border-[#29292B]`,
            !unlockApp && "blur-none "
          )}
        >
          <SettingsInput
            label="Trident Role"
            wrapperClassName="w-[100%]"
            disabled={!unlockApp}
            disabledInput={true}
            onChange={(value) => {
              setFieldValue("licenceKey", value);
            }}
            value={values.licenceKey ?? ""}
            isHidden={false}
            onToggleVisibility={() => toggleVisibility("licenceKey")}
            isRole
          />
        </div>
        <div
          className={cn(
            `w-full flex items-center gap-3 p-[1.375rem]`,
            !unlockApp && "blur-none "
          )}
        >
          <SettingsInput
            wrapperClassName="w-[75%]"
            label="Etherscan Api Key"
            disabled={!unlockApp}
            onChange={(value) => {
              setFieldValue("EtherscanApiKey", value);
            }}
            value={values.EtherscanApiKey ?? ""}
            isHidden={individualVisibility.EtherscanApiKey}
            onToggleVisibility={() => toggleVisibility("EtherscanApiKey")}
          />
          <DelayInput
            wrapperClassName="w-[25%]"
            disabled={!unlockApp}
            label="Ethereum Delay"
            value={values.myEthDelay}
            onChange={(value) => {
              setFieldValue("myEthDelay", value);
            }}
            delayUnit="ms"
          />
        </div>
        <div
          className={cn(
            `w-full flex flex-col items-start gap-[24px]`,
            !unlockApp && "blur-none "
          )}
        >
          <div className="w-full flex items-center gap-3 px-[1.375rem]">
            <SettingsInput
              wrapperClassName="w-full"
              disabled={!unlockApp}
              label="Node API"
              onChange={(value) => {
                setFieldValue("NodeApiKey", value);
              }}
              value={values.NodeApiKey ?? ""}
              isHidden={individualVisibility.NodeApiKey}
              onToggleVisibility={() => toggleVisibility("NodeApiKey")}
            />
            <SettingsInput
              wrapperClassName="w-full"
              disabled={!unlockApp}
              label="Block Native API"
              onChange={(value) => {
                setFieldValue("BlocknativeApiKey", value);
              }}
              value={values.BlocknativeApiKey ?? ""}
              isHidden={individualVisibility.BlocknativeApiKey}
              onToggleVisibility={() => toggleVisibility("BlocknativeApiKey")}
            />
          </div>
          <div className="w-full flex items-center gap-3 px-[1.375rem]">
            <SettingsInput
              wrapperClassName="w-full"
              disabled={!unlockApp}
              label="Discord Webhook"
              onChange={(value) => {
                setFieldValue("DiscordWebhook", value);
              }}
              value={values.DiscordWebhook ?? ""}
              isHidden={individualVisibility.DiscordWebhook}
              onToggleVisibility={() => toggleVisibility("DiscordWebhook")}
            />
          </div>
          <div className="w-full flex items-center gap-3 px-[1.375rem]">
            <SettingsInput
              wrapperClassName="w-full"
              disabled={!unlockApp}
              label="MempoolWss"
              onChange={(value) => {
                setFieldValue("MempoolWss", value);
              }}
              value={values.MempoolWss ?? ""}
              isHidden={individualVisibility.MempoolWss}
              onToggleVisibility={() => toggleVisibility("MempoolWss")}
            />
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
    </div>
  );
};

export default MainSettings;
