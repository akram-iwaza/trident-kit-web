import { useState, useRef, useEffect } from "react";
import useFetchV2 from "../../../../hooks/useFetchV2";
import useWindowSize from "../../../../hooks/useWindowSize";
import useFetchV3 from "../../../../hooks/useFetchV3";

export const useMainAccountsStates = () => {
  const storedGroups = localStorage.getItem("groupsAccount");
  const initialData = storedGroups ? JSON.parse(storedGroups) : [];
  const [groups, setGroups] = useState<any[]>(initialData);

  const [actions, setActions] = useState(false);

  useEffect(() => {
    // Re-fetch data and set the state whenever `actions` changes
    const fetchGroups = () => {
      const storedGroups = localStorage.getItem("groupsAccount");
      if (storedGroups) {
        setGroups(JSON.parse(storedGroups));
      }
    };

    fetchGroups();
  }, [actions]);

  const { data: groupsWthImages } = useFetchV3<any[]>("sendAccountsImage");
  const { data: groupsWthImagesDisocrd, setGroups: setGroupsDisocrd } =
    useFetchV3<any[]>("sendAccountsDiscordImage");

  const [tabValue, setTabValue] = useState<string | undefined>(undefined);
  const [clearValues, setClearValues] = useState(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [errorTab, setErrorTab] = useState<string | null>(null);
  const [searchInputAll, setSearchInputAll] = useState<string>("");
  const [tasks, setTasks] = useState<account[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectedRowKey, setSelectedRowKey] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>("");
  const [isDeleteTaskModal, setIsDeleteTaskModal] = useState<{
    isOpen: boolean;
    task: string | string[];
  }>({
    isOpen: false,
    task: "",
  });
  const [isModalOpenImportAccounts, setIsModalOpenImportAccounts] = useState<{
    isOpen: boolean;
    groupName: string | undefined;
  }>({
    groupName: undefined,
    isOpen: false,
  });
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([]);
  const [indexValue, setIndexValue] = useState<number | null>(null);
  const [createAccountsModal, setCreateAccountsModal] = useState<{
    isOpen: boolean;
    tabName: string | undefined;
    rowKey?: number | null;
    form?: account | undefined;
  }>({
    isOpen: false,
    tabName: undefined,
    rowKey: null,
    form: undefined,
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
  const [isOpenMassLinkModal, setIsOpenMassLinkModal] = useState<{
    isOpen: boolean;
    category: string | undefined;
    tabName: string | undefined;
  }>({
    isOpen: false,
    category: undefined,
    tabName: undefined,
  });

  const { width } = useWindowSize();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const discordGroup = groups.filter(
    (group) => group.mainCategory === "Discord"
  );
  const twitterGroup = groups.filter(
    (group) => group.mainCategory === "Twitter"
  );

  const discordGroupAccounts = discordGroup.flatMap(
    (group) => group.myGroupAccounts
  );
  const twitterGroupAccounts = twitterGroup.flatMap(
    (group) => group.myGroupAccounts
  );

  return {
    actions,
    setActions,
    groups,
    tabValue,
    setTabValue,
    searchInput,
    setSearchInput,
    errorTab,
    setErrorTab,
    searchInputAll,
    setSearchInputAll,
    tasks,
    setTasks,
    selectedTasks,
    setSelectedTasks,
    selectedTab,
    setSelectedTab,
    isModalOpenImportAccounts,
    setIsModalOpenImportAccounts,
    showInput,
    setShowInput,
    inputRef,
    taskGroups,
    setTaskGroups,
    indexValue,
    setIndexValue,
    createAccountsModal,
    setCreateAccountsModal,
    isModalOpenAddTab,
    setIsModalOpenAddTab,
    isDeleteModal,
    setIsDeleteModal,
    isOpenMassLinkModal,
    setIsOpenMassLinkModal,
    width,
    timeoutRef,
    discordGroupAccounts,
    twitterGroupAccounts,
    setSelectedRowKey,
    selectedRowKey,
    setIsDeleteTaskModal,
    isDeleteTaskModal,
    setGroups,
    setClearValues,
    clearValues,
    groupsWthImages,
    groupsWthImagesDisocrd,
  };
};
