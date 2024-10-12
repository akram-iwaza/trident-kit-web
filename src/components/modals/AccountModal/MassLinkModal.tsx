import React, { FC, useState, useEffect } from "react";
import ModalHeader from "../../custom/ModalHeader";
import LabelWithDropdown from "../../dropdowns/LabelWithDropdown";
import LabelAndInputModals from "../../custom/LabelAndInputModals";
import { toast } from "../../ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import useFetchV3 from "../../../hooks/useFetchV3";

const MassLinkModal: FC<IPropsMassLinkModal> = ({
  onClose,
  isOpenMassLinkModal,
  tasks,
  discordGroupAccounts,
  twitterGroupAccounts,
  taskCategory,
  taskGroups,
}) => {
  const storedAccount = localStorage.getItem("groupsWallet");
  const wallets = storedAccount ? JSON.parse(storedAccount) : [];
  const [clearSelectedValues, setClearSelectedValues] =
    useState<boolean>(false);
  const [formMassLink, setFormMassLink] = useState<IFormMassLink[]>([]);
  const [error, setError] = useState("");
  const [groupName, setGroupName] = useState<string | undefined>(undefined);
  const [selectedWalletGroup, setSelectedWalletGroup] = useState<
    string | undefined
  >(undefined);

  const [walletNames, setWalletNames] = useState<string[]>([]);

  const hasTokenDiscord =
    tasks &&
    tasks.some(
      (task) => task.tokenDiscord !== undefined && task.tokenDiscord !== ""
    );
  const hasTwitterAuthToken =
    tasks &&
    tasks.some(
      (task) =>
        task.TwitterAuthToken !== undefined && task.TwitterAuthToken !== ""
    );
  const hasWalletGroupAndMyWallet =
    tasks &&
    tasks.some((task) => task.myWallet.length === 0 && !task.WalletGroup);

  const noTokenDiscord = !formMassLink?.[0]?.tokenDiscord;
  const noTokenTwitter = !formMassLink?.[0]?.TwitterAuthToken;
  const noWalletGroup = !formMassLink?.[0]?.WalletGroup;
  const noMyWallet = formMassLink?.[0]?.myWallet?.length === 0;

  const hasWalletGroupWithoutMyWallet = formMassLink.some(
    (item) => item.WalletGroup && (!item.myWallet || item.myWallet.length === 0)
  );
  const noTokenDiscordForAll = formMassLink.some(
    (item) => taskCategory === "link-twitter-to-wallet" && !item.tokenDiscord
  );
  const disabled =
    !groupName ||
    !!error ||
    formMassLink.length === 0 ||
    hasWalletGroupWithoutMyWallet ||
    noTokenDiscordForAll ||
    (taskCategory === "Twitter" &&
      ((noTokenDiscord && noWalletGroup && noMyWallet) ||
        (noTokenDiscord && formMassLink[0].WalletGroup && noMyWallet) ||
        (noTokenDiscord && noWalletGroup))) ||
    (taskCategory === "Discord" &&
      ((noTokenTwitter && noWalletGroup && noMyWallet) ||
        (noTokenTwitter && formMassLink[0].WalletGroup && noMyWallet) ||
        (noTokenTwitter && noWalletGroup)));

  const handleDiscordAccountsSelect = (selectedAccounts: string | any[]) => {
    if (typeof selectedAccounts === "string") {
      selectedAccounts = [selectedAccounts];
    }

    const updatedFormMassLink = formMassLink.map((item, index) => {
      if (index < selectedAccounts.length) {
        const accountName = selectedAccounts[index];
        const account = discordGroupAccounts.find(
          (acc) => acc.accountName === accountName
        );
        return {
          ...item,
          tokenDiscord: account ? account.tokenDiscord : item.tokenDiscord,
        };
      } else {
        return {
          ...item,
          tokenDiscord: "",
        };
      }
    });

    setFormMassLink(updatedFormMassLink);
  };

  const handleTwitterAccountsSelect = (selectedAccounts: string | any[]) => {
    if (typeof selectedAccounts === "string") {
      selectedAccounts = [selectedAccounts];
    }

    const updatedFormMassLink = formMassLink.map((item, index) => {
      if (index < selectedAccounts.length) {
        const accountName = selectedAccounts[index];
        const account = twitterGroupAccounts.find(
          (acc) => acc.accountName === accountName
        );
        return {
          ...item,
          TwitterAuthToken: account
            ? account.TwitterAuthToken
            : item.TwitterAuthToken,
        };
      } else {
        return {
          ...item,
          TwitterAuthToken: "",
        };
      }
    });

    setFormMassLink(updatedFormMassLink);
  };

  const handleWalletNamesSelect = (selectedWallets: string | string[]) => {
    if (typeof selectedWallets === "string") {
      selectedWallets = [selectedWallets];
    }

    const updatedFormMassLink = formMassLink.map((item, index) => {
      if (index < selectedWallets.length) {
        return {
          ...item,
          myWallet: [selectedWallets[index]],
        };
      } else {
        return {
          ...item,
          myWallet: [],
        };
      }
    });

    setFormMassLink(updatedFormMassLink);
  };

  const handleSelectAccount = (value: string | string[]) => {
    if (Array.isArray(value)) {
      const selectedAccounts = tasks.filter((x) =>
        value.includes(x.accountName)
      );
      const updatedFormMassLink = selectedAccounts.map((selectedAccount) => ({
        accountName: selectedAccount.accountName,
        category: "link",
        myGroupName: groupName,
        WalletGroup: selectedAccount.WalletGroup,
        myWallet:
          selectedAccount.myWallet.length === 0
            ? []
            : selectedAccount.myWallet.join(", "),
        tokenDiscord:
          isOpenMassLinkModal.category === "Discord"
            ? selectedAccount.tokenDiscord
            : undefined,
        TwitterAuthToken:
          isOpenMassLinkModal.category !== "Discord"
            ? selectedAccount.TwitterAuthToken
            : undefined,
        type: "link",
        mainCategory: "link",
      }));
      setFormMassLink(updatedFormMassLink);
    } else {
      const selectedAccount = tasks.find((x) => x.accountName === value);
      if (selectedAccount) {
        const updatedFormMassLink = {
          accountName: selectedAccount.accountName,
          category: "link",
          myGroupName: groupName,
          WalletGroup: selectedAccount.WalletGroup,
          myWallet:
            selectedAccount.myWallet.length === 0
              ? []
              : selectedAccount.myWallet.join(", "),
          tokenDiscord:
            isOpenMassLinkModal.category === "Discord"
              ? selectedAccount.tokenDiscord
              : undefined,
          TwitterAuthToken:
            isOpenMassLinkModal.category !== "Discord"
              ? selectedAccount.TwitterAuthToken
              : undefined,
          type: "link",
          mainCategory: "link",
        };
        setFormMassLink([updatedFormMassLink]);
      }
    }
  };

  const updateCategory = (
    updatedFormMassLink: any[],
    taskCategory: string | undefined
  ) => {
    updatedFormMassLink.forEach(
      (item: {
        myWallet: any;
        WalletGroup: any;
        TwitterAuthToken: any;
        tokenDiscord: any;
        category: string;
      }) => {
        if (taskCategory === "Discord") {
          if (item.myWallet && item.WalletGroup && !item.TwitterAuthToken) {
            item.category = "link-discord-to-wallet";
          } else if (
            (item.TwitterAuthToken && !item.myWallet) ||
            (item.myWallet.length === 0 && !item.WalletGroup)
          ) {
            item.category = "link-discord-to-twitter";
          } else if (
            item.myWallet &&
            item.WalletGroup &&
            item.TwitterAuthToken
          ) {
            item.category = "link";
          }
        } else if (taskCategory === "Twitter") {
          if (item.myWallet && item.WalletGroup && !item.tokenDiscord) {
            item.category = "link-twitter-to-wallet";
          } else if (
            (item.tokenDiscord && !item.myWallet) ||
            (item.myWallet.length === 0 && !item.WalletGroup)
          ) {
            item.category = "link-twitter-to-discord";
          } else if (item.myWallet && item.WalletGroup && item.tokenDiscord) {
            item.category = "link";
          }
        }
      }
    );
    return updatedFormMassLink;
  };

  const handleSubmit = () => {
    // Add a unique key to each formMassLink item
    const updatedFormMassLink = formMassLink.map((item) => ({
      ...item,
      key: uuidv4(),
    }));

    // Update the form with category info
    const updatedForm = updateCategory(updatedFormMassLink, taskCategory);

    // Get the stored account data from localStorage
    const storedAccount = localStorage.getItem("groupsAccount");
    let accounts = storedAccount ? JSON.parse(storedAccount) : [];

    console.log("updatedForm : ", updatedForm);
    console.log("accounts : ", accounts);

    // Check if the group with the same myGroupName exists
    const existingGroup = accounts.find(
      (group: any) => group.myGroupName === updatedForm[0].myGroupName
    );

    if (existingGroup) {
      // If group exists, add the new form to the existing group's accounts
      existingGroup.myGroupAccounts.push(...updatedForm);
    } else {
      // If group doesn't exist, create a new group with the form data
      accounts.push({
        myGroupName: updatedForm[0].myGroupName,
        mainCategory: updatedForm[0].mainCategory,
        myGroupAccounts: [...updatedForm],
      });
    }

    // Save the updated accounts data back to localStorage
    localStorage.setItem("groupsAccount", JSON.stringify(accounts));
    onClose();
    console.log("Updated accounts: ", accounts);
  };

  useEffect(() => {
    if (formMassLink.length > 0) {
      setFormMassLink((prev) =>
        prev.map((item) => ({ ...item, myGroupName: groupName }))
      );
    }
  }, [groupName]);

  useEffect(() => {
    if (selectedWalletGroup) {
      const selectedGroup = wallets?.find(
        (group: { myGroupName: string }) =>
          group.myGroupName === selectedWalletGroup
      );
      setWalletNames(
        selectedGroup
          ? selectedGroup.myGroupWallets.map(
              (wallet: { WalletName: any }) => wallet.WalletName
            )
          : []
      );
    } else {
      setWalletNames([]);
    }
  }, [selectedWalletGroup, wallets]);

  useEffect(() => {
    if (selectedWalletGroup) {
      setFormMassLink((prev) =>
        prev.map((item) => ({
          ...item,
          WalletGroup: selectedWalletGroup,
        }))
      );
    }
  }, [selectedWalletGroup]);

  useEffect(() => {
    const groupExists = taskGroups.some(
      (group) =>
        group.tab === groupName &&
        (group.category === "Discord" || group.category === "Twitter")
    );
    if (groupExists) {
      setError("These items cannot be added to the specified group.");
    } else {
      setError("");
    }
  }, [groupName, taskGroups]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleClear = () => {
    setFormMassLink([]);
    setSelectedWalletGroup("");
    setWalletNames([]);
    setGroupName("");
    setClearSelectedValues(true);
  };

  return (
    <ModalHeader
      label={"Mass Link Accounts"}
      onClose={onClose}
      wrapperClassName="w-[45rem] h-fit min-h-[20rem]"
      onSubmit={handleSubmit}
      disabled={disabled}
      onClear={handleClear}
    >
      <div className="w-full flex flex-col items-start gap-4">
        <LabelWithDropdown
          isSearch
          label="Select Account*"
          multiSelect
          options={tasks.map((x) => x.accountName)}
          defaultValue={formMassLink.map((f) => f.accountName) as any}
          onSelect={(value: string | string[]) => handleSelectAccount(value)}
          deleteFieldValue={(field: string) => {
            setFormMassLink([]);
          }}
          fieldValue={""}
          placeholder="Select Account"
          isSelectAll
          isLength
          clearSelectedValues={clearSelectedValues}
          setClearSelectedValues={setClearSelectedValues}
        />
        <LabelAndInputModals
          label="Group Name*"
          labelClassName="w-full text-label"
          inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:text-white text-xs-plus placeholder:text-nickle  shadow-[0_4px_30px_rgba(0,0,0,0.1)] "
          placeholder="Write Group Name"
          value={groupName ?? ""}
          onChange={(e) => setGroupName(e.target.value.trimStart())}
          disabled={formMassLink.length === 0}
          error={error ?? undefined}
        />
        {isOpenMassLinkModal.category === "Discord" && !hasTwitterAuthToken ? (
          <LabelWithDropdown
            isSearch
            maxLengthSelect={Number(formMassLink.length)}
            options={twitterGroupAccounts.map((x) => x.accountName)}
            placeholder="Select Accounts"
            onSelect={handleTwitterAccountsSelect}
            deleteFieldValue={(field: string) => {
              const updatedFormMassLink = formMassLink.map((item) => {
                return {
                  ...item,
                  TwitterAuthToken: "",
                };
              });
              setFormMassLink(updatedFormMassLink);
            }}
            fieldValue={""}
            label="Select Accounts*"
            multiSelect={true}
            disabled={formMassLink.length === 0}
            isSelectAll
            isLength
            clearSelectedValues={clearSelectedValues}
            setClearSelectedValues={setClearSelectedValues}
          />
        ) : (
          !hasTokenDiscord && (
            <LabelWithDropdown
              isSearch
              maxLengthSelect={Number(formMassLink.length)}
              options={discordGroupAccounts.map((x) => x.accountName)}
              placeholder="Select Discord Accounts"
              onSelect={handleDiscordAccountsSelect}
              deleteFieldValue={(field: string) => {
                const updatedFormMassLink = formMassLink.map((item) => {
                  return {
                    ...item,
                    tokenDiscord: "",
                  };
                });
                setFormMassLink(updatedFormMassLink);
              }}
              fieldValue={""}
              label="Select Discord Accounts"
              multiSelect={true}
              disabled={formMassLink.length === 0}
              isSelectAll
              isLength
              clearSelectedValues={clearSelectedValues}
              setClearSelectedValues={setClearSelectedValues}
              error={
                noTokenDiscordForAll
                  ? "The number of Discord accounts should be the same as the number of selected accounts."
                  : ""
              }
            />
          )
        )}
        {hasWalletGroupAndMyWallet && (
          <div className="w-full flex items-center gap-2">
            <LabelWithDropdown
              isSearch
              maxLengthSelect={Number(formMassLink.length)}
              options={
                wallets?.map(
                  (group: { myGroupName: any }) => group.myGroupName
                ) ?? []
              }
              placeholder="Select Wallet Group"
              defaultValue={
                selectedWalletGroup ? selectedWalletGroup : undefined
              }
              deleteFieldValue={(field: string) => {
                setSelectedWalletGroup("");
                const updatedFormMassLink = formMassLink.map((item) => {
                  return {
                    ...item,
                    myWallet: [],
                  };
                });
                setFormMassLink(updatedFormMassLink);
              }}
              fieldValue={""}
              onSelect={(value: string | string[]) => {
                setSelectedWalletGroup(value as string);
                const updatedFormMassLink = formMassLink.map((item) => {
                  return {
                    ...item,
                    myWallet: [],
                  };
                });
                setFormMassLink(updatedFormMassLink);
              }}
              label="Wallet Group*"
              disabled={!!(formMassLink.length === 0)}
              clearSelectedValues={clearSelectedValues}
              setClearSelectedValues={setClearSelectedValues}
            />
            <LabelWithDropdown
              isSearch
              options={walletNames}
              placeholder="Wallets"
              onSelect={handleWalletNamesSelect}
              deleteFieldValue={(field: string) => {
                const updatedFormMassLink = formMassLink.map((item) => {
                  return {
                    ...item,
                    myWallet: [],
                  };
                });
                setFormMassLink(updatedFormMassLink);
              }}
              fieldValue={""}
              label="Wallet Name*"
              multiSelect={true}
              maxLengthSelect={Number(formMassLink.length)}
              disabled={!selectedWalletGroup}
              isSelectAll
              isLength
              clearSelectedValues={clearSelectedValues}
              setClearSelectedValues={setClearSelectedValues}
            />
          </div>
        )}
      </div>
    </ModalHeader>
  );
};

export default MassLinkModal;
