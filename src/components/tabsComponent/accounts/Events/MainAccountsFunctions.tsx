import { toast } from "../../../ui/use-toast";

declare global {
  interface Window {
    electron: any;
  }
}

export const useMainAccountsFunctions = (state: any, tabContainerRef: any) => {
  const {
    actions,
    setActions,
    tasks,
    setTasks,
    selectedTasks,
    setSelectedTasks,
    selectedTab,
    setSelectedTab,
    taskGroups,
    setTaskGroups,
    setIsModalOpenAddTab,
    setIsDeleteModal,
    setTabValue,
    setCreateAccountsModal,
    groups,
    setErrorTab,
    setSearchInputAll,
    setShowInput,
    setIndexValue,
    setClearValues,
    setIsDeleteTaskModal,
    setSearchInput,
    setGroups,
  } = state;

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

  const handleAddTab = () => {
    setIsModalOpenAddTab({
      isOpen: true,
      tab: undefined,
    });
    setActions(!actions);
  };

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
    localStorage.setItem("groupsAccount", JSON.stringify(updatedGroups));
    toast({
      variant: "success",
      title: "Edited Group Name ",
    });
    setActions(!actions);
  };

  const onDeleteClick = (value: string) => {
    setIsDeleteModal({
      isOpen: true,
      name: value,
    });
    setActions(!actions);
  };

  const onPermanentDeleteClick = (value: string) => {
    const isLastGroup = groups && groups.length === 1;
    if (taskGroups.length === 1) {
      setTasks([]);
      setTaskGroups([]);
    }
    if (isLastGroup) {
      setGroups([]);
      setTaskGroups([]);
    }

    toast({
      variant: "success",
      title: "Group Name Deleted Successfully",
    });
    clearSelectedCategory();
    setActions(!actions);
  };

  const handleTabClick = (tabName: string) => {
    setSelectedTab(tabName);
    const selectedGroup = groups.find(
      (group: { myGroupName: string }) => group.myGroupName === tabName
    );
    if (selectedGroup) {
      setTasks(selectedGroup.myGroupAccounts);
    }
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
    setActions(!actions);
  };

  const handleDuplicateTask = (key: string) => {
    const uniqueKeys = Array.from(new Set([...selectedTasks, key]));
    const storedAccount = localStorage.getItem("groupsAccount");
    let groupsAccount = storedAccount ? JSON.parse(storedAccount) : [];

    console.log("uniqueKeys: ", uniqueKeys);
    console.log("groupsAccount: ", groupsAccount);

    // Iterate over groupsAccount to find the group containing the account with the matching key
    const updatedGroupsAccount = groupsAccount.map((group: any) => {
      // Find the account with the matching key within the group's accounts
      const accountToDuplicate = group.myGroupAccounts.find(
        (account: any) => account.key === key
      );

      if (accountToDuplicate) {
        // Create a duplicate account with a new unique key
        const duplicatedAccount = {
          ...accountToDuplicate, // Copy all properties
          key: generateUniqueKey(), // Generate a new unique key
        };

        // Add the duplicated account to myGroupAccounts
        return {
          ...group,
          myGroupAccounts: [...group.myGroupAccounts, duplicatedAccount],
        };
      }

      return group; // Return the group unchanged if no matching account is found
    });

    // Save the updated groupsAccount back to localStorage
    localStorage.setItem("groupsAccount", JSON.stringify(updatedGroupsAccount));

    console.log(
      "Duplicated account saved to localStorage:",
      updatedGroupsAccount
    );
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

  const handleEditAccount = (rowKey: string, form: any) => {
    setTabValue(selectedTab);
    setCreateAccountsModal({
      isOpen: true,
      tabName: selectedTab,
      rowKey: rowKey,
      form: form,
    });
    setActions(!actions);
  };

  const handleDeleteAccount = (rowKey: string | string[]) => {
    // Combine selectedTasks and rowKey to create a set of unique keys
    const combinedKeysSet = new Set([...selectedTasks, rowKey]);
    const combinedKeysArray = Array.from(combinedKeysSet);

    // Get existing accounts from localStorage
    const storedAccount = localStorage.getItem("groupsAccount");
    let groupsAccount = storedAccount ? JSON.parse(storedAccount) : [];

    console.log("combinedKeysArray: ", combinedKeysArray);
    console.log("groupsAccount: ", groupsAccount);

    // Iterate through all groupsAccount and remove the accounts that match the keys
    const updatedGroupsAccount = groupsAccount.map((group: any) => {
      // Filter out accounts in the current group that match the keys in combinedKeysArray
      return {
        ...group,
        myGroupAccounts: group.myGroupAccounts.filter(
          (account: any) => !combinedKeysArray.includes(account.key)
        ),
      };
    });

    // Save the updated groupsAccount back to localStorage
    localStorage.setItem("groupsAccount", JSON.stringify(updatedGroupsAccount));

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

    setTabValue(selectedTab);
    setActions(!actions);
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

  const getCategory = () => {
    return (
      taskGroups &&
      taskGroups.find((x: { tab: string }) => x.tab === selectedTab)?.category
    );
  };

  const getCategoryTasks = () => {
    return (
      tasks && tasks.find((x: { category: string }) => x.category)?.category
    );
  };

  const handleTabsReorder = (newTabs: any) => {
    const updatedTaskGroups = newTabs
      .map((tabName: { tab: string }) =>
        taskGroups.find(
          (taskGroup: { tab: string }) => taskGroup.tab === tabName.tab
        )
      )
      .filter(
        (taskGroup: undefined): taskGroup is any => taskGroup !== undefined
      );

    setTaskGroups(updatedTaskGroups);
  };

  const handleInputChangeOnly = (mainValue: any) => {
    console.log("mainValue qwer: ", mainValue);
    const value = mainValue.target.value;
    setSearchInputAll(value);
    setErrorTab("");
    let matchingGroup = null;
    let foundAccount = false;
    let foundGroupName = false;
    let matchingAccounts = [];

    for (const group of groups) {
      foundAccount = group.myGroupAccounts.some(
        (account: { accountName: string }) =>
          account.accountName.toLowerCase() === value.toLowerCase()
      );
      foundGroupName = group.myGroupName.toLowerCase() === value.toLowerCase();

      if (foundAccount || foundGroupName) {
        matchingGroup = group;
        matchingAccounts = group.myGroupAccounts;
        break;
      }
    }

    if (!matchingGroup) {
      setErrorTab(`Group or account with name "${value}" does not exist.`);
    }
  };
  const handleInputChange = (value: string) => {
    setSearchInputAll(value);
    setErrorTab("");

    let matchingGroup = null;
    let matchingAccounts = [];
    let foundAccount = false;
    let foundGroupName = false;

    for (const group of groups) {
      foundAccount = group.myGroupAccounts.some(
        (account: { accountName: string }) =>
          account.accountName &&
          account.accountName.toLowerCase() === value.toLowerCase()
      );
      foundGroupName =
        group.myGroupName &&
        group.myGroupName.toLowerCase() === value.toLowerCase();

      if (foundAccount || foundGroupName) {
        matchingGroup = group;
        matchingAccounts = group.myGroupAccounts;
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
      setTasks(matchingAccounts);
      if (foundAccount) {
        setSearchInput(value);
      }
      setShowInput(false);
      setSearchInputAll("");
      setErrorTab("");
    } else {
      setErrorTab(`Group or account with name "${value}" does not exist.`);
    }
  };

  const handleBlur = () => {
    setSearchInputAll("");
    setShowInput(false);
    setErrorTab("");
  };

  const handleSearchCategory = (value: string | string[]) => {
    const values = Array.isArray(value) ? value : [value];
    if (value.length === 0) {
      const updatedTaskGroups = groups.map(
        (group: { myGroupName: string; mainCategory: string }) => ({
          tab: group.myGroupName,
          category: group.mainCategory,
        })
      );

      if (updatedTaskGroups.length > 0) {
        setSelectedTab(updatedTaskGroups[0].tab || "");
        setTaskGroups(updatedTaskGroups);
        const tasksData =
          groups.find((x: any) => x.myGroupName === updatedTaskGroups[0].tab)
            ?.myGroupAccounts || [];
        setTasks(tasksData);
      } else {
        setSelectedTab(undefined);
        setTaskGroups([]);
        setTasks([]);
      }
    } else {
      const filteredGroups = groups.filter((group: any) =>
        values.includes(group.mainCategory)
      );
      const updatedTaskGroups = filteredGroups.map(
        (group: { myGroupName: string; mainCategory: string }) => ({
          tab: group.myGroupName,
          category: group.mainCategory,
        })
      );
      const tab = updatedTaskGroups?.[0]?.tab;
      setTaskGroups(updatedTaskGroups);
      setSelectedTab(tab || "");

      const tasksData =
        groups.find((x: any) => x.myGroupName === tab)?.myGroupAccounts || [];
      setTasks(tasksData);
    }
  };

  return {
    handleAddTab,
    onEditClick,
    onDeleteClick,
    onPermanentDeleteClick,
    handleTabClick,
    handleDuplicateTask,
    handleEditAccount,
    handleDeleteAccount,
    handleSelectAll,
    handleSelectTask,
    getCategory,
    getCategoryTasks,
    handleTabsReorder,
    handleInputChange,
    handleBlur,
    handleSearchCategory,
    handleInputChangeOnly,
    clearSelectedCategory,
  };
};
