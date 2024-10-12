import { useState, useRef, useEffect } from "react";
import useWindowSize from "../../../../hooks/useWindowSize";
import useFetchV3 from "../../../../hooks/useFetchV3";

export const useMainWalletsStates = () => {
  const storedGroups = localStorage.getItem("groupsWallet");
  const initialData = storedGroups ? JSON.parse(storedGroups) : [];
  const [groups, setGroups] = useState<any[]>(initialData);

  const [actions, setActions] = useState(false);

  useEffect(() => {
    // Re-fetch data and set the state whenever `actions` changes
    const fetchGroups = () => {
      const storedGroups = localStorage.getItem("groupsWallet");
      if (storedGroups) {
        setGroups(JSON.parse(storedGroups));
      }
    };

    fetchGroups();
  }, [actions]);

  const { width } = useWindowSize();
  const [tabValue, setTabValue] = useState<string | undefined>(undefined);
  const [tasks, setTasks] = useState<wallet[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("");
  const [taskGroups, setTaskGroups] = useState<string[]>([]);
  const [indexValue, setIndexValue] = useState<number | null>(null);
  const [searchInputAll, setSearchInputAll] = useState<string>("");
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorTab, setErrorTab] = useState<string | null>(null);
  const [privateKeyVisibility, setPrivateKeyVisibility] = useState<{
    [key: number]: boolean;
  }>({});
  const [arePrivateKeysVisible, setArePrivateKeysVisible] = useState(false);

  const [createWalletsModal, setCreateWalletsModal] = useState<{
    isOpen: boolean;
    tabName: string | undefined;
    rowKey?: string | undefined;
    proxy?: string | undefined;
    address?: string | undefined;
    balance?: string | undefined;
  }>({
    isOpen: false,
    tabName: undefined,
    rowKey: undefined,
    proxy: undefined,
    address: undefined,
    balance: undefined,
  });
  const [isDeleteTaskModal, setIsDeleteTaskModal] = useState<{
    isOpen: boolean;
    task: string | string[];
  }>({
    isOpen: false,
    task: "",
  });
  const [isModalOpenAddTab, setIsModalOpenAddTab] = useState<{
    isOpen: boolean;
    tab: string | undefined;
  }>({
    isOpen: false,
    tab: "",
  });

  const [isDeleteModal, setIsDeleteModal] = useState<{
    isOpen: boolean;
    name: string | undefined;
  }>({
    isOpen: false,
    name: undefined,
  });

  const [isModalOpenGenerateWallet, setIsModalOpenGenerateWallet] = useState<{
    isOpen: boolean;
    tabName: string | undefined;
  }>({
    isOpen: false,
    tabName: undefined,
  });

  const [isDistributeRecollectModalOpen, setIsDistributeRecollectModalOpen] =
    useState<{
      isDistrubte: boolean;
      isRecollect: boolean;
    }>({
      isDistrubte: false,
      isRecollect: false,
    });

  return {
    groups,
    actions,
    setActions,
    tabValue,
    setTabValue,
    tasks,
    setTasks,
    selectedTasks,
    setSelectedTasks,
    selectedTab,
    setSelectedTab,
    taskGroups,
    setTaskGroups,
    indexValue,
    setIndexValue,
    searchInputAll,
    setSearchInputAll,
    showInput,
    setShowInput,
    inputRef,
    errorTab,
    setErrorTab,
    createWalletsModal,
    setCreateWalletsModal,
    isModalOpenAddTab,
    setIsModalOpenAddTab,
    isDeleteModal,
    setIsDeleteModal,
    isModalOpenGenerateWallet,
    setIsModalOpenGenerateWallet,
    isDistributeRecollectModalOpen,
    setIsDistributeRecollectModalOpen,
    width,
    isDeleteTaskModal,
    setIsDeleteTaskModal,
    privateKeyVisibility,
    setPrivateKeyVisibility,
    arePrivateKeysVisible,
    setArePrivateKeysVisible,
    setGroups,
  };
};
