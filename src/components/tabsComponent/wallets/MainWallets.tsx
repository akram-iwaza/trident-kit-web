import React, { useEffect, useRef, useState } from "react";
import { Icons } from "../../icons/Icons";
import TableSkeleton from "../../skeletons/TableSkeleton";
import GroupTabs from "../../custom/GroupTabs";
import TableComponent from "../../custom/TableComponent";
import CreateGroupTaskNameModal from "../../modals/TaskModals/CreateGroupTaskNameModal";
import DeleteModal from "../../modals/DeleteModal";
import AddWalletsModal from "../../modals/WalletsModal/AddWalletsModal";
import GenerateWalletModal from "../../modals/WalletsModal/GenerateWalletModal";
import DistributeRecollectModal from "../../modals/WalletsModal/DistributeRecollectModal";
import ButtonTabs from "../../custom/ButtonTabs";
import { useMainWalletsStates } from "./Events/MainWalletsStates";
import { useMainWalletsFunctions } from "./Events/MainWalletsFunctions";
import useMainWalletsKeyEvents from "./Events/MainWalletsKeyEvents";
import { v4 as uuidv4 } from "uuid";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { SiSolana } from "react-icons/si";
import { cn } from "../../../lib/utils";
import { toast } from "../../ui/use-toast";
import SearchInputWithOptions from "../../custom/SearchInputWithOptions";
declare global {
  interface Window {
    electron: any;
  }
}

interface Wallet {
  WalletName: string;
  privateKey: string;
  address: string;
  coinType: string;
}

