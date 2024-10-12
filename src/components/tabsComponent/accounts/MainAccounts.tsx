import React, { useEffect, useRef, useState } from "react";
import { Icons } from "../../icons/Icons";
import TableSkeleton from "../../skeletons/TableSkeleton";
import GroupTabs from "../../custom/GroupTabs";
import TableComponent from "../../custom/TableComponent";
import CreateGroupTaskNameModal from "../../modals/TaskModals/CreateGroupTaskNameModal";
import { toast } from "../../ui/use-toast";
import DeleteModal from "../../modals/DeleteModal";
import AddAccountsModal from "../../modals/AccountModal/AddAccountsModal";
import MassLinkModal from "../../modals/AccountModal/MassLinkModal";
import ImportAccountsModal from "../../modals/AccountModal/ImportAccountsModal";
import emptyProfileImage from "../../../assets/emptyProfileImage.jpg";
import ButtonTabs from "../../custom/ButtonTabs";
import { useMainAccountsStates } from "./Events/MainAccountsStates";
import { useMainAccountsFunctions } from "./Events/MainAccountsFunctions";
import MainAccountKeyEvents from "./Events/MainAccountKeyEvents";
import SearchInputWithOptions from "../../custom/SearchInputWithOptions";
import { modeOptionsAccount } from "../../../lib/globalVariables";
import LabelWithDropdownIcons from "../../dropdowns/LabelWithDropdownIcons";
import { cn } from "../../../lib/utils";

declare global {
  interface Window {
    electron: any;
  }
}

