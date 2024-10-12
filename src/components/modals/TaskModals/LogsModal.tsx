import React, { FC, useEffect, useRef, useState } from "react";
import ModalHeader from "../../custom/ModalHeader";
import { useTheme } from "../../../hooks/ThemeContext";

interface IPropsLogsModal {
  onClose: () => void;
  rowKey: string | undefined;
}

const LogsModal: FC<IPropsLogsModal> = ({ onClose, rowKey }) => {
  console.log("rowKey : ", rowKey);
  const RemoteSettings: any = {};
  const window: any = {};
  const { isDarkMode } = useTheme();

  const [myReadStream, setMyReadStream] = useState<string | null>(null); // Specify the type
  const myPath = `${
    RemoteSettings.appPath
  }${window.path.pathSepration()}TaskConfigs${window.path.pathSepration()}logs${window.path.pathSepration()}Task-ID-${rowKey}.txt`;
  const logContentRef = useRef<HTMLDivElement>(null);

  const handleExportLogs = () => {
    const logs = window.fs.readFileSync(myPath);
    const blob = new Blob([logs], { type: "text/plain" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "Task_Logs.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  useEffect(() => {
    if (logContentRef.current) {
      logContentRef.current.scrollTop = logContentRef.current.scrollHeight;
    }
  }, [myReadStream]);

  return (
    <ModalHeader
      label="Logs"
      onClose={onClose}
      wrapperClassName="w-[40rem]"
      onSubmit={handleExportLogs}
      textSubmit="Export"
    >
      <div
        className="overflow-y-auto max-h-96 h-96 p-4  shadow-[0_4px_30px_rgba(0,0,0,0.1)]  bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:text-white rounded-lg w-full pr-2"
        ref={logContentRef}
      >
        <div className="textLogs">
          {myReadStream &&
            myReadStream.split("\n").map((line, index) => {
              const style: React.CSSProperties = {};

              if (line.includes("[LOGGER]")) {
                !isDarkMode ? (style.color = "blue") : (style.color = "cyan");
              } else if (line.includes("[SUCCESS]")) {
                !isDarkMode
                  ? (style.color = "#26b872")
                  : (style.color = "green");
              } else if (line.includes("[ERROR]")) {
                style.color = "#bd4a59";
              }

              return (
                <ul key={index}>
                  <li style={style} className="textlogsData">
                    {line}
                  </li>
                </ul>
              );
            })}
        </div>
      </div>
    </ModalHeader>
  );
};

export default LogsModal;
