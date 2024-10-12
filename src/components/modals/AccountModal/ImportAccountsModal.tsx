import React, { FC, useEffect, useState } from "react";
import ModalHeader from "../../custom/ModalHeader";
import LabelAndSwitch from "../../custom/LabelAndSwitch";
import { toast } from "../../ui/use-toast";

interface IPropsImportAccountsModal {
  onClose: () => void;
  groupName: string;
  countTasks: number;
  setIsLoadingData: (value: boolean) => void;
  setCountDataTasks: (value: number) => void;
  category: string;
}
const ImportAccountsModal: FC<IPropsImportAccountsModal> = ({
  onClose,
  groupName,
  setIsLoadingData,
  countTasks,
  setCountDataTasks,
  category,
}) => {
  const [multiFarmTask, setMultiFarmTask] = useState<MultiFarmTask>({
    Mode: "MultiFarm",
    myGroupName: groupName,
    generateWallets: false,
    twitterAccounts: [],
  });

  const [activeTab, setActiveTab] = useState<String>(category ?? "");
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        processFileContent(content);
      };
      reader.readAsText(file);
    }
  };

  const processFileContent = (content: string) => {
    const lines = content.split("\n");

    if (activeTab === "Twitter") {
      const parsedData: TwitterAccount[] = lines.map((line) => {
        const fields = line.split(":").map((field) => field.trim());
        if (fields.length === 6) {
          const [
            name,
            password,
            email,
            confirmPassword,
            TwitterAuthToken,
            faValue,
          ] = fields;
          return {
            name,
            password,
            email,
            confirmPassword,
            TwitterAuthToken,
            faValue,
          };
        } else if (fields.length === 5) {
          const [name, password, email, ct0, TwitterAuthToken] = fields;
          return {
            name,
            password,
            email,
            ct0,
            TwitterAuthToken,
          };
        } else {
          return {
            name: "",
            password: "",
            email: "",
            confirmPassword: "",
            TwitterAuthToken: "",
            faValue: "",
            twitterAuthTokenSingle: "",
            ct0: "",
          };
        }
      });
      setMultiFarmTask((prev: any) => ({
        ...prev,
        twitterAccounts: parsedData,
      }));
    } else {
      const parsedData: { tokenDiscord: string }[] = lines.map((line) => {
        const tokenDiscord = line.trim();
        return { tokenDiscord };
      });
      setMultiFarmTask((prev: any) => ({
        ...prev,
        twitterAccounts: parsedData,
      }));
    }
  };

  const clearData = () => {
    setMultiFarmTask((prev: any) => ({
      ...prev,
      twitterAccounts: [],
      generateWallets: false,
    }));
  };

  const handleSubmit = () => {
    const storedAccount = localStorage.getItem("groupsAccount");
    let groupsAccount = storedAccount ? JSON.parse(storedAccount) : [];

    console.log("multiFarmTask: ", multiFarmTask);
    console.log("groupsAccount: ", groupsAccount);
  };

  return (
    <ModalHeader
      label={"Import Accounts"}
      onClose={onClose}
      wrapperClassName="w-[35rem] h-fit"
      onSubmit={handleSubmit}
      onClear={clearData}
      disabled={
        multiFarmTask &&
        multiFarmTask.twitterAccounts &&
        multiFarmTask.twitterAccounts.length === 0
      }
    >
      {/* {category === 'Discord' ? 'dis' : 'twit'} */}
      <div className="w-full flex flex-col items-center justify-between">
        {/* <div className="w-full flex items-center justify-center gap-4">
                    <button
                        onClick={() => {
                            setActiveTab('Twitter');
                        }}
                        className={cn(
                            `w-[10.9375rem] h-11 border border-border rounded-md flex items-center justify-center text-whiteColor text-[0.9375rem] font-normal`,
                            activeTab === 'Twitter' && 'border-activeColor',
                        )}
                    >
                        Twitter
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('Discord');
                        }}
                        className={cn(
                            `w-[10.9375rem] h-11 border border-border rounded-md flex items-center justify-center text-whiteColor text-[0.9375rem] font-normal`,
                            activeTab === 'Discord' && 'border-activeColor',
                        )}
                    >
                        Discord
                    </button>
                </div> */}
        <div className="w-full flex items-center justify-between">
          <div className="w-full flex items-center gap-3">
            <div className="w-fit flex items-start justify-start">
              <input
                id="uploadFileData"
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="uploadFileData"
                className="text-default !text-[0.9375rem] dark:text-white cursor-pointer font-normal py-2 px-4 rounded-md h-8 whitespace-nowrap border bg-white dark:bg-darkHoverBgBtn  border-borderLight dark:border-backGround  hover:text-lightGreen hover:border-lightGreen  dark:hover:bg-backGroundBtn  dark:hover:text-hoverActiveBtn  dark:hover:border-backGroundBtn  transform transition duration-500 flex items-center justify-center"
              >
                Upload File
              </label>
            </div>
            {multiFarmTask.twitterAccounts.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="text-default dark:text-whiteColor text-xs-plus font-normal">
                  Number of Accounts: {multiFarmTask.twitterAccounts.length}
                </div>
                {/* <div
                                    onClick={clearData}
                                    className=" p-2 bg-transparent hover:border-activeColor border cursor-pointer border-border rounded-full flex items-center justify-center"
                                >
                                    <Icons.DeleteButton className="text-gray h-4 w-4" />
                                </div> */}
              </div>
            )}
          </div>
          <LabelAndSwitch
            label={"Generate Wallets"}
            labelClassName="w-full text-label"
            inputClassName="w-full h-10 bg-backgroundInput  border border-borders text-white text-xs-plus placeholder:text-nickle"
            wrapperClassName="w-[20rem] flex items-start"
            checked={multiFarmTask.generateWallets ?? false}
            onClick={() => {
              setMultiFarmTask((prev) => ({
                ...prev,
                generateWallets: !multiFarmTask.generateWallets,
              }));
            }}
          />
        </div>
      </div>
    </ModalHeader>
  );
};

export default ImportAccountsModal;
