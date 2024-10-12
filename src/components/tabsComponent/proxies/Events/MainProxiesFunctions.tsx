import { useCallback } from "react";
import { toast } from "../../../ui/use-toast";
import { getRandomNumber } from "../../../../lib/utils";

declare global {
  interface Window {
    electron: any;
  }
}

export const useMainProxiesFunctions = (state: any, tabContainerRef: any) => {
  const {
    groups,
    setActions,
    actions,
    proxies,
    setProxies,
    setPlayingTasks,
    selectedTasks,
    setSelectedTasks,
    selectedTab,
    setSelectedTab,
    taskStatuses,
    setTaskGroups,
    setIsModalOpenAddTab,
    setIsDeleteModal,
    setTabValue,
    setCreateProxiesModal,
    setSearchInputAll,
    setShowInput,
    setErrorTab,
    setIndexValue,
    setIsDeleteTaskModal,
    setGroups,
  } = state;

  const handleAddTab = useCallback(() => {
    setIsModalOpenAddTab({
      isOpen: true,
      tab: undefined,
    });
  }, [setIsModalOpenAddTab]);

  const onEditClick = (value: string, newTabName: String) => {
    const updatedGroups = groups.map(
      (group: { myGroupName: string; mode: any; type: any }) =>
        group.myGroupName === value
          ? {
              ...group,
              myGroupName: newTabName,
            }
          : group
    );
    localStorage.setItem("groupsProxy", JSON.stringify(updatedGroups));
    toast({
      variant: "success",
      title: "Edited Group Name ",
    });
  };

  const onDeleteClick = useCallback(
    (value: string) => {
      setIsDeleteModal({
        isOpen: true,
        name: value,
      });
      setActions(!actions);
    },
    [setIsDeleteModal]
  );
  const onPermanentDeleteClick = (value: string) => {
    const isLastGroup = groups && groups.length === 1;

    if (isLastGroup) {
      setGroups([]);
      setProxies([]);
      setTaskGroups([]);
    }

    toast({
      variant: "success",
      title: "Group Name Deleted Successfully",
    });
    setActions(!actions);
  };

  const handleTabClick = useCallback(
    (tabName: string) => {
      setSelectedTasks([]);
      setSelectedTab(tabName);
      const selectedGroup = groups.find(
        (group: { myGroupName: string }) => group.myGroupName === tabName
      );
      if (selectedGroup) {
        setProxies(selectedGroup.myGroupProxies);
      }
      setTimeout(() => {
        const tabElement = document.getElementById(`tab-${tabName}`);
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
    },
    [groups, setProxies, setSelectedTab, setSelectedTasks]
  );

  const handleDuplicateTask = useCallback(
    (key: string) => {
      // Combine selectedTasks and the current key to create a set of unique keys
      const uniqueKeys = Array.from(new Set([...selectedTasks, key]));
      const storedWallets = localStorage.getItem("groupsProxy");
      let groupsProxy = storedWallets ? JSON.parse(storedWallets) : [];

      console.log("uniqueKeys : ", uniqueKeys);
      console.log("groupsProxy : ", groupsProxy);

      // Find the group that contains the wallet with the matching key
      groupsProxy = groupsProxy.map((group: any) => {
        // Find the wallet in myGroupWallets that matches the key
        const walletToDuplicate = group.myGroupProxies.find(
          (wallet: any) => wallet.key === key
        );

        if (walletToDuplicate) {
          // Create a new wallet object with a different key
          const duplicatedWallet = {
            ...walletToDuplicate, // Copy all the properties
            key: generateUniqueKey(), // Assign a new unique key
          };

          // Add the duplicated wallet to the group
          return {
            ...group,
            myGroupProxies: [...group.myGroupProxies, duplicatedWallet],
          };
        }

        // If no wallet matches, return the group unchanged
        return group;
      });

      // Save the updated groupsWallet back to localStorage
      localStorage.setItem("groupsProxy", JSON.stringify(groupsProxy));

      console.log("Duplicated wallet saved to localStorage:", groupsProxy);
      setActions(!actions);
    },
    [selectedTasks]
  );

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

  const handleEditProxy = useCallback(
    (rowKey: string, proxy: string) => {
      setTabValue(selectedTab);
      setCreateProxiesModal({
        isOpen: true,
        tabName: selectedTab,
        rowKey: rowKey,
        proxy: proxy,
      });
      setActions(!actions);
    },
    [selectedTab, setTabValue, setCreateProxiesModal]
  );

  const handleDeleteProxies = useCallback(
    (rowKey: string | string[], setDeleteProxies?: any) => {
      // Create a set of keys to delete (rowKey and selectedTasks combined)
      const combinedKeysSet = new Set([...selectedTasks, rowKey]);
      const combinedKeysArray = Array.from(combinedKeysSet);

      // Get existing wallets from localStorage
      const storedWallets = localStorage.getItem("groupsProxy");
      let groupsProxy = storedWallets ? JSON.parse(storedWallets) : [];

      // Iterate over each group and remove wallets with keys in combinedKeysArray
      groupsProxy = groupsProxy.map((group: any) => {
        return {
          ...group,
          myGroupProxies: group.myGroupProxies.filter(
            (wallet: any) => !combinedKeysArray.includes(wallet.key)
          ),
        };
      });

      // Save updated groupsProxy back to localStorage
      localStorage.setItem("groupsProxy", JSON.stringify(groupsProxy));

      // Notify user and close modal
      setTabValue(selectedTab);
      toast({
        variant: "success",
        title: "Deleted Wallets Successfully",
      });
      setIsDeleteTaskModal({
        isOpen: false,
        task: "",
      });
      setActions(!actions);
    },
    [selectedTasks, selectedTab, setTabValue]
  );

  const RUtils: any = "";

  const handleStartAll = useCallback(
    (groups: any) => {
      const allTaskKeys =
        selectedTasks.length > 0
          ? selectedTasks
          : proxies.map((task: { key: string }) => task.key);

      setPlayingTasks(allTaskKeys);

      allTaskKeys.forEach((ProxiesKey: string | number) => {
        const formattedProxy = proxies
          .filter((task: { key: string }) => task.key === ProxiesKey)
          .map(
            (task: { USERNAME: any; PASSWORD: any; IP: any; PORT: any }) =>
              `${task.USERNAME}:${task.PASSWORD}@${task.IP}:${task.PORT}`
          )[0];

        taskStatuses[ProxiesKey] = "Testing";
      });
    },
    [proxies, selectedTasks, setPlayingTasks, taskStatuses]
  );

  const getProxyString = (proxyKey: any, groups: any) => {
    for (const group of groups) {
      const { myGroupProxies } = group;
      for (const proxy of myGroupProxies) {
        if (proxy.key === proxyKey) {
          return `${proxy.USERNAME}:${proxy.PASSWORD}@${proxy.IP}:${proxy.PORT}`;
        }
      }
    }
    return null;
  };

  const handleTogglePlay = useCallback(
    (key: string, groups: any) => {
      setPlayingTasks((prev: string[]) => {
        const toggleTasks = (tasks: string[], taskId: string) =>
          tasks.includes(taskId)
            ? tasks.filter((id) => id !== taskId)
            : [...tasks, taskId];

        const isPlaying = prev.includes(key);

        if (isPlaying) {
          return prev.filter((taskId: string) => taskId !== key);
        } else {
          let newPlayingTasks =
            selectedTasks.length > 0
              ? selectedTasks.reduce(toggleTasks, [...prev])
              : toggleTasks(prev, key);

          newPlayingTasks.forEach((Proxies: string) => {
            taskStatuses[Proxies] = "Testing";
          });

          return newPlayingTasks;
        }
      });
    },
    [selectedTasks, setPlayingTasks, taskStatuses]
  );

  const handleSelectAll = useCallback(() => {
    if (selectedTasks.length === proxies.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(proxies.map((task: { key: string }) => task.key));
    }
  }, [proxies, selectedTasks]);

  const handleSelectTask = useCallback((key: string) => {
    setSelectedTasks((prev: string[]) =>
      prev.includes(key)
        ? prev.filter((taskId: string) => taskId !== key)
        : [...prev, key]
    );
  }, []);

  const handleTabsReorder = useCallback(
    (newTabs: (string | TaskGroup)[]) => {
      setTaskGroups(newTabs);
    },
    [setTaskGroups]
  );

  // const handleInputChangeSearch = useCallback(
  //     (value: string) => {
  //         setSearchInputAll(value);
  //         setErrorTab('');
  //         let matchingGroup = null;
  //         let matchingTasks = [];

  //         for (const group of groups) {
  //             const foundGroupName =
  //                 group.myGroupName.toLowerCase() === value.toLowerCase();
  //             if (foundGroupName) {
  //                 matchingGroup = group;
  //                 matchingTasks = group.myGroupProxies;
  //                 break;
  //             }
  //         }

  //         if (matchingGroup) {
  //             setSelectedTab(matchingGroup.myGroupName);
  //             setProxies(matchingTasks);
  //             setShowInput(false);
  //             setSearchInputAll('');
  //             setErrorTab('');
  //         } else {
  //             setErrorTab(`Group name "${value}" does not exist.`);
  //         }
  //     },
  //     [setSearchInputAll, setErrorTab],
  // );

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
        matchingTasks = group.myGroupProxies;
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
      setProxies(matchingTasks);
      setShowInput(false);
      setSearchInputAll("");
      setErrorTab("");
    } else {
      setErrorTab(`Group name "${value}" does not exist.`);
    }
  };

  const handleBlur = useCallback(() => {
    setSearchInputAll("");
    setShowInput(false);
    setErrorTab("");
  }, [setSearchInputAll, setShowInput, setErrorTab]);

  return {
    handleAddTab,
    onEditClick,
    onDeleteClick,
    onPermanentDeleteClick,
    handleTabClick,
    handleDuplicateTask,
    handleEditProxy,
    handleDeleteProxies,
    handleStartAll,
    handleTogglePlay,
    handleSelectAll,
    handleSelectTask,
    handleTabsReorder,
    handleInputChangeSearch,
    handleBlur,
  };
};
