import { useState, useRef, useEffect } from "react";
import useFetchV2 from "../../../../hooks/useFetchV2";
import useWindowSize from "../../../../hooks/useWindowSize";
import useFetchV3 from "../../../../hooks/useFetchV3";

export const useMainTasksStates = (isOpen: any) => {
  const storedGroups = localStorage.getItem("groupsTask");
  const initialData = storedGroups ? JSON.parse(storedGroups) : [];
  const [groups, setGroups] = useState<any[]>(initialData);

  const [actions, setActions] = useState(false);

  useEffect(() => {
    // Re-fetch data and set the state whenever `actions` changes
    const fetchGroups = () => {
      const storedGroups = localStorage.getItem("groupsTask");
      if (storedGroups) {
        setGroups(JSON.parse(storedGroups));
      }
    };

    fetchGroups();
  }, [actions]);

  const { data: settingsData } =
    useFetchV2<ISettingsData>("send-setting-to-ui");
  const { data: playingKeys } = useFetchV2<ISettingsData>(
    "send-PlayingKeys-to-ui"
  );
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [reCheck, setReCheck] = useState<boolean>(false);
  const [clearValues, setClearValues] = useState(false);
  const [isDisabledStartAll, setIsDisabledStartAll] = useState(false);
  const [tabValue, setTabValue] = useState<string | undefined>(undefined);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [playingTasks, setPlayingTasks] = useState<string[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("");
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([]);
  const [indexValue, setIndexValue] = useState<number | null>(null);
  const [selectedRowKey, setSelectedRowKey] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [searchInputAll, setSearchInputAll] = useState<string>("");
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorTab, setErrorTab] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    numberOfThreads: string | undefined;
    sleepTime: string | undefined;
  }>({
    numberOfThreads: undefined,
    sleepTime: undefined,
  });
  const [isModalOpenAddTab, setIsModalOpenAddTab] = useState<{
    isOpen: boolean;
    tab: string | undefined;
  }>({
    isOpen: false,
    tab: "",
  });
  const [isModalOpenCreateTask, setIsModalOpenCreateTask] = useState<{
    isOpen: boolean;
    tab: string | undefined;
    mode: string | undefined;
    type: string | undefined;
  }>({
    isOpen: false,
    tab: "",
    mode: undefined,
    type: undefined,
  });
  const [isModalOpenEditTask, setIsModalOpenEditTask] = useState<{
    isOpen: boolean;
    tab: string | undefined;
    mode: string | undefined;
    type: string | undefined;
    key: string | undefined;
  }>({
    isOpen: false,
    tab: "",
    mode: undefined,
    type: undefined,
    key: undefined,
  });
  const [isDeleteModal, setIsDeleteModal] = useState<{
    isOpen: boolean;
    name: string | undefined;
  }>({
    isOpen: false,
    name: undefined,
  });
  const [isDeleteTaskModal, setIsDeleteTaskModal] = useState<{
    isOpen: boolean;
    task: string | string[];
  }>({
    isOpen: false,
    task: "",
  });

  const [isModalVisibleLogs, setIsModalVisibleLogs] = useState<{
    isOpen: boolean;
    rowKey: string | undefined;
  }>({ isOpen: false, rowKey: undefined });

  const { width } = useWindowSize();

  const availableWidth = width ? width - (isOpen ? 180 : 100) : 0;
  const fixedColumnWidths = [
    { label: "Mode", dataKey: "Mode", width: 100 },
    { label: "Wallet Group", dataKey: "WalletGroup", width: 150 },
    { label: "Wallet Names", dataKey: "myWallet", width: 150 },
    { label: "Proxy", dataKey: "Proxy", width: 100 },
    { label: "Status", dataKey: "status", width: 150 },
    { label: "Actions", dataKey: "actions", width: 150 },
  ];
  const totalFixedWidth = fixedColumnWidths.reduce(
    (acc, col) => acc + col.width,
    0
  );
  const scalingFactor = availableWidth ? availableWidth / totalFixedWidth : 1;
  const scaledColumns = fixedColumnWidths.map((col) => ({
    ...col,
    width: Math.floor(col.width * scalingFactor),
  }));

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dataSettings = {
    threads: settingsData?.settings?.numberOfThreads,
    sleepTime: settingsData.settings?.sleepTime,
  };

  return {
    setActions,
    actions,
    groups,
    tabValue,
    setTabValue,
    tasks,
    setTasks,
    playingTasks,
    setPlayingTasks,
    selectedTasks,
    setSelectedTasks,
    selectedTab,
    setSelectedTab,
    taskGroups,
    setTaskGroups,
    indexValue,
    setIndexValue,
    selectedRowKey,
    setSelectedRowKey,
    isRunning,
    setIsRunning,
    searchInputAll,
    setSearchInputAll,
    showInput,
    setShowInput,
    inputRef,
    errorTab,
    setErrorTab,
    formData,
    setFormData,
    isModalOpenAddTab,
    setIsModalOpenAddTab,
    isModalOpenCreateTask,
    setIsModalOpenCreateTask,
    isModalOpenEditTask,
    setIsModalOpenEditTask,
    isDeleteModal,
    setIsDeleteModal,
    isDeleteTaskModal,
    setIsDeleteTaskModal,
    isModalVisibleLogs,
    setIsModalVisibleLogs,
    settingsData,
    width,
    timeoutRef,
    dataSettings,
    scaledColumns,
    setIsDisabledStartAll,
    isDisabledStartAll,
    playingKeys,
    reCheck,
    setReCheck,
    setClearValues,
    clearValues,
    isTyping,
    setIsTyping,
    setGroups,
  };
};
