import React, { useState, useEffect, useCallback } from "react";
import DeleteModal from "../modals/DeleteModal";
import { toast } from "../ui/use-toast";
import useWindowSize from "../../hooks/useWindowSize";
import ProgressBar from "./ProgressBar";
import { cn } from "../../lib/utils";

interface IProgressBarProps {
  message: "download-progress";
  title: "Downloading update";
  percentage: number;
  description: string;
}

interface IProps {
  disabled: boolean;
}

const UpdateChecker: React.FC<IProps> = ({ disabled }) => {
  const RemoteSettings: any = "";
  const [version, setVersion] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("Update");
  const [percent, setPercent] = useState(0);

  const { width } = useWindowSize();
  const isWidth = width && width < 1236;

  const handleDownloadProgress = useCallback(
    (event: any, message: IProgressBarProps) => {
      const progress = Math.floor(Number(message.percentage)) || 1; // Ensure progress is at least 1
      setPercent(progress);
    },
    []
  );

  const checkForUpdates = useCallback(() => {
    setIsChecking(true);
    setShowProgress(false);
    setUpdateMessage("Update...");
    //   window.electron.ipcRenderer.sendMessage("check_update");
  }, []);

  const handleUpdateAvailability = useCallback((data: any) => {
    if (data.message === "update-available") {
      setShowUpdateModal(true);
      toast({
        title: "Updating",
        variant: data.description,
      });
    } else {
      setUpdateMessage("Updated");
    }
  }, []);

  const getVersion = useCallback(async () => {
    try {
      const data: any = "";
      const versionMatch = data && data.match(/version:\s*(.*)/);
      setVersion(versionMatch ? versionMatch[1].trim() : "");
    } catch (error) {
      console.error("Error fetching version:", error);
    }
  }, []);

  useEffect(() => {
    if (percent > 0 && percent < 100) {
      setShowProgress(true);
      setIsChecking(false);
    } else if (percent === 100) {
      setUpdateMessage("You’re up to date!");
      setShowProgress(false);
      setIsChecking(false);
    } else if (percent === 0 && showProgress && !isChecking) {
      setUpdateMessage("Updated");
      setShowProgress(false);
      setIsChecking(false);
    }
  }, [percent, showProgress, isChecking]);

  useEffect(() => {
    getVersion();
  }, [getVersion]);

  return (
    <div
      className={cn(
        `w-full flex items-center justify-between bg-white  shadow-[0_4px_30px_rgba(0,0,0,0.1)]  dark:bg-backgroundInput  border border-borderLight dark:border-borders text-white rounded-md px-4 py-2 mt-[1.7rem] h-11`,
        isChecking && !showProgress && "justify-center"
      )}
    >
      {!RemoteSettings.isUpdating ? (
        <button
          disabled={disabled}
          className={cn(
            `border-none text-default dark:text-white text-[16px]`,
            isWidth && "text-[13px]"
          )}
          onClick={checkForUpdates}
        >
          {updateMessage}
        </button>
      ) : (
        <ProgressBar percent={percent} />
      )}
      {version && (
        <div className="w-fit flex items-center justify-center bg-lightGreen  dark:bg-backGroundBtn  text-white dark:text-hoverActiveBtn  py-[2px] px-[6px] rounded-[4px]">
          v{version}
        </div>
      )}
      {showUpdateModal && (
        <DeleteModal
          slug={""}
          callback={() => {}}
          onClose={() => setShowUpdateModal(false)}
        />
      )}
    </div>
  );
};

export default UpdateChecker;
