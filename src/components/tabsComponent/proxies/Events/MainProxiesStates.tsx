import { useState, useRef, useEffect } from "react";
import useWindowSize from "../../../../hooks/useWindowSize";
import useStatusesProxy from "../../../../hooks/useStatusesProxy";
import useFetchV3 from "../../../../hooks/useFetchV3";

export const useMainProxiesStates = () => {
  const storedGroups = localStorage.getItem("groupsProxy");
  const initialData = storedGroups ? JSON.parse(storedGroups) : [];
  const [groups, setGroups] = useState<any[]>(initialData);

  const [actions, setActions] = useState(false);

  useEffect(() => {
    // Re-fetch data and set the state whenever `actions` changes
    const fetchGroups = () => {
      const storedGroups = localStorage.getItem("groupsProxy");
      if (storedGroups) {
        setGroups(JSON.parse(storedGroups));
      }
    };

    fetchGroups();
  }, [actions]);

  const taskStatuses = useStatusesProxy();

  const { width } = useWindowSize();

  const [tabValue, setTabValue] = useState<string | undefined>(undefined);
  const [proxies, setProxies] = useState<Proxies[]>([]);
  const [playingTasks, setPlayingTasks] = useState<string[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("");
  const [taskGroups, setTaskGroups] = useState<string[]>([]);
  const [indexValue, setIndexValue] = useState<number | null>(null);
  const [searchInputAll, setSearchInputAll] = useState<string>("");
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorTab, setErrorTab] = useState<string | null>(null);
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

  const [createProxiesModal, setCreateProxiesModal] = useState<{
    isOpen: boolean;
    tabName: string | undefined;
    rowKey?: string | undefined;
    proxy?: string | undefined;
  }>({
    isOpen: false,
    tabName: undefined,
    rowKey: undefined,
    proxy: undefined,
  });

  return {
    setActions,
    actions,
    groups,
    tabValue,
    setTabValue,
    proxies,
    setProxies,
    playingTasks,
    setPlayingTasks,
    selectedTasks,
    setSelectedTasks,
    selectedTab,
    setSelectedTab,
    taskStatuses,
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
    isModalOpenAddTab,
    setIsModalOpenAddTab,
    isDeleteModal,
    setIsDeleteModal,
    createProxiesModal,
    setCreateProxiesModal,
    width,
    setIsDeleteTaskModal,
    isDeleteTaskModal,
    setGroups,
  };
};
