import { useEffect } from "react";
import { toast } from "../../../ui/use-toast";
import useFetchV3 from "../../../../hooks/useFetchV3";

const useMainTasksKeyEvents = (
  state: any,
  functions: any,
  isReady: boolean,
  searchedValue: any,
  tabContainerRef: any
) => {
  const {
    actions,
    setActions,
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
    setPlayingTasks,
    setFormData,
    isModalOpenEditTask,
    isDeleteTaskModal,
    isModalOpenCreateTask,
    setSearchInputAll,
    setErrorTab,
    showInput,
    inputRef,
    searchInputAll,
    timeoutRef,
    isRunning,
    taskGroups,
    setIsModalOpenCreateTask,
    dataSettings,
    tasks,
    playingTasks,
    setIsDisabledStartAll,
    playingKeys,
    reCheck,
    setIsDeleteTaskModal,
  } = state;

  const {
    handleSelectAll,
    handleAddTab,
    handleStopAll,
    handleStartAll,
    getModeTab,
    updateTasksWithAccountData,
  } = functions;

  const { data: AccountsData } = useFetchV3<IGroupAccounts[]>("MyAccountsData");

  useEffect(() => {
    if (playingTasks.length === 0 && playingKeys.length > 0) {
      setPlayingTasks(playingKeys);
    }
  }, [playingTasks, playingKeys]);

  useEffect(() => {
    if (
      getModeTab()?.mode?.toLowerCase() === "multifarm" ||
      getModeTab()?.mode?.toLowerCase() === "qbx"
    ) {
      updateTasksWithAccountData(tasks, AccountsData);
    }
  }, [AccountsData, getModeTab()?.mode, reCheck, tasks.length, selectedTab]);

  useEffect(() => {
    const result =
      tasks &&
      tasks?.every((task: { key: string }) => playingTasks.includes(task.key));
    setIsDisabledStartAll(result);
  }, [tasks, playingTasks]);

  useEffect(() => {
    if (groups && groups.length > 0) {
      const groupNames = groups.map(
        (group: { myGroupName: string }) => group.myGroupName
      );
      const newGroupNames = groups.map(
        (group: { myGroupName: string; mode: string }) => ({
          tab: group.myGroupName,
          category: group.mode,
        })
      );

      setTaskGroups(newGroupNames);

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
        setTasks(groups[indexValue].myGroupTasks);
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
          setTasks(groups[index].myGroupTasks);
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
          setTasks(groups[0].myGroupTasks);
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
        setTasks(groups[0].myGroupTasks);
      }
    }
    setIndexValue(null);
    setTabValue(undefined);
  }, [groups]);

  // useEffect(() => {
  //   if (!groups || groups.length === 0) return;

  //   // Only update task groups if there is a change
  //   const newGroupNames = groups.map(
  //     (group: { myGroupName: string; mode: string }) => ({
  //       tab: group.myGroupName,
  //       category: group.mode,
  //     })
  //   );

  //   setTaskGroups((prevGroupNames: any) => {
  //     const prevGroupNamesString = JSON.stringify(prevGroupNames);
  //     const newGroupNamesString = JSON.stringify(newGroupNames);

  //     // Avoid updating if the group names haven't changed
  //     if (prevGroupNamesString !== newGroupNamesString) {
  //       return newGroupNames;
  //     }
  //     return prevGroupNames;
  //   });

  //   let selectedIndex = 0;

  //   if (indexValue !== null && indexValue !== undefined) {
  //     selectedIndex = indexValue;
  //   } else if (tabValue) {
  //     const foundIndex = groups.findIndex(
  //       (group: { myGroupName: string }) => group.myGroupName === tabValue
  //     );
  //     selectedIndex = foundIndex !== -1 ? foundIndex : 0;
  //   }

  //   // setSelectedTab((prevTab: any) => {
  //   //   // Avoid updating the selected tab if it's the same
  //   //   if (prevTab !== groups[selectedIndex].myGroupName) {
  //   //     return groups[selectedIndex].myGroupName;
  //   //   }
  //   //   return prevTab;
  //   // });

  //   if (groups && groups[selectedIndex] && groups[selectedIndex].myGroupName) {
  //     setTimeout(() => {
  //       const tabElement = document.getElementById(
  //         `tab-${groups[selectedIndex].myGroupName}`
  //       );
  //       if (tabElement) {
  //         const tabRect = tabElement.getBoundingClientRect();
  //         const containerRect =
  //           tabContainerRef.current?.getBoundingClientRect();

  //         if (containerRect) {
  //           const isTabVisible =
  //             tabRect.left >= containerRect.left &&
  //             tabRect.right <= containerRect.right;

  //           if (!isTabVisible) {
  //             tabElement.scrollIntoView({
  //               behavior: "smooth",
  //               block: "nearest",
  //               inline: "center",
  //             });
  //           }
  //         }
  //       }
  //     }, 100);
  //   }

  //   const initialTasks = groups[selectedIndex].myGroupTasks || [];
  //   setTasks((prevTasks: any) => {
  //     // Avoid updating tasks if they haven't changed
  //     const prevTasksString = JSON.stringify(prevTasks);
  //     const newTasksString = JSON.stringify(initialTasks);

  //     if (prevTasksString !== newTasksString) {
  //       return initialTasks;
  //     }
  //     return prevTasks;
  //   });

  //   // Reset index and tab values
  //   setIndexValue(null);
  //   setTabValue(undefined);
  // }, [groups, indexValue, tabValue]);

  // useEffect(() => {
  //   if (
  //     dataSettings.threads !== undefined ||
  //     dataSettings.sleepTime !== undefined
  //   ) {
  //     setFormData({
  //       numberOfThreads: dataSettings.threads ?? undefined,
  //       sleepTime: dataSettings.sleepTime ?? undefined,
  //     });
  //   }
  // }, [dataSettings.threads, dataSettings.sleepTime]);

  // useEffect(() => {
  //   if (
  //     !isModalOpenEditTask.isOpen &&
  //     !isDeleteTaskModal.isOpen &&
  //     !isModalOpenCreateTask.isOpen &&
  //     !isModalOpenAddTab.isOpen &&
  //     !isDeleteModal.isOpen
  //   ) {
  //     const handleKeyDown = (event: KeyboardEvent) => {
  //       if (
  //         event.ctrlKey &&
  //         event.shiftKey &&
  //         event.key.toLowerCase() === "f"
  //       ) {
  //         setShowInput(true);
  //       }
  //     };

  //     window.addEventListener("keydown", handleKeyDown);
  //     return () => {
  //       window.removeEventListener("keydown", handleKeyDown);
  //     };
  //   }
  // }, [
  //   isModalOpenEditTask,
  //   isDeleteTaskModal,
  //   isModalOpenCreateTask,
  //   isModalOpenAddTab,
  //   isDeleteModal,
  // ]);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       inputRef.current &&
  //       !inputRef.current.contains(event.target as Node)
  //     ) {
  //       setShowInput(false);
  //       setSearchInputAll("");
  //       setErrorTab("");
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  // useEffect(() => {
  //   if (showInput && inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // }, [showInput]);

  // useEffect(() => {
  //   const handleKeyPress = (event: KeyboardEvent) => {
  //     if (event.key === "Enter" && searchInputAll) {
  //       let matchingGroup = null;
  //       let matchingTasks = [];

  //       for (const group of groups) {
  //         const foundGroupName =
  //           group.myGroupName.toLowerCase() === searchInputAll.toLowerCase();
  //         if (foundGroupName) {
  //           matchingGroup = group;
  //           matchingTasks = group.myGroupTasks;
  //           break;
  //         }
  //       }

  //       if (matchingGroup) {
  //         setSelectedTab(matchingGroup.myGroupName);
  //         setTasks(matchingTasks);
  //         setShowInput(false);
  //         setSearchInputAll("");
  //         setErrorTab("");
  //       } else {
  //         setErrorTab(`Group name "${searchInputAll}" does not exist.`);
  //       }
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyPress);

  //   return () => {
  //     window.removeEventListener("keydown", handleKeyPress);
  //   };
  // }, [searchInputAll, groups]);

  // useEffect(() => {
  //   return () => {
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   const handleKeyDown = (event: {
  //     ctrlKey: any;
  //     key: string;
  //     preventDefault: () => void;
  //   }) => {
  //     if (
  //       !isModalOpenEditTask.isOpen &&
  //       !isDeleteTaskModal.isOpen &&
  //       !isModalOpenCreateTask.isOpen &&
  //       !isModalOpenAddTab.isOpen &&
  //       !isDeleteModal.isOpen
  //     ) {
  //       if (event.ctrlKey && event.key.toLowerCase() === "a") {
  //         event.preventDefault();
  //         handleSelectAll();
  //       } else if (event.ctrlKey && event.key.toLowerCase() === "t") {
  //         event.preventDefault();
  //         handleAddTab();
  //       } else if (event.ctrlKey && event.key.toLowerCase() === "d") {
  //         event.preventDefault();
  //         if (selectedTasks.length > 0) {
  //           setTabValue(selectedTab);
  //           setIsDeleteTaskModal({
  //             isOpen: true,
  //             task: selectedTasks,
  //           });
  //         }
  //       } else if (event.ctrlKey && event.key.toLowerCase() === "s") {
  //         event.preventDefault();
  //         handleStartAll();
  //       } else if (event.ctrlKey && event.key.toLowerCase() === "p") {
  //         event.preventDefault();
  //         const allTaskKeys = tasks.map((task: { key: string }) => task.key);
  //         const matchingKeys = playingTasks.filter((key: string) =>
  //           allTaskKeys.includes(key)
  //         );
  //         handleStopAll(matchingKeys);
  //       } else if (event.ctrlKey && event.key.toLowerCase() === "c") {
  //         event.preventDefault();
  //         if (taskGroups.length === 0) {
  //           toast({
  //             variant: "destructive",
  //             title: "A group name with a specific category is required",
  //           });
  //         } else {
  //           setTabValue(selectedTab);
  //           setIsModalOpenCreateTask({
  //             isOpen: true,
  //             tab: selectedTab,
  //             mode: getModeTab()?.mode,
  //             type: getModeTab()?.type,
  //           });
  //         }
  //       }
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [
  //   selectedTasks,
  //   isRunning,
  //   taskGroups,
  //   isModalOpenEditTask,
  //   isDeleteTaskModal,
  //   isModalOpenCreateTask,
  //   isModalOpenAddTab,
  //   isDeleteModal,
  // ]);
};

export default useMainTasksKeyEvents;