const MainAccounts: React.FC<IProps> = ({
  isOpen,
  onReturnValue,
  searchedValue,
  clearValue,
  setClearValue,
  clearSearchInput,
  isReady,
}) => {
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const [check, setCheck] = useState<boolean>(false);
  const state = useMainAccountsStates();
  const functions = useMainAccountsFunctions(state, tabContainerRef);
  MainAccountKeyEvents(state, functions, isReady, tabContainerRef);

  const {
    actions,
    setActions,
    searchInput,
    tasks,
    selectedTasks,
    selectedTab,
    isModalOpenImportAccounts,
    taskGroups,
    createAccountsModal,
    isModalOpenAddTab,
    isDeleteModal,
    isOpenMassLinkModal,
    width,
    discordGroupAccounts,
    twitterGroupAccounts,
    tabValue,
    setIsDeleteModal,
    setTabValue,
    setCreateAccountsModal,
    setIsOpenMassLinkModal,
    setIsModalOpenImportAccounts,
    setSearchInput,
    setIsModalOpenAddTab,
    setSelectedRowKey,
    setIsDeleteTaskModal,
    isDeleteTaskModal,
    groups,
    setClearValues,
    clearValues,
    groupsWthImages,
    groupsWthImagesDisocrd: groupsWthImagesDiscord,
    setTaskGroups,
    setSelectedTab,
    setTasks,
    setSearchInputAll,
    setErrorTab,
    setGroups,
  } = state;

  const {
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
    handleSearchCategory,
  } = functions;

  const accountNames =
    groups &&
    groups.flatMap(
      (group) =>
        group.myGroupAccounts?.map(
          (account: { accountName: any }) => account.accountName
        ) || []
    );
  const countsTasks = tasks && tasks?.length;
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [countDataTasks, setCountDataTasks] = useState<number>();

  const optionsToSearch = tasks && tasks.map((x) => x.accountName);
  const isSameLength = countsTasks === countDataTasks;
  const availableWidth = width ? width - (isOpen ? 180 : 100) : 0;
  const fixedColumnWidths = [
    { label: "", dataKey: "profileImage", width: 50 },
    { label: "category", dataKey: "category", width: 150 },
    { label: "Account Name", dataKey: "accountName", width: 200 },
    { label: "Wallet Group", dataKey: "WalletGroup", width: 200 },
    { label: "Wallets", dataKey: "myWallet", width: 250 },
    { label: "Actions", dataKey: "actions", width: 150 },
  ];
  const totalFixedWidth = fixedColumnWidths.reduce(
    (acc, col) => acc + col.width,
    0
  );
  const scalingFactor = availableWidth ? availableWidth / totalFixedWidth : 1;

  const scaledColumns = fixedColumnWidths.map((col) => ({
    ...col,
    width: Math.floor(col.width * scalingFactor),
  }));

  const columns: Array<{
    label: string;
    dataKey: keyof account | any | "status" | "actions";
    width: number;
    cellRenderer?: (props: any) => React.ReactNode;
  }> = scaledColumns.map((col) => {
    if (col.dataKey === "actions") {
      return {
        ...col,
        cellRenderer: ({ rowIndex }: { rowIndex: number }) => (
          <div className="w-full flex items-center gap-1">
            {/* <button
              onClick={() => {
                if (selectedTasks.length <= 1) {
                  const data = tasks.find(
                    (x: account) => x.key === tasks[rowIndex].key
                  );
                  if (data) {
                    const form = {
                      myGroupName: data.myGroupName,
                      category: data.category,
                      Proxies: data.Proxies,
                      WalletGroup: data.WalletGroup,
                      myWallet: data.myWallet,
                      accountName: data.accountName,
                      tokenDiscord: data.tokenDiscord ?? undefined,
                      TwitterAuthToken: data.TwitterAuthToken,
                      key: data.key,
                    };
                    handleEditAccount(data.key, form);
                  }
                }
              }}
              className="w-6 h-6 flex items-center justify-center group"
            >
              <Icons.EditBtn className="w-4 h-4 text-default dark:text-white group-hover:text-warning transition duration-300" />
            </button> */}
            <button
              onClick={() => {
                setTabValue(selectedTab);
                setSelectedRowKey(tasks[rowIndex].key);
                setIsDeleteTaskModal({
                  isOpen: true,
                  task: tasks[rowIndex].key,
                });
                handleDeleteAccount(tasks[rowIndex].key);
              }}
              className="w-6 h-6 flex items-center justify-center group"
            >
              <Icons.DeleteBtn className="w-4 h-4 text-default dark:text-white group-hover:text-red transition duration-300" />
            </button>
            <button
              onClick={() => {
                setTabValue(selectedTab);
                handleDuplicateTask(tasks[rowIndex].key);
              }}
              className="w-6 h-6 flex items-center justify-center group"
            >
              <Icons.DuplicateBtn className="w-4 h-4 text-default dark:text-white group-hover:text-primary transition duration-300" />
            </button>
          </div>
        ),
      };
    }
    if (col.dataKey === "profileImage") {
      return {
        ...col,
        cellRenderer: ({ rowIndex }: { rowIndex: number }) => (
          <div className="w-6 h-6 relative rounded-full bg-white">
            <img
              alt="profileImg"
              src={
                tasks[rowIndex] &&
                typeof tasks[rowIndex].profileImage === "string"
                  ? tasks[rowIndex]?.profileImage?.toLowerCase() === "empty"
                    ? emptyProfileImage
                    : tasks[rowIndex].profileImage
                  : emptyProfileImage
              }
              className="w-6 h-6 relative rounded-full"
            />
          </div>
        ),
      };
    }
    return col;
  });

  const filteredData = tasks?.filter((element) => {
    if (!searchInput) {
      return true;
    }
    return (
      element.accountName.toLowerCase().includes(searchInput.toLowerCase()) ||
      (element?.tokenDiscord &&
        element?.tokenDiscord
          .toLowerCase()
          .includes(searchInput.toLowerCase())) ||
      (element?.TwitterAuthToken &&
        element?.TwitterAuthToken.toLowerCase().includes(
          searchInput.toLowerCase()
        ))
    );
  });

  const groupModes =
    groups && groups.map((group: { mainCategory: any }) => group.mainCategory);

  const categories =
    modeOptionsAccount &&
    modeOptionsAccount.filter((option) => groupModes?.includes(option.label));

  const category = getCategory();

  const isWidth = width && width < 1180;

  useEffect(() => {
    if (!groupsWthImages || groupsWthImages.length === 0) return;
    if (groupsWthImages) {
      setGroups(groupsWthImages);
      let selectedIndex = 0;
      if (tabValue) {
        const foundIndex = groups.findIndex(
          (group: { myGroupName: string }) => group.myGroupName === tabValue
        );
        selectedIndex = foundIndex !== -1 ? foundIndex : 0;
      }

      const updatedTaskGroups = groupsWthImages.map(
        (group: { myGroupName: string; mainCategory: string }) => ({
          tab: group.myGroupName,
          category: group.mainCategory,
        })
      );
      setTaskGroups(updatedTaskGroups);
      setSelectedTab(groupsWthImages[selectedIndex]?.myGroupName);

      const allTasks = groupsWthImages[selectedIndex]?.myGroupAccounts || [];
      setTasks(allTasks);
    }
  }, [groupsWthImages]);

  useEffect(() => {
    if (!groupsWthImagesDiscord || groupsWthImagesDiscord.length === 0) return;
    if (groupsWthImagesDiscord) {
      setGroups(groupsWthImagesDiscord);
      let selectedIndex = 0;
      if (tabValue) {
        const foundIndex = groups.findIndex(
          (group: { myGroupName: string }) => group.myGroupName === tabValue
        );
        selectedIndex = foundIndex !== -1 ? foundIndex : 0;
      }
      const updatedTaskGroups = groupsWthImagesDiscord.map(
        (group: { myGroupName: string; mainCategory: string }) => ({
          tab: group.myGroupName,
          category: group.mainCategory,
        })
      );
      setTaskGroups(updatedTaskGroups);
      setSelectedTab(groupsWthImagesDiscord[selectedIndex]?.myGroupName);

      const allTasks =
        groupsWthImagesDiscord[selectedIndex]?.myGroupAccounts || [];
      setTasks(allTasks);
    }
  }, [groupsWthImagesDiscord]);

  useEffect(() => {
    if (isLoadingData && !isSameLength) {
      setIsLoadingData(false);
    }
  }, [isLoadingData, countsTasks, countDataTasks]);

  useEffect(() => {
    if (groups) {
      onReturnValue(groups);
    }
  }, [groups]);

  useEffect(() => {
    if (searchedValue) {
      handleInputChange(searchedValue);
    }
  }, [searchedValue]);

  useEffect(() => {
    if (clearValue === true) {
      setSearchInputAll("");
      setSearchInput("");
      setErrorTab("");
      setClearValue(false);
    }
  }, [clearValue]);

  const selectedGroup = groups.find(
    (group) => group.myGroupName === selectedTab
  );

  // Safely set disabled to true if selectedGroup is undefined or myGroupWallets is empty
  const disabled =
    !selectedGroup || (selectedGroup.myGroupAccounts?.length ?? 0) === 0;
  const disabledSome = !selectedGroup;

  return (
    <div className="w-full relative px-6">
      {isLoadingData ? (
        <div className="w-full  mt-[25%] flex items-center justify-center content-center">
          <Icons.Spinner className="w-20 h-20 text-primary" />
        </div>
      ) : (
        <>
          <div className="w-full max-w-full py-6 flex items-center justify-between">
            <div
              className={cn(
                `w-[50%] grid grid-cols-2 gap-4`,
                isWidth && !isOpen && "w-[45%]",
                !isWidth && isOpen && "w-[45%]",
                isWidth && isOpen && "w-[40%]"
              )}
            >
              <SearchInputWithOptions
                id="main-account-step-2"
                disabled={disabled}
                clearSearchInput={() => {
                  clearSearchInput();
                  setSearchInput("");
                }}
                value={searchInput ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                  const value = e.target.value.trimStart();
                  setSearchInput(value);
                }}
                wrapperClassName="h-[2.5rem] w-full relative border-borderLight dark:border-borderWallet "
                placeHolder={"search"}
                options={optionsToSearch ?? []}
              />
              <LabelWithDropdownIcons
                id="main-account-step-3"
                isSearch
                disabled={disabledSome}
                placeholder="Select a category"
                options={categories}
                onSelect={(value: string | string[]) => {
                  handleSearchCategory(value as string);
                }}
                wrapperClassName="w-full"
                clearSelectedValues={clearValues}
                setClearSelectedValues={setClearValues}
              />
            </div>
            <div className=" flex items-center gap-4">
              {getCategoryTasks() !== "link" && (
                <ButtonTabs
                  id="main-account-step-4"
                  onClick={() => {
                    if (taskGroups.length === 0) {
                      toast({
                        variant: "destructive",
                        title:
                          "A group name with a specific category is required",
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
                  }}
                  disabled={disabled}
                  type={disabled ? "disabled" : "default"}
                  showShortcut={true}
                  shortcutText="Ctrl + L"
                >
                  Mass Link
                </ButtonTabs>
              )}

              <ButtonTabs
                id="main-account-step-5"
                onClick={() => {
                  if (taskGroups.length === 0) {
                    toast({
                      variant: "destructive",
                      title:
                        "A group name with a specific category is required",
                    });
                  } else if (!["Twitter", "Discord"].includes(category)) {
                    toast({
                      variant: "destructive",
                      title:
                        'Invalid Group Name: Must Be "Twitter" or "Discord"',
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
                }}
                disabled={true}
                type={true ? "disabled" : "default"}
                showShortcut={true}
                shortcutText="Ctrl + I"
              >
                Import
              </ButtonTabs>
              <div className="h-[25px] w-[1px] bg-darkBlue dark:bg-backGround " />
              <ButtonTabs
                id="main-account-step-1"
                onClick={() => {
                  if (taskGroups.length === 0) {
                    toast({
                      variant: "destructive",
                      title:
                        "A group name with a specific category is required",
                    });
                  } else {
                    setTabValue(selectedTab);
                    setCreateAccountsModal({
                      isOpen: true,
                      tabName: selectedTab,
                    });
                  }
                }}
                showShortcut={true}
                shortcutText="Ctrl + C"
                type="active"
              >
                Add Accounts
                <Icons.ArrowLeft className="w-3 h-3" />
              </ButtonTabs>
            </div>
          </div>
          <div className="w-full max-w-full bg-lightBackgroundColor dark:bg-backgroundInput border border-borderLight dark:border-borders rounded-lg  shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            <div className="w-full max-w-full  pl-4 pr-2 py-2">
              <GroupTabs
                tabs={taskGroups.map((task) => task)}
                onAddTab={handleAddTab}
                onTabClick={handleTabClick}
                setTabValue={setTabValue}
                selectedTab={selectedTab}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
                onTabsReorder={handleTabsReorder}
                tabContainerRef={tabContainerRef}
                type="account"
                setGroups={setGroups}
              />
            </div>
            <div className="w-full">
              <TableComponent
                tasks={filteredData}
                columns={columns}
                handleSelectAll={handleSelectAll}
                handleSelectTask={handleSelectTask}
                selectedTasks={selectedTasks}
                isOpen={isOpen}
                isAccounts
                disabled={disabled}
                noDataButtonText="Add Accounts"
                noDataButtonOnclick={() => {
                  if (taskGroups.length === 0) {
                    toast({
                      variant: "destructive",
                      title:
                        "A group name with a specific category is required",
                    });
                  } else {
                    setTabValue(selectedTab);
                    setCreateAccountsModal({
                      isOpen: true,
                      tabName: selectedTab,
                    });
                  }
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* // Modals */}
      {isModalOpenAddTab.isOpen && (
        <CreateGroupTaskNameModal
          tabName={isModalOpenAddTab.tab ?? undefined}
          onClose={() => {
            setActions(!actions);
            setIsModalOpenAddTab({
              isOpen: false,
              tab: undefined,
            });
          }}
          onCallback={(value: string | undefined) => {
            setTabValue(value);
            setTimeout(() => {
              if (value) {
                const tabElement = document.getElementById(`tab-${value}`);
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
              }
            }, 100);
            setActions(!actions);
          }}
          typeTab="account"
          getType="myAccounts"
          isAccount={true}
          taskGroups={taskGroups}
          setActions={setActions}
          actions={actions}
        />
      )}

      {isDeleteModal.isOpen && (
        <DeleteModal
          slug={isDeleteModal?.name ?? undefined}
          callback={(name: string | string[]): void => {
            onPermanentDeleteClick(name as string);
          }}
          onClose={() => {
            setIsDeleteModal({
              isOpen: false,
              name: undefined,
            });
          }}
        />
      )}

      {createAccountsModal.isOpen && (
        <AddAccountsModal
          onClose={() => {
            setTabValue(selectedTab);
            setCreateAccountsModal({
              isOpen: false,
              tabName: undefined,
            });
            setActions(!actions);
          }}
          tabName={createAccountsModal.tabName ?? ""}
          taskGroups={taskGroups}
          rowKey={createAccountsModal.rowKey}
          formData={createAccountsModal.form ?? undefined}
          categoryValue={getCategory()}
          taskCategory={getCategoryTasks()}
          setSelectedTab={setSelectedTab}
          setTabValue={setTabValue}
          selectedTab={selectedTab}
          createAccountsModal={createAccountsModal}
          accountNames={accountNames}
        />
      )}

      {isOpenMassLinkModal.isOpen && (
        <MassLinkModal
          onClose={() => {
            setActions(!actions);
            setIsOpenMassLinkModal({
              isOpen: false,
              category: undefined,
              tabName: undefined,
            });
          }}
          isOpenMassLinkModal={isOpenMassLinkModal}
          tasks={tasks}
          discordGroupAccounts={discordGroupAccounts}
          twitterGroupAccounts={twitterGroupAccounts}
          taskCategory={getCategoryTasks()}
          taskGroups={taskGroups}
        />
      )}
      {isModalOpenImportAccounts.isOpen && (
        <ImportAccountsModal
          onClose={() => {
            setActions(!actions);
            setIsModalOpenImportAccounts({
              groupName: undefined,
              isOpen: false,
            });
          }}
          groupName={isModalOpenImportAccounts.groupName ?? selectedTab}
          countTasks={countsTasks}
          setIsLoadingData={setIsLoadingData}
          setCountDataTasks={setCountDataTasks}
          category={category}
        />
      )}

      {isDeleteTaskModal.isOpen && (
        <DeleteModal
          slug={isDeleteTaskModal?.task ?? undefined}
          callback={(tasks: string | string[]): void => {
            handleDeleteAccount(tasks);
          }}
          onClose={() => {
            setIsDeleteTaskModal({
              isOpen: false,
              task: "",
            });
          }}
        />
      )}
    </div>
  );
};

export default MainAccounts;
