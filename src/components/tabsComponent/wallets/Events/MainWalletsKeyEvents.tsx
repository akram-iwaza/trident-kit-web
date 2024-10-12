import { useEffect } from "react";

const useMainWalletsKeyEvents = (
  state: any,
  functions: any,
  isReady: boolean,
  tabContainerRef: any
) => {
  const {
    createWalletsModal,
    isModalOpenGenerateWallet,
    isDistributeRecollectModalOpen,
    isDeleteModal,
    isModalOpenAddTab,
    setShowInput,
    setIsDistributeRecollectModalOpen,
    setIsModalOpenGenerateWallet,
    setTabValue,
    selectedTab,
    selectedTasks,
    isOpen,
    groups,
    setTaskGroups,
    taskGroups,
    setSelectedTab,
    setTasks,
    setIndexValue,
    indexValue,
    tabValue,
    setCreateWalletsModal,
    setGroups,
  } = state;
  const Pako: any = "";

  const { handleSelectAll, handleAddTab } = functions;

  useEffect(() => {
    if (
      !createWalletsModal.isOpen &&
      !isModalOpenGenerateWallet.isOpen &&
      !isDistributeRecollectModalOpen.isDistrubte &&
      !isDistributeRecollectModalOpen.isRecollect &&
      !isDeleteModal.isOpen &&
      !isModalOpenAddTab.isOpen
    ) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key.toLowerCase() === "f") {
          setShowInput(true);
        } else if (event.ctrlKey && event.key.toLowerCase() === "a") {
          event.preventDefault();
          handleSelectAll();
        } else if (event.ctrlKey && event.key.toLowerCase() === "t") {
          event.preventDefault();
          handleAddTab();
        } else if (event.ctrlKey && event.key.toLowerCase() === "l") {
          event.preventDefault();
          if (taskGroups && taskGroups.length > 0) {
            setIsDistributeRecollectModalOpen({
              isDistrubte: false,
              isRecollect: true,
            });
          }
        } else if (event.ctrlKey && event.key.toLowerCase() === "d") {
          event.preventDefault();
          if (taskGroups && taskGroups.length > 0) {
            setIsDistributeRecollectModalOpen({
              isDistrubte: true,
              isRecollect: false,
            });
          }
        } else if (event.ctrlKey && event.key.toLowerCase() === "g") {
          event.preventDefault();
          if (taskGroups && taskGroups.length > 0) {
            setIsModalOpenGenerateWallet({
              isOpen: true,
              tabName: selectedTab,
            });
          }
        } else if (event.ctrlKey && event.key.toLowerCase() === "c") {
          event.preventDefault();
          setTabValue(selectedTab);
          setCreateWalletsModal({
            isOpen: true,
            tabName: selectedTab,
          });
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [
    createWalletsModal,
    isModalOpenGenerateWallet,
    isDistributeRecollectModalOpen,
    isDeleteModal,
    isModalOpenAddTab,
    setShowInput,
    setIsDistributeRecollectModalOpen,
    setIsModalOpenGenerateWallet,
    setTabValue,
    selectedTab,
    selectedTasks,
    handleSelectAll,
    handleAddTab,
    setCreateWalletsModal,
  ]);

  useEffect(() => {
    if (groups && groups.length > 0) {
      const groupNames = groups.map(
        (group: { myGroupName: string }) => group.myGroupName
      );
      setTaskGroups(groupNames);

      if (indexValue) {
        setSelectedTab(groups[indexValue].myGroupName);
        if (groups[indexValue].myGroupName) {
          setTimeout(() => {
            const tabElement = document.getElementById(
              `tab-${groups[indexValue].myGroupName}`
            );
            console.log("tabElement indexValue : ", tabElement);
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
        setTasks(groups[indexValue].myGroupWallets);
      } else if (tabValue) {
        const index = groups.findIndex(
          (group: { myGroupName: string }) => group.myGroupName === tabValue
        );
        setSelectedTab(groups[index].myGroupName);
        if (groups[index].myGroupName) {
          setTimeout(() => {
            const tabElement = document.getElementById(
              `tab-${groups[index].myGroupName}`
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
        setTasks(groups[index].myGroupWallets);
      } else {
        setSelectedTab(groups[0].myGroupName);
        if (groups[0].myGroupName) {
          setTimeout(() => {
            const tabElement = document.getElementById(
              `tab-${groups[0].myGroupName}`
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
        setTasks(groups[0].myGroupWallets);
      }
    }
    setIndexValue(null);
    setTabValue(undefined);
  }, [groups]);
};

export default useMainWalletsKeyEvents;
