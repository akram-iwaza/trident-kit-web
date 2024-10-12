import { useCallback } from "react";
import { toast } from "../../../ui/use-toast";

declare global {
  interface Window {
    electron: any;
  }
}

export const useMainTasksFunctions = (state: any, tabContainerRef: any) => {
  const {
    setActions,
    actions,
    tasks,
    setTasks,
    setPlayingTasks,
    selectedTasks,
    setSelectedTasks,
    selectedTab,
    setSelectedTab,
    setTaskGroups,
    setIndexValue,
    selectedRowKey,
    setIsRunning,
    setSearchInputAll,
    setShowInput,
    setErrorTab,
    formData,
    setFormData,
    setIsModalOpenAddTab,
    setIsDeleteModal,
    setIsDeleteTaskModal,
    groups,
    timeoutRef,
    reCheck,
    setReCheck,
    setClearValues,
    taskGroups,
    setGroups,
    isTyping,
    setIsTyping,
    setTabValue,
  } = state;

  const handleAddTab = () => {
    setIsModalOpenAddTab({
      isOpen: true,
      tab: undefined,
    });
  };

  const updateTasksWithAccountData = (
    tasks: Task[],
    AccountsData: IGroupAccounts[]
  ) => {
    const updatedTasks = tasks.map((task) => {
      const account = AccountsData.flatMap(
        (group) => group.myGroupAccounts
      ).find(
        (account: { key: string }) =>
          account && account.key === task.selectedAccountKey
      );

      if (account) {
        return {
          ...task,
          WalletGroup: account.WalletGroup,
          myWallet: account.myWallet,
        };
      }

      return task;
    });
    setTasks(updatedTasks);
  };

  const onEditClick = (value: string, newTabName: String) => {
    const updatedGroups = groups.map(
      (group: { myGroupName: string; mode: any; type: any }) =>
        group.myGroupName === value
          ? {
              ...group,
              myGroupName: newTabName,
              mode: group.mode,
              type: group.type,
            }
          : group
    );
    localStorage.setItem("groupsTask", JSON.stringify(updatedGroups));
    toast({
      variant: "success",
      title: "Edited Group Name ",
    });
    setActions(!actions);
  };

  const onPermanentDeleteClick = (value: string) => {
    const isLastGroup = groups && groups.length === 1;

    const updatedGroups = groups.filter(
      (group: { myGroupName: any }) => group.myGroupName !== value
    );
    setGroups(updatedGroups); // Update state
    localStorage.setItem("groupsTask", JSON.stringify(updatedGroups));
    toast({
      variant: "success",
      title: "Group Name Deleted Successfully",
    });
    if (isLastGroup) {
      setGroups([]);
      setTasks([]);
      setTaskGroups([]);
      setActions(!actions);
      setSelectedTab("");
    } else {
      setActions(!actions);
      clearSelectedCategory();
    }
    setActions(!actions);
  };

  // const handleTabClick = (tabName: string) => {
  //     if (tabName !== selectedTab) {
  //         setSelectedTasks([]);
  //     }
  //     setSelectedTab(tabName);
  //     const selectedGroup = groups.find(
  //         (group: any) => group.myGroupName === tabName,
  //     );
  //     if (selectedGroup) {
  //         setTasks(selectedGroup.myGroupTasks);
  //         setTimeout(() => {
  //             setReCheck(!reCheck);
  //         }, 500);
  //     }
  // };

  const handleTabClick = (tabName: string) => {
    if (tabName !== selectedTab) {
      setSelectedTasks([]);
    }
    setSelectedTab(tabName);
    setTabValue(tabName);
    const selectedGroup = groups.find(
      (group: any) => group.myGroupName === tabName
    );
    if (selectedGroup) {
      setTasks(selectedGroup.myGroupTasks);
    }

    // Ensure the selected tab is visible
    setTimeout(() => {
      const tabElement = document.getElementById(`tab-${tabName}`);

      if (tabElement) {
        // Get the position of the tab and container
        const tabRect = tabElement.getBoundingClientRect();
        const containerRect = tabContainerRef.current?.getBoundingClientRect();

        if (containerRect) {
          const isTabVisible =
            tabRect.left >= containerRect.left &&
            tabRect.right <= containerRect.right;

          // Scroll into view if the tab is not fully visible
          if (!isTabVisible) {
            tabElement.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "center",
            });
          }
        }
      }
    }, 100);
  };

  const handleDuplicateTask = (key: string) => {
    const uniqueKeys = Array.from(new Set([...selectedTasks, key]));
    const storedAccount = localStorage.getItem("groupsTask");
    let groupsAccount = storedAccount ? JSON.parse(storedAccount) : [];

    console.log("uniqueKeys: ", uniqueKeys);
    console.log("groupsAccount: ", groupsAccount);

    // Iterate over groupsAccount to find the group containing the account with the matching key
    const updatedGroupsAccount = groupsAccount.map((group: any) => {
      // Find the account with the matching key within the group's accounts
      const accountToDuplicate = group.myGroupTasks.find(
        (account: any) => account.key === key
      );

      if (accountToDuplicate) {
        // Create a duplicate account with a new unique key
        const duplicatedAccount = {
          ...accountToDuplicate, // Copy all properties
          key: generateUniqueKey(), // Generate a new unique key
        };

        // Add the duplicated account to myGroupTasks
        return {
          ...group,
          myGroupTasks: [...group.myGroupTasks, duplicatedAccount],
        };
      }

      return group; // Return the group unchanged if no matching account is found
    });

    // Save the updated groupsAccount back to localStorage
    localStorage.setItem("groupsTask", JSON.stringify(updatedGroupsAccount));
    setActions(!actions);
  };

  const generateUniqueKey = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };
  const handleDeleteTasks = (tasks: string | string[]) => {
    const tasksArray = Array.isArray(tasks) ? tasks : [tasks];
    const combinedTasks = [...tasksArray, selectedRowKey];
    const uniqueTasks = Array.from(new Set(combinedTasks));
    const storedAccount = localStorage.getItem("groupsTask");
    let groupsAccount = storedAccount ? JSON.parse(storedAccount) : [];

    console.log("combinedKeysArray: ", uniqueTasks);
    console.log("groupsAccount: ", groupsAccount);

    // Iterate through all groupsAccount and remove the accounts that match the keys
    const updatedGroupsAccount = groupsAccount.map((group: any) => {
      // Filter out accounts in the current group that match the keys in combinedKeysArray
      return {
        ...group,
        myGroupTasks: group.myGroupTasks.filter(
          (account: any) => !uniqueTasks.includes(account.key)
        ),
      };
    });

    // Save the updated groupsAccount back to localStorage
    localStorage.setItem("groupsTask", JSON.stringify(updatedGroupsAccount));

    // UI Updates and Feedback
    setTabValue(selectedTab);

    toast({
      variant: "success",
      title: "Deleted Accounts Successfully",
    });
    setIsDeleteTaskModal({
      isOpen: false,
      task: "",
    });
    setActions(!actions);
  };

  const handleStartAll = () => {
    if (selectedTasks.length > 0) {
      setPlayingTasks(selectedTasks);
      const TaskGroupToRun = tasks.filter((task: { key: string }) =>
        selectedTasks.includes(task.key)
      );
    } else {
      const allTaskKeys = tasks.map((task: { key: string }) => task.key);
      setPlayingTasks((prev: string[]) => [
        ...new Set([...(prev || []), ...allTaskKeys]),
      ]);

      const TaskGroupToRun = tasks.filter((task: { key: string }) =>
        allTaskKeys.includes(task.key)
      );
    }
    setIsRunning(true);
  };

  const removeKeysFromPlayingTasks = (keysToRemove: string[]) => {
    setPlayingTasks((prev: string[]) =>
      prev.filter((key) => !keysToRemove.includes(key))
    );
  };

  const handleStopAll = (keys: string[]) => {
    setIsRunning(false);
    removeKeysFromPlayingTasks(keys);
    setSelectedTasks([]);
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map((task: { key: string }) => task.key));
    }
  };

  const handleSelectTask = (key: string) => {
    setSelectedTasks((prev: string[]) =>
      prev.includes(key)
        ? prev.filter((taskId: string) => taskId !== key)
        : [...prev, key]
    );
  };

  const getModeTab = () => {
    if (groups) {
      const mode =
        groups && groups.find((x: any) => x?.myGroupName === selectedTab)?.mode;
      const type = groups.find(
        (x: any) => x?.myGroupName === selectedTab
      )?.type;
      return {
        mode: mode,
        type: type,
      };
    }
  };

  const handleTogglePlay = (key: string) => {
    setPlayingTasks((prev: any) => {
      let newPlayingTasks = [...prev];

      const toggleTask = (taskId: string, action: "Play" | "Pause") => {
        if (action === "Play") {
          newPlayingTasks.push(taskId);
          const taskToPlay = tasks.find(
            (x: { key: string }) => x.key === taskId
          );
        } else {
          newPlayingTasks = newPlayingTasks.filter(
            (playingId) => playingId !== taskId
          );
        }
      };

      const taskIdsToToggle = selectedTasks.length > 0 ? selectedTasks : [key];

      taskIdsToToggle.forEach((taskId: string) => {
        const action = newPlayingTasks.includes(taskId) ? "Pause" : "Play";
        toggleTask(taskId, action);
      });

      return newPlayingTasks;
    });
  };

  const handleTabsReorder = (newTabs: (string | TaskGroup)[]) => {
    setTaskGroups(newTabs);
  };

  const debounceSave = useCallback(
    (newFormData: {
      numberOfThreads: string | undefined;
      sleepTime: string | undefined;
    }) => {},
    []
  );

  const handleInputChange = (
    e: { target: { value: string } },
    field: string
  ) => {
    setIsTyping(true); // Mark as typing
    const value = e.target.value.trimStart();
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
  };

  const handleInputBlur = () => {
    setIsTyping(false); // User has stopped typing
    debounceSave(formData); // Save when the input loses focus
    setActions(!actions);
  };

  const clearSelectedCategory = () => {
    const updatedTaskGroups = groups.map(
      (group: { myGroupName: string; mode: string }) => ({
        tab: group.myGroupName,
        category: group.mode,
      })
    );

    setSelectedTab(updatedTaskGroups[0].tab || "");
    setTaskGroups(updatedTaskGroups);
    const tasksData =
      groups.find((x: any) => x.myGroupName === updatedTaskGroups[0].tab)
        ?.myGroupTasks || [];
    setTasks(tasksData);
    setClearValues(true);
  };

  const handleSearchCategory = (value: string | string[]) => {
    const values = Array.isArray(value) ? value : [value];
    if (value.length === 0) {
      const updatedTaskGroups = groups.map(
        (group: { myGroupName: string; mode: string }) => ({
          tab: group.myGroupName,
          category: group.mode,
        })
      );

      if (updatedTaskGroups.length > 0) {
        setSelectedTab(updatedTaskGroups[0].tab || "");
        setTaskGroups(updatedTaskGroups);
        const tasksData =
          groups.find((x: any) => x.myGroupName === updatedTaskGroups[0].tab)
            ?.myGroupTasks || [];
        setTasks(tasksData);
      } else {
        setSelectedTab(undefined);
        setTaskGroups([]);
        setTasks([]);
      }
    } else {
      const filteredGroups = groups.filter((group: any) =>
        values.includes(group.mode)
      );
      const updatedTaskGroups = filteredGroups.map(
        (group: { myGroupName: string; mode: string }) => ({
          tab: group.myGroupName,
          category: group.mode,
        })
      );
      const tab = updatedTaskGroups?.[0]?.tab;
      setTaskGroups(updatedTaskGroups);
      setSelectedTab(tab || "");

      const tasksData =
        groups.find((x: any) => x.myGroupName === tab)?.myGroupTasks || [];
      setTasks(tasksData);
    }
    setReCheck(!reCheck);
  };

  const handleInputChangeSearch = (value: string) => {
    setSearchInputAll(value);
    setErrorTab("");
    let matchingGroup = null;
    let matchingTasks = [];

    for (const group of groups) {
      const foundGroupName =
        group.myGroupName.toLowerCase() === value.toLowerCase();
      if (foundGroupName) {
        matchingGroup = group;
        matchingTasks = group.myGroupTasks;
        break;
      }
    }

    if (matchingGroup) {
      setSelectedTab(matchingGroup.myGroupName);
      setTimeout(() => {
        const tabElement = document.getElementById(`tab-${value}`);
        if (tabElement) {
          // Get the position of the tab and container
          const tabRect = tabElement.getBoundingClientRect();
          const containerRect =
            tabContainerRef.current?.getBoundingClientRect();

          if (containerRect) {
            const isTabVisible =
              tabRect.left >= containerRect.left &&
              tabRect.right <= containerRect.right;

            // Scroll into view if the tab is not fully visible
            if (!isTabVisible) {
              tabElement.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
              });
            }
          }
        }
      }, 100);
      setTasks(matchingTasks);
      setShowInput(false);
      setSearchInputAll("");
      setErrorTab("");
    } else {
      setErrorTab(`Group name "${value}" does not exist.`);
    }
  };

  const handleBlur = () => {
    setSearchInputAll("");
    setShowInput(false);
    setErrorTab("");
  };

  return {
    handleAddTab,
    onEditClick,
    onPermanentDeleteClick,
    handleTabClick,
    handleDuplicateTask,
    handleDeleteTasks,
    handleStartAll,
    handleStopAll,
    handleSelectAll,
    handleSelectTask,
    getModeTab,
    handleTogglePlay,
    handleTabsReorder,
    debounceSave,
    handleInputChange,
    handleSearchCategory,
    handleInputChangeSearch,
    handleBlur,
    updateTasksWithAccountData,
    clearSelectedCategory,
    handleInputBlur,
  };
};
