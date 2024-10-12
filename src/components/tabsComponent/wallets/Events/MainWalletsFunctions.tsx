import { useCallback } from "react";
import { toast } from "../../../ui/use-toast";

declare global {
  interface Window {
    electron: any;
  }
}

export const useMainWalletsFunctions = (state: any, tabContainerRef: any) => {
  const {
    groups,
    actions,
    setActions,
    setGroups,
    tasks,
    setTasks,
    selectedTasks,
    setSelectedTasks,
    selectedTab,
    setSelectedTab,
    setTaskGroups,
    setIsModalOpenAddTab,
    setIsDeleteModal,
    setTabValue,
    setCreateWalletsModal,
    setSearchInputAll,
    setShowInput,
    setErrorTab,
    setIndexValue,
    setIsDeleteTaskModal,
    setPrivateKeyVisibility,
    arePrivateKeysVisible,
    setArePrivateKeysVisible,
  } = state;

  const togglePrivateKeyVisibility = (index: number) => {
    setPrivateKeyVisibility((prevVisibility: any[]) => ({
      ...prevVisibility,
      [index]: !prevVisibility[index],
    }));
  };

  const toggleAllPrivateKeysVisibility = () => {
    setArePrivateKeysVisible(!arePrivateKeysVisible);
    setPrivateKeyVisibility((prevVisibility: any) => {
      const newVisibility: { [key: number]: boolean } = {};
      tasks.forEach((_: any, index: any) => {
        newVisibility[index] = !arePrivateKeysVisible;
      });
      return newVisibility;
    });
  };

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
    localStorage.setItem("groupsWallet", JSON.stringify(updatedGroups));
    toast({
      variant: "success",
      title: "Edited Group Name ",
    });
    setActions(!actions);
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

    setIsDeleteModal({
      isOpen: false,
      name: undefined,
    });
    toast({
      variant: "success",
      title: "Group Name Deleted Successfully",
    });
    setActions(!actions);
  };

  const handleTabClick = useCallback(
    (tabName: string) => {
      console.log("tabName : ", tabName);

      setSelectedTab(tabName);
      const selectedGroup = groups.find(
        (group: { myGroupName: string }) => group.myGroupName === tabName
      );
      if (selectedGroup) {
        setTasks(selectedGroup.myGroupWallets);
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
    [groups, setTasks, setSelectedTab]
  );

  const handleDuplicateTask = (key: string) => {
    // Combine selectedTasks and the current key to create a set of unique keys
    const uniqueKeys = Array.from(new Set([...selectedTasks, key]));
    const storedWallets = localStorage.getItem("groupsWallet");
    let groupsWallet = storedWallets ? JSON.parse(storedWallets) : [];

    console.log("uniqueKeys : ", uniqueKeys);
    console.log("groupsWallet : ", groupsWallet);

    // Find the group that contains the wallet with the matching key
    groupsWallet = groupsWallet.map((group: any) => {
      // Find the wallet in myGroupWallets that matches the key
      const walletToDuplicate = group.myGroupWallets.find(
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
          myGroupWallets: [...group.myGroupWallets, duplicatedWallet],
        };
      }

      // If no wallet matches, return the group unchanged
      return group;
    });

    // Save the updated groupsWallet back to localStorage
    localStorage.setItem("groupsWallet", JSON.stringify(groupsWallet));

    console.log("Duplicated wallet saved to localStorage:", groupsWallet);
    setActions(!actions);
  };

  // Function to generate a unique key (UUID)
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

  const handleEditWallet = useCallback(
    (rowKey: string, wallet: string, address: string, balance: string) => {
      setTabValue(selectedTab);
      setCreateWalletsModal({
        isOpen: true,
        tabName: selectedTab,
        rowKey: rowKey,
        proxy: wallet,
        address: address,
        balance: balance,
      });
      setActions(!actions);
    },
    [selectedTab, setTabValue, setCreateWalletsModal]
  );

  const handleDeleteWallet = (rowKey: string | string[]) => {
    // Create a set of keys to delete (rowKey and selectedTasks combined)
    const combinedKeysSet = new Set([...selectedTasks, rowKey]);
    const combinedKeysArray = Array.from(combinedKeysSet);

    // Get existing wallets from localStorage
    const storedWallets = localStorage.getItem("groupsWallet");
    let groupsWallet = storedWallets ? JSON.parse(storedWallets) : [];

    // Iterate over each group and remove wallets with keys in combinedKeysArray
    groupsWallet = groupsWallet.map((group: any) => {
      return {
        ...group,
        myGroupWallets: group.myGroupWallets.filter(
          (wallet: any) => !combinedKeysArray.includes(wallet.key)
        ),
      };
    });

    // Save updated groupsWallet back to localStorage
    localStorage.setItem("groupsWallet", JSON.stringify(groupsWallet));

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
  };

  const handleSelectAll = useCallback(() => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map((task: { key: string }) => task.key));
    }
  }, [tasks, selectedTasks]);

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
        matchingTasks = group.myGroupWallets;
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
    handleEditWallet,
    handleDeleteWallet,
    handleSelectAll,
    handleSelectTask,
    handleTabsReorder,
    handleInputChangeSearch,
    handleBlur,
    togglePrivateKeyVisibility,
    toggleAllPrivateKeysVisibility,
  };
};
