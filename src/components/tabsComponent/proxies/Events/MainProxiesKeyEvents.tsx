import { useEffect } from "react";

const MainProxiesKeyEvents = (
  state: any,
  functions: any,
  isReady: boolean,
  tabContainerRef: any
) => {
  const {
    isDeleteModal,
    isModalOpenAddTab,
    setShowInput,
    isOpen,
    setTabValue,
    selectedTab,
    selectedTasks,
    groups,
    setTaskGroups,
    setSelectedTab,
    taskStatuses,
    setIndexValue,
    indexValue,
    tabValue,
    setPlayingTasks,
    setProxies,
    createProxiesModal,
    setCreateProxiesModal,
    setSearchInputAll,
    setErrorTab,
    showInput,
    inputRef,
    searchInputAll,
  } = state;

  const { handleSelectAll, handleAddTab, handleStartAll } = functions;

  useEffect(() => {
    const completedTaskKeys = Object.keys(taskStatuses).filter((key) =>
      taskStatuses[key].includes("ms")
    );

    if (completedTaskKeys.length > 0) {
      setPlayingTasks((prevPlayingTasks: any[]) =>
        prevPlayingTasks.filter(
          (taskId: { toString: () => string }) =>
            !completedTaskKeys.includes(taskId.toString())
        )
      );
    }
  }, [taskStatuses]);

  useEffect(() => {
    if (groups && groups.length > 0) {
      const groupNames = groups.map(
        (group: { myGroupName: string }) => group.myGroupName
      );
      setTaskGroups(groupNames);

      if (indexValue !== null && indexValue < groups.length) {
        setSelectedTab(groups[indexValue].myGroupName);
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
        setProxies(groups[indexValue].myGroupProxies);
      } else if (tabValue) {
        const index = groups.findIndex(
          (group: { myGroupName: string }) => group.myGroupName === tabValue
        );
        if (index !== -1) {
          setSelectedTab(groups[index].myGroupName);
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
          setProxies(groups[index].myGroupProxies);
        } else {
          // Handle case where tabValue does not match any group
          setSelectedTab(groups[0].myGroupName);
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
          setProxies(groups[0].myGroupProxies);
        }
      } else {
        setSelectedTab(groups[0].myGroupName);
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
        setProxies(groups[0].myGroupProxies);
      }
    }
    setIndexValue(null);
    setTabValue(undefined);
  }, [groups]);

  useEffect(() => {
    if (
      !createProxiesModal.isOpen &&
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
  }, [createProxiesModal, isModalOpenAddTab, isDeleteModal]);

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
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && searchInputAll) {
        let matchingGroup: any = null;
        let matchingTasks = [];

        for (const group of groups) {
          const foundGroupName =
            group.myGroupName.toLowerCase() === searchInputAll.toLowerCase();
          if (foundGroupName) {
            matchingGroup = group;
            matchingTasks = group.myGroupProxies;
            break;
          }
        }

        if (matchingGroup) {
          setSelectedTab(matchingGroup.myGroupName);
          setTimeout(() => {
            const tabElement = document.getElementById(
              `tab-${matchingGroup.myGroupName}`
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
          setProxies(matchingTasks);
          setShowInput(false);
          setSearchInputAll("");
          setErrorTab("");
        } else {
          setErrorTab(`Group name "${searchInputAll}" does not exist.`);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [searchInputAll, groups]);
};

export default MainProxiesKeyEvents;