const MainWallets: React.FC<IProps> = ({
  isOpen,
  onReturnValue,
  searchedValue,
  isReady,
}) => {
  const [check, setCheck] = useState<boolean>(false);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const state = useMainWalletsStates();
  const functions = useMainWalletsFunctions(state, tabContainerRef);
  useMainWalletsKeyEvents(state, functions, isReady, tabContainerRef);

  const {
    actions,
    setActions,
    groups,
    tasks,
    selectedTasks,
    selectedTab,
    taskGroups,
    createWalletsModal,
    isModalOpenAddTab,
    isDeleteModal,
    isModalOpenGenerateWallet,
    isDistributeRecollectModalOpen,
    width,
    setTabValue,
    setIsDistributeRecollectModalOpen,
    setIsModalOpenGenerateWallet,
    setCreateWalletsModal,
    setIsModalOpenAddTab,
    setIsDeleteModal,
    isDeleteTaskModal,
    setIsDeleteTaskModal,
    privateKeyVisibility,
    arePrivateKeysVisible,
    setSelectedTab,
    setGroups,
  } = state;

  const {
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
    togglePrivateKeyVisibility,
    toggleAllPrivateKeysVisibility,
  } = functions;

  const walletNames =
    groups &&
    groups.flatMap(
      (group) =>
        group.myGroupWallets?.map(
          (wallet: { WalletName: any }) => wallet.WalletName
        ) || []
    );

  const walletNamesTasks = tasks && tasks.map((x) => x?.WalletName);

  const selectedGroup = groups.find(
    (group) => group.myGroupName === selectedTab
  );

  const disabled =
    !selectedGroup || (selectedGroup.myGroupWallets?.length ?? 0) === 0;

  const availableWidth = width ? width - (isOpen ? 180 : 100) : 0;

  const fixedColumnWidths = [
    { label: "Wallet Name", dataKey: "WalletName", width: 150 },
    { label: "Public Key", dataKey: "address", width: 200 },
    { label: "Private Key", dataKey: "privateKey", width: 200 },
    { label: "Coin Type", dataKey: "coinType", width: 100 },
    { label: "Balance", dataKey: "balance", width: 100 },
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
    dataKey: keyof wallet | any | "status" | "actions";
    width: number;
    cellRenderer?: (props: any) => React.ReactNode;
  }> = scaledColumns.map((col) => {
    if (col.dataKey === "coinType") {
      return {
        ...col,
        cellRenderer: ({ rowIndex }: { rowIndex: number }) => {
          const coinType = tasks[rowIndex].coinType;
          return (
            <div className="flex items-center gap-2 justify-start text-xs-plus font-normal">
              {coinType.toLowerCase() === "ethereum" ? (
                <FaEthereum className="w-4 h-4" />
              ) : coinType.toLowerCase() === "solana" ? (
                <SiSolana className="w-4 h-4" />
              ) : (
                <FaBitcoin className="w-4 h-4" />
              )}
              {coinType}
            </div>
          );
        },
      };
    }
    if (col.dataKey === "balance") {
      return {
        ...col,
        cellRenderer: ({ rowIndex }: { rowIndex: number }) => {
          const balance = tasks[rowIndex].balance;
          const coinType = tasks[rowIndex].coinType;
          return balance ? (
            <div
              className={cn(
                `w-full flex items-center justify-start gap-2`,
                balance.toLowerCase()?.includes("error")
                  ? "text-error"
                  : "text-warning"
              )}
            >
              {balance.toLowerCase()?.includes("error")
                ? "Failed"
                : parseFloat(balance).toFixed(2)}
              {coinType.toLowerCase() === "ethereum" ? (
                <span>ETH</span>
              ) : coinType.toLowerCase() === "solana" ? (
                <span>SOL</span>
              ) : (
                <span>BTC</span>
              )}
            </div>
          ) : (
            <div className="w-full flex items-center justify-center">0.00</div>
          );
        },
      };
    }
    if (col.dataKey === "actions") {
      return {
        ...col,
        cellRenderer: ({ rowIndex }: { rowIndex: number }) => (
          <div className="w-full flex items-center gap-1">
            {/* <button
              onClick={() => {
                if (selectedTasks.length <= 1) {
                  const wallet = `${tasks[rowIndex].WalletName},${tasks[rowIndex].privateKey}`;
                  const address = tasks[rowIndex].address;
                  const balance = tasks[rowIndex].balance;
                  handleEditWallet(
                    tasks[rowIndex].key,
                    wallet,
                    address,
                    balance
                  );
                }
              }}
              className="w-6 h-6 flex items-center justify-center group"
            >
              <Icons.EditBtn className="w-4 h-4 text-default dark:text-white group-hover:text-warning transition duration-300" />
            </button> */}
            <button
              onClick={() => {
                setTabValue(selectedTab);
                setIsDeleteTaskModal({
                  isOpen: true,
                  task: tasks[rowIndex].key,
                });
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
    if (col.dataKey === "address" || col.dataKey === "privateKey") {
      return {
        ...col,
        cellRenderer: ({ rowIndex }: { rowIndex: number }) => {
          const key = tasks[rowIndex][col.dataKey as keyof wallet];
          const isPrivateKeyVisible =
            privateKeyVisibility[rowIndex] ?? arePrivateKeysVisible;

          return (
            <div className="w-full flex items-center justify-start gap-2">
              <span
                className="w-full overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
                onDoubleClick={() => {
                  navigator.clipboard.writeText(key);
                  toast({
                    variant: "success",
                    title: `${col.label} copied`,
                  });
                }}
              >
                {col.dataKey === "privateKey" && !isPrivateKeyVisible
                  ? "***************************************************" // A long string of asterisks
                  : key}
              </span>
              {col.dataKey === "privateKey" && (
                <button onClick={() => togglePrivateKeyVisibility(rowIndex)}>
                  {isPrivateKeyVisible ? (
                    <Icons.EyeSlashSvg className="w-5 h-5" />
                  ) : (
                    <Icons.EyeSvg className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          );
        },
      };
    }

    return col;
  });

  const exportWalletsToTxt = () => {
    let output = "";

    tasks &&
      tasks.length > 0 &&
      tasks.forEach(
        (wallet: {
          WalletName: any;
          privateKey: any;
          address: any;
          coinType: any;
          balance: any;
        }) => {
          output += `${wallet.WalletName},${wallet.privateKey},${wallet.address},${wallet.coinType},${wallet.balance}\n`;
        }
      );

    const blob = new Blob([output], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "wallets.txt";
    link.click();

    // Cleanup URL object after download
    URL.revokeObjectURL(link.href);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const lines = content.split("\n");

        const myGroupWallets: Wallet[] = lines
          .map((line) => {
            const parts = line.split(",");

            // Ensure the line contains exactly 4 parts before proceeding
            if (parts.length === 5) {
              const [WalletName, privateKey, address, coinType, balance] =
                parts;
              return {
                WalletName: WalletName.trim(),
                privateKey: privateKey.trim(),
                address: address.trim(),
                coinType: coinType.trim(),
                balance: balance.trim(),
                key: uuidv4(),
              };
            } else {
              console.log(`Skipping malformed line: ${line}`);
              return null;
            }
          })
          .filter((wallet) => wallet !== null) as Wallet[];

        console.log("Imported Wallets:", myGroupWallets);
        if (myGroupWallets) {
          const walletsData = {
            myGroupName: selectedTab,
            myGroupWallets,
          };

          toast({
            variant: "success",
            title: "Imported wallets Successfuly",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const [searchInput, setSearchInput] = useState<string>("");

  const filteredData = tasks?.filter((element) => {
    if (!searchInput) {
      return true;
    }
    return element.WalletName.toLowerCase().includes(searchInput.toLowerCase());
  });

  useEffect(() => {
    if (groups) {
      onReturnValue(groups);
    }
  }, [groups]);

  useEffect(() => {
    if (searchedValue) {
      handleInputChangeSearch(searchedValue);
    }
  }, [searchedValue]);

  return (
    <div className="w-full max-w-full px-6 overflow-y-auto">
      <div className="w-full flex flex-col gap-5 items-start  py-6">
        <div className="w-full flex items-center justify-between">
          <div className="w-full flex items-center gap-[0.625rem]">
            <div className="flex items-center gap-[0.625rem]">
              <ButtonTabs
                id="main-wallets-step-4"
                disabled={true}
                type={true ? "disabled" : "default"}
                onClick={() => {
                  if (taskGroups && taskGroups.length > 0) {
                    setIsModalOpenGenerateWallet({
                      isOpen: true,
                      tabName: selectedTab,
                    });
                  } else {
                    toast({
                      variant: "destructive",
                      title: "A group name is required",
                    });
                  }
                }}
                showShortcut={true}
                shortcutText="Ctrl + G"
              >
                Generate
              </ButtonTabs>
              <ButtonTabs
                id="main-wallets-step-5"
                disabled={taskGroups && taskGroups.length === 0}
                type={
                  taskGroups && taskGroups.length === 0 ? "disabled" : "default"
                }
                onClick={() => {
                  setIsDistributeRecollectModalOpen({
                    isDistrubte: false,
                    isRecollect: true,
                  });
                }}
                showShortcut={true}
                shortcutText="Ctrl + L"
              >
                Recollect
              </ButtonTabs>
              <ButtonTabs
                id="main-wallets-step-6"
                disabled={taskGroups && taskGroups.length === 0}
                type={
                  taskGroups && taskGroups.length === 0 ? "disabled" : "default"
                }
                onClick={() => {
                  setIsDistributeRecollectModalOpen({
                    isDistrubte: true,
                    isRecollect: false,
                  });
                }}
                showShortcut={true}
                shortcutText="Ctrl + D"
              >
                Distribute
              </ButtonTabs>
            </div>
            <div className="w-[1px] h-[25px] bg-darkBlue dark:bg-backGround " />

            <ButtonTabs
              id="main-wallets-step-7"
              disabled={disabled}
              type={disabled ? "disabled" : "default"}
              onClick={toggleAllPrivateKeysVisibility}
            >
              {arePrivateKeysVisible ? (
                <div className="w-full flex items-center gap-[10px] group">
                  <span className="text-xs-plus text-default dark:text-white font-normal group-hover:text-default group-hover:border-primary dark:group-hover:text-white dark:group-hover:border-none dark:group-hover:bg-darkHoverBgBtn  transform transition duration-500">
                    Hide All
                  </span>
                  {!disabled && <Icons.EyeSlash className="w-5 h-5" />}
                </div>
              ) : (
                <div className="w-full flex items-center gap-[10px]">
                  <span className="text-xs-plus text-default dark:text-white font-normal group-hover:text-default group-hover:border-primary dark:group-hover:text-white dark:group-hover:border-none dark:group-hover:bg-darkHoverBgBtn  transform transition duration-500">
                    View All
                  </span>
                  {!disabled && <Icons.Eye className="w-5 h-5" />}
                </div>
              )}
            </ButtonTabs>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-[0.625rem]">
              <ButtonTabs
                id="main-wallets-step-2"
                disabled={true}
                type={true ? "disabled" : "default"}
                onClick={() => {
                  document.getElementById("import-file-input")?.click();
                }}
              >
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileImport}
                  style={{ display: "none" }}
                  id="import-file-input"
                />
                Import
              </ButtonTabs>
              <ButtonTabs
                id="main-wallets-step-3"
                disabled={true}
                type={true ? "disabled" : "default"}
                onClick={() => {
                  if (tasks && tasks.length > 0) {
                    exportWalletsToTxt();
                  } else {
                    toast({
                      variant: "destructive",
                      title: "Please ensure you have the necessary wallets",
                    });
                  }
                }}
              >
                Export
              </ButtonTabs>
            </div>
            <div className="w-[1px] h-[25px] bg-darkBlue dark:bg-backGround " />
            <ButtonTabs
              id="main-wallets-step-1"
              onClick={() => {
                setTabValue(selectedTab);
                setCreateWalletsModal({
                  isOpen: true,
                  tabName: selectedTab,
                });
              }}
              showShortcut={true}
              shortcutText="Ctrl + C"
              type="active"
            >
              Add Wallets
              <Icons.ArrowLeft className="w-3 h-3" />
            </ButtonTabs>
          </div>
        </div>
        <div className="w-[318px]">
          <SearchInputWithOptions
            disabled={disabled}
            clearSearchInput={() => {
              // clearSearchInput()
              setSearchInput("");
            }}
            value={searchInput ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
              const value = e.target.value.trimStart();
              setSearchInput(value);
            }}
            wrapperClassName="h-[2.5rem] w-full relative  border-borderLight dark:border-borderWallet "
            placeHolder={"search"}
            options={walletNamesTasks ?? []}
          />
        </div>
      </div>
      <div className="w-full max-w-full bg-lightBackgroundColor dark:bg-backgroundInput border border-borderLight dark:border-borders rounded-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="w-full max-w-full  pl-4 pr-2 py-2">
          <GroupTabs
            tabs={taskGroups}
            onAddTab={handleAddTab}
            onTabClick={handleTabClick}
            selectedTab={selectedTab}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
            onTabsReorder={handleTabsReorder}
            tabContainerRef={tabContainerRef}
            type="wallet"
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
            disabled={disabled}
            noDataButtonOnclick={() => {
              setTabValue(selectedTab);
              setCreateWalletsModal({
                isOpen: true,
                tabName: selectedTab,
              });
            }}
            noDataButtonText="Add Wallets"
            isWallet={true}
          />
        </div>
      </div>

      {isModalOpenAddTab.isOpen && (
        <CreateGroupTaskNameModal
          tabName={isModalOpenAddTab.tab ?? undefined}
          onClose={() => {
            setIsModalOpenAddTab({
              isOpen: false,
              tab: undefined,
            });
            setActions(!actions);
          }}
          onCallback={(value: string | undefined) => {
            setTabValue(value);
            setActions(!actions);
          }}
          typeTab="wallet"
          getType="myWallets"
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
            // setIsDeleted(true);
          }}
          onClose={() => {
            setIsDeleteModal({
              isOpen: false,
              name: undefined,
            });
          }}
        />
      )}

      {createWalletsModal.isOpen && (
        <AddWalletsModal
          onClose={() => {
            setTabValue(selectedTab);
            setCreateWalletsModal({
              isOpen: false,
              tabName: undefined,
              proxy: undefined,
              rowKey: undefined,
              address: undefined,
            });
            setActions(!actions);
          }}
          setSelectedTab={setSelectedTab}
          tabName={createWalletsModal.tabName ?? ""}
          taskGroups={taskGroups}
          rowKey={createWalletsModal.rowKey}
          wallet={createWalletsModal.proxy}
          address={createWalletsModal.address}
          balance={createWalletsModal.balance}
          emptyGroups={taskGroups.length === 0}
          walletNames={walletNames}
        />
      )}
      {isModalOpenGenerateWallet.isOpen && (
        <GenerateWalletModal
          onClose={() => {
            setTabValue(selectedTab);
            setIsModalOpenGenerateWallet({
              isOpen: false,
              tabName: undefined,
            });
            setActions(!actions);
          }}
          tabName={isModalOpenGenerateWallet.tabName ?? ""}
          setSelectedTab={setSelectedTab}
          taskGroups={taskGroups}
          emptyGroups={taskGroups.length === 0}
        />
      )}
      {(isDistributeRecollectModalOpen.isDistrubte ||
        isDistributeRecollectModalOpen.isRecollect) && (
        <DistributeRecollectModal
          onClose={() => {
            setTabValue(selectedTab);
            setIsDistributeRecollectModalOpen({
              isDistrubte: false,
              isRecollect: false,
            });
            setActions(!actions);
          }}
          isRecollect={isDistributeRecollectModalOpen.isRecollect}
          groups={groups}
        />
      )}

      {isDeleteTaskModal.isOpen && (
        <DeleteModal
          slug={isDeleteTaskModal?.task ?? undefined}
          callback={(tasks: string | string[]): void => {
            handleDeleteWallet(tasks);
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

export default MainWallets;
