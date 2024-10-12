import React, { useEffect } from "react";
import { toast } from "../../../ui/use-toast";

const MainAccountKeyEvents = (
  state: any,
  functions: any,
  isReady: boolean,
  tabContainerRef: any
) => {
  const {
    isDeleteModal,
    isModalOpenAddTab,
    setShowInput,
    setTabValue,
    selectedTab,
    selectedTasks,
    groups,
    setTaskGroups,
    setSelectedTab,
    setTasks,
    setIndexValue,
    indexValue,
    tabValue,
    isModalOpenImportAccounts,
    isOpenMassLinkModal,
    createAccountsModal,
    setSearchInput,
    tasks,
    setIsOpenMassLinkModal,
    setSearchInputAll,
    setErrorTab,
    showInput,
    inputRef,
    searchInputAll,
    setCreateAccountsModal,
    setIsModalOpenImportAccounts,
    taskGroups,
  } = state;
  const RemoteSettings: any = "";
  const { handleSelectAll, handleAddTab, getCategory } = functions;

  useEffect(() => {
    if (!groups || groups.length === 0) return;

    const updatedTaskGroups = groups.map(
      (group: { myGroupName: string; mainCategory: string }) => ({
        tab: group.myGroupName,
        category: group.mainCategory,
      })
    );
    setTaskGroups(updatedTaskGroups);

    let selectedIndex = 0;

    if (indexValue !== null && indexValue !== undefined) {
      selectedIndex = indexValue;
    } else if (tabValue) {
      const foundIndex = groups.findIndex(
        (group: { myGroupName: string }) => group.myGroupName === tabValue
      );
      selectedIndex = foundIndex !== -1 ? foundIndex : 0;
    }

    setSelectedTab(groups[selectedIndex]?.myGroupName);
    if (groups && groups[selectedIndex] && groups[selectedIndex].myGroupName) {
      setTimeout(() => {
        const tabElement = document.getElementById(
          `tab-${groups[selectedIndex].myGroupName}`
        );
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
    }

    const allTasks = groups[selectedIndex]?.myGroupAccounts || [];
    setTasks(allTasks);
  }, [groups]);

  useEffect(() => {
    if (
      !isModalOpenImportAccounts.isOpen &&
      !isOpenMassLinkModal.isOpen &&
      !createAccountsModal.isOpen &&
      !isModalOpenAddTab.isOpen &&
      !isDeleteModal.isOpen
    ) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.ctrlKey &&
          event.shiftKey &&
          event.key.toLowerCase() === "f"
        ) {
          setShowInput(true);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [
    isModalOpenImportAccounts,
    isModalOpenAddTab,
    isDeleteModal,
    isOpenMassLinkModal,
    createAccountsModal,
  ]);

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowInput(false);
        setSearchInputAll("");
        setErrorTab("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && searchInputAll) {
        let matchingGroup = null;
        let matchingAccounts = [];
        let foundAccount = false;
        let foundGroupName = false;

        for (const group of groups) {
          foundAccount = group.myGroupAccounts.some(
            (account: { accountName: string }) =>
              account.accountName.toLowerCase() === searchInputAll.toLowerCase()
          );
          foundGroupName =
            group.myGroupName.toLowerCase() === searchInputAll.toLowerCase();

          if (foundAccount || foundGroupName) {
            matchingGroup = group;
            matchingAccounts = group.myGroupAccounts;
            break;
          }
        }

        if (matchingGroup) {
          setSelectedTab(matchingGroup.myGroupName);
          setTasks(matchingAccounts);
          if (foundAccount) {
            setSearchInput(searchInputAll);
          }
          setShowInput(false);
          setSearchInputAll("");
          setErrorTab("");
        } else {
          setErrorTab(
            `Group or account with name "${searchInputAll}" does not exist.`
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [searchInputAll, groups]);

  useEffect(() => {
    const handleKeyDown = (event: {
      ctrlKey: any;
      key: string;
      preventDefault: () => void;
    }) => {
      if (
        !isModalOpenImportAccounts.isOpen &&
        !isOpenMassLinkModal.isOpen &&
        !createAccountsModal.isOpen &&
        !isModalOpenAddTab.isOpen &&
        !isDeleteModal.isOpen
      ) {
        if (event.ctrlKey && event.key.toLowerCase() === "a") {
          event.preventDefault();
          handleSelectAll();
        } else if (event.ctrlKey && event.key.toLowerCase() === "t") {
          event.preventDefault();
          handleAddTab();
        } else if (event.ctrlKey && event.key.toLowerCase() === "l") {
          event.preventDefault();
          if (taskGroups.length === 0) {
            toast({
              variant: "destructive",
              title: "A group name with a specific category is required",
            });
          }
          if (tasks.length === 0) {
            toast({
              variant: "destructive",
              title: "Please ensure you have the necessary accounts",
            });
          } else {
            setTabValue(selectedTab);
            setIsOpenMassLinkModal({
              isOpen: true,
              tabName: selectedTab,
              category: getCategory(),
            });
          }
        } else if (event.ctrlKey && event.key.toLowerCase() === "c") {
          event.preventDefault();
          if (taskGroups.length === 0) {
            toast({
              variant: "destructive",
              title: "A group name with a specific category is required",
            });
          } else {
            setTabValue(selectedTab);
            setCreateAccountsModal({
              isOpen: true,
              tabName: selectedTab,
            });
          }
        } else if (event.ctrlKey && event.key.toLowerCase() === "i") {
          event.preventDefault();
          if (taskGroups.length === 0) {
            toast({
              variant: "destructive",
              title: "A group name with a specific category is required",
            });
          } else if (!["Twitter", "Discord"].includes(getCategory())) {
            toast({
              variant: "destructive",
              title: 'Invalid Group Name: Must Be "Twitter" or "Discord"',
              description:
                'Please ensure the group name category is set to "Twitter" or "Discord" to proceed.',
            });
          } else {
            setTabValue(selectedTab);
            setIsModalOpenImportAccounts({
              groupName: selectedTab,
              isOpen: true,
            });
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectedTasks,
    getCategory,
    isModalOpenImportAccounts,
    isModalOpenAddTab,
    isDeleteModal,
    isOpenMassLinkModal,
    createAccountsModal,
  ]);
};

export default MainAccountKeyEvents;
