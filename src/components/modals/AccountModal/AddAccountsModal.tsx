import React, { FC, useEffect, useState } from "react";
import ModalHeader from "../../custom/ModalHeader";
import LabelAndInputModals from "../../custom/LabelAndInputModals";
import LabelWithDropdown from "../../dropdowns/LabelWithDropdown";
import { toast } from "../../ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import useFetchV3 from "../../../hooks/useFetchV3";

const AddAccountsModal: FC<IPropsAddAccountsModal> = ({
  onClose,
  tabName,
  formData,
  rowKey,
  categoryValue,
  taskCategory,
  setSelectedTab,
  selectedTab,
  setTabValue,
  accountNames,
}) => {
  const { data: wallets } = useFetchV3<IGroupWallet[]>("MyWalletsnData");
  const [clearSelectedValues, setClearSelectedValues] =
    useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isValidDiscord, setIsValidDiscord] = useState<boolean | null>(null);
  const [myGroupName] = useState(formData?.myGroupName ?? tabName ?? "");
  const [category] = useState(
    formData?.category ?? taskCategory ?? categoryValue ?? ""
  );
  const [selectedWalletGroup, setSelectedWalletGroup] = useState<
    string | undefined
  >(formData?.WalletGroup ?? undefined);
  const [walletNames, setWalletNames] = useState<string[]>([]);
  const [selectedWalletNames, setSelectedWalletNames] = useState<
    string | string[]
  >(formData?.myWallet ?? []);
  const [accountName, setAccountName] = useState<string>(
    formData?.accountName ?? ""
  );
  const [tokenDiscord, setTokenDiscord] = useState<string>(
    formData?.tokenDiscord ?? ""
  );
  const [TwitterAuthToken, setTwitterAuthToken] = useState<string>(
    formData?.TwitterAuthToken ?? ""
  );
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<IForm>({
    myGroupName: myGroupName,
    category: category,
    WalletGroup: selectedWalletGroup,
    myWallet: selectedWalletNames,
    accountName: accountName,
    tokenDiscord: tokenDiscord,
    TwitterAuthToken: TwitterAuthToken,
  });
  const [deleteSecondValue, setDeleteSecondValue] = useState(false);

  const handleSubmit = () => {
    const key = uuidv4(); // Generate a unique key for the new account
    const formWithKey = { ...form, key }; // Add the key to the form data
    const storedAccount = localStorage.getItem("groupsAccount");
    let groupsAccount = storedAccount ? JSON.parse(storedAccount) : [];

    console.log("formWithKey: ", formWithKey);
    console.log("groupsAccount: ", groupsAccount);

    // Find the group that matches the form's myGroupName
    const updatedGroupsAccount = groupsAccount.map((group: any) => {
      if (group.myGroupName === formWithKey.myGroupName) {
        // Add the new account to the myGroupAccounts array
        return {
          ...group,
          myGroupAccounts: [...group.myGroupAccounts, formWithKey],
        };
      }
      return group; // If no match, return the group unchanged
    });

    // If no group was found, add a new group with the account
    if (
      !updatedGroupsAccount.find(
        (group: any) => group.myGroupName === formWithKey.myGroupName
      )
    ) {
      updatedGroupsAccount.push({
        myGroupName: formWithKey.myGroupName,
        mainCategory: formWithKey.category, // Add the category if needed
        myGroupAccounts: [formWithKey], // Add the form data to the new group
      });
    }

    // Save the updated groupsAccount back to localStorage
    localStorage.setItem("groupsAccount", JSON.stringify(updatedGroupsAccount));
    onClose();
    console.log("Updated groupsAccount: ", updatedGroupsAccount);
  };

  const originalAccountName = formData?.accountName ?? "";

  const handleAccountNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value.trimStart();
    setAccountName(newName);

    // Check if the account name exists (case-insensitive), excluding the original name
    if (
      accountNames &&
      newName && // Ensure newName is not undefined or empty
      originalAccountName && // Ensure originalAccountName is not undefined
      newName.toLowerCase() !== originalAccountName.toLowerCase() && // Exclude original name from the check
      accountNames.some((name) => name.toLowerCase() === newName.toLowerCase())
    ) {
      setError("This account already exists.");
    } else {
      setError(null);
    }
  };

  useEffect(() => {
    if (selectedWalletGroup) {
      const selectedGroup = wallets?.find(
        (group) => group.myGroupName === selectedWalletGroup
      );
      setWalletNames(
        selectedGroup
          ? selectedGroup.myGroupWallets.map((wallet) => wallet.WalletName)
          : []
      );
    }
  }, [selectedWalletGroup, wallets]);

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      myGroupName,
      category: category,
      WalletGroup: selectedWalletGroup,
      myWallet: selectedWalletNames,
      accountName,
      tokenDiscord,
      TwitterAuthToken,
    }));
  }, [
    myGroupName,
    selectedWalletGroup,
    selectedWalletNames,
    accountName,
    tokenDiscord,
    TwitterAuthToken,
    category,
  ]);

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

  const handleClearAllValues = () => {
    setAccountName("");
    setSelectedWalletGroup("");
    setSelectedWalletNames([]);
    setTokenDiscord("");
    setTwitterAuthToken("");
    setClearSelectedValues(true);
  };

  const hasNonEmptyValues =
    Array.isArray(formData?.myWallet) &&
    formData &&
    formData.myWallet.some((wallet) => wallet.trim() !== "");

  return (
    <ModalHeader
      label={formData ? "Edit Account" : "Add Account"}
      onClose={onClose}
      textSubmit={formData ? " Edit" : "Add"}
      wrapperClassName="w-[45rem] h-fit"
      onSubmit={handleSubmit}
      disabled={
        error ||
        !accountName ||
        (categoryValue === "Twitter" &&
          (!TwitterAuthToken || (TwitterAuthToken && isValid === false))) ||
        (categoryValue === "Discord" &&
          (!tokenDiscord || (tokenDiscord && isValidDiscord === false))) ||
        (taskCategory === "link-twitter" &&
          ((TwitterAuthToken && isValid === false) ||
            !selectedWalletGroup ||
            !selectedWalletNames ||
            selectedWalletNames.length === 0)) ||
        false ||
        (taskCategory === "link" &&
          (!selectedWalletGroup ||
            !selectedWalletNames ||
            selectedWalletNames.length === 0 ||
            !tokenDiscord ||
            (TwitterAuthToken && isValid === false) ||
            (tokenDiscord && isValidDiscord === false) ||
            !TwitterAuthToken)) ||
        false
      }
      onClear={handleClearAllValues}
    >
      <div className="w-full flex flex-col items-start gap-6">
        <div className="w-full flex items-center gap-3">
          <LabelAndInputModals
            label="Account Name*"
            labelClassName="w-full text-label"
            inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:text-white text-xs-plus placeholder:text-nickle  shadow-[0_4px_30px_rgba(0,0,0,0.1)] "
            placeholder="Write Account Name"
            value={accountName}
            onChange={handleAccountNameChange}
            error={error ? error : ""}
          />
          {formData?.WalletGroup && (
            <LabelWithDropdown
              isSearch
              options={wallets?.map((group) => group.myGroupName) ?? []}
              placeholder="Select Wallet Group"
              defaultValue={
                selectedWalletGroup ? selectedWalletGroup : undefined
              }
              onSelect={(value: string | string[]) => {
                setSelectedWalletGroup(value as string);
                setDeleteSecondValue(true);
                setSelectedWalletNames([]);
              }}
              deleteFieldValue={(field: string) => {
                setSelectedWalletGroup("");
                setDeleteSecondValue(true);
                setSelectedWalletNames([]);
              }}
              fieldValue={""}
              label="Wallet Group*"
              clearSelectedValues={clearSelectedValues}
              setClearSelectedValues={setClearSelectedValues}
            />
          )}
          {hasNonEmptyValues && (
            <LabelWithDropdown
              isSearch
              options={walletNames}
              placeholder="Wallets"
              onSelect={(value: string | string[]) => {
                setSelectedWalletNames(value);
              }}
              deleteFieldValue={(field: string) => {
                setSelectedWalletNames([]);
              }}
              fieldValue={""}
              label="Wallet Namess*"
              defaultValue={
                selectedWalletNames ?? (formData && formData.myWallet)
              }
              multiSelect={true}
              disabled={!selectedWalletGroup}
              clearSelectedValues={clearSelectedValues}
              setClearSelectedValues={setClearSelectedValues}
              deleteSecondValue={deleteSecondValue}
              setDeleteSecondValue={setDeleteSecondValue}
            />
          )}
        </div>

        <div className="w-full flex items-center gap-3">
          {formData?.tokenDiscord || formData?.TwitterAuthToken ? (
            <>
              {formData?.tokenDiscord && (
                <LabelAndInputModals
                  label="Discord Token*"
                  labelClassName="w-full text-label"
                  inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:text-white text-xs-plus placeholder:text-nickle  shadow-[0_4px_30px_rgba(0,0,0,0.1)] "
                  placeholder="Write Discord Token"
                  value={tokenDiscord}
                  onChange={(e) => {
                    const value = e.target.value.trimStart();
                    setTokenDiscord(value);

                    // Regular expression for matching Discord token structure
                    const tokenRegex =
                      /^[A-Za-z0-9_\-]{24}\.[A-Za-z0-9_\-]{6}\.[A-Za-z0-9_\-]{27,43}$/;

                    // Update the isValidDiscord state
                    setIsValidDiscord(tokenRegex.test(value));
                  }}
                  // Show error only if isValidDiscord is explicitly false (and not null)
                  error={isValidDiscord === false ? "Invalid Token" : ""}
                />
              )}
              {formData?.TwitterAuthToken && (
                <LabelAndInputModals
                  label="Twitter Token*"
                  labelClassName="w-full text-label"
                  inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:text-white text-xs-plus placeholder:text-nickle  shadow-[0_4px_30px_rgba(0,0,0,0.1)] "
                  placeholder="Write Twitter Token"
                  value={TwitterAuthToken}
                  onChange={(e) => {
                    const value = e.target.value.trimStart();
                    setTwitterAuthToken(value);
                    const tokenRegex = /^[a-f0-9]{40}$/;
                    setIsValid(tokenRegex.test(value));
                  }}
                  error={isValid === false ? "Invalid Token" : ""}
                />
              )}
            </>
          ) : form.category.toLowerCase() === "discord" ? (
            <LabelAndInputModals
              label="Discord Token*"
              labelClassName="w-full text-label"
              inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:text-white text-xs-plus placeholder:text-nickle  shadow-[0_4px_30px_rgba(0,0,0,0.1)] "
              placeholder="Write Discord Token"
              value={tokenDiscord}
              onChange={(e) => {
                const value = e.target.value.trimStart();
                setTokenDiscord(value);

                // Regular expression for matching Discord token structure
                const tokenRegex =
                  /^[A-Za-z0-9_\-]{24}\.[A-Za-z0-9_\-]{6}\.[A-Za-z0-9_\-]{27,43}$/;

                // Update the isValidDiscord state
                setIsValidDiscord(tokenRegex.test(value));
              }}
              // Show error only if isValidDiscord is explicitly false (and not null)
              error={isValidDiscord === false ? "Invalid Token" : ""}
            />
          ) : form.category.toLowerCase() === "link-discord-to-wallet" &&
            taskCategory?.includes("link-discord-to-wallet") ? (
            <LabelAndInputModals
              label="Discord Token*"
              labelClassName="w-full text-label"
              inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:text-white text-xs-plus placeholder:text-nickle  shadow-[0_4px_30px_rgba(0,0,0,0.1)] "
              placeholder="Write Discord Token"
              value={tokenDiscord}
              onChange={(e) => {
                const value = e.target.value.trimStart();
                setTokenDiscord(value);

                // Regular expression for matching Discord token structure
                const tokenRegex =
                  /^[A-Za-z0-9_\-]{24}\.[A-Za-z0-9_\-]{6}\.[A-Za-z0-9_\-]{27,43}$/;

                // Update the isValidDiscord state
                setIsValidDiscord(tokenRegex.test(value));
              }}
              // Show error only if isValidDiscord is explicitly false (and not null)
              error={isValidDiscord === false ? "Invalid Token" : ""}
            />
          ) : form.category.toLowerCase() === "link-twitter-to-wallet" &&
            taskCategory?.includes("link-twitter-to-wallet") ? (
            <LabelAndInputModals
              label="Twitter Token*"
              labelClassName="w-full text-label"
              inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:text-white text-xs-plus placeholder:text-nickle  shadow-[0_4px_30px_rgba(0,0,0,0.1)] "
              placeholder="Write Twitter Token"
              value={TwitterAuthToken}
              onChange={(e) => {
                const value = e.target.value.trimStart();
                setTwitterAuthToken(value);
                const tokenRegex = /^[a-f0-9]{40}$/;
                setIsValid(tokenRegex.test(value));
              }}
              error={isValid === false ? "Invalid Token" : ""}
            />
          ) : (form.category.toLowerCase() === "link-discord-to-twitter" &&
              taskCategory?.includes("link-discord-to-twitter")) ||
            (form.category.toLowerCase() === "link-twitter-to-discord" &&
              taskCategory?.includes("link-twitter-to-discord")) ? (
            <>
              <LabelAndInputModals
                label="Discord Token*"
                labelClassName="w-full text-label"
                inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:text-white text-xs-plus placeholder:text-nickle  shadow-[0_4px_30px_rgba(0,0,0,0.1)] "
                placeholder="Write Discord Token"
                value={tokenDiscord}
                onChange={(e) => {
                  const value = e.target.value.trimStart();
                  setTokenDiscord(value);

                  // Regular expression for matching Discord token structure
                  const tokenRegex =
                    /^[A-Za-z0-9_\-]{24}\.[A-Za-z0-9_\-]{6}\.[A-Za-z0-9_\-]{27,43}$/;

                  // Update the isValidDiscord state
                  setIsValidDiscord(tokenRegex.test(value));
                }}
                // Show error only if isValidDiscord is explicitly false (and not null)
                error={isValidDiscord === false ? "Invalid Token" : ""}
              />
              <LabelAndInputModals
                label="Twitter Token*"
                labelClassName="w-full text-label"
                inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:text-white text-xs-plus placeholder:text-nickle  shadow-[0_4px_30px_rgba(0,0,0,0.1)] "
                placeholder="Write Twitter Token"
                value={TwitterAuthToken}
                onChange={(e) => {
                  const value = e.target.value.trimStart();
                  setTwitterAuthToken(value);
                  const tokenRegex = /^[a-f0-9]{40}$/;
                  setIsValid(tokenRegex.test(value));
                }}
                error={isValid === false ? "Invalid Token" : ""}
              />
            </>
          ) : (
            <LabelAndInputModals
              label="Twitter Token*"
              labelClassName="w-full text-label"
              inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:text-white text-xs-plus placeholder:text-nickle  shadow-[0_4px_30px_rgba(0,0,0,0.1)] "
              placeholder="Write Twitter Token"
              value={TwitterAuthToken}
              onChange={(e) => {
                const value = e.target.value.trimStart();
                setTwitterAuthToken(value);
                const tokenRegex = /^[a-f0-9]{40}$/;
                setIsValid(tokenRegex.test(value));
              }}
              error={isValid === false ? "Invalid Token" : ""}
            />
          )}
        </div>
        {!formData &&
          (taskCategory?.includes("link-discord-to-wallet") ||
            taskCategory?.includes("link-twitter-to-wallet")) && (
            <div className="w-full flex items-center gap-3">
              <LabelWithDropdown
                isSearch
                options={wallets?.map((group) => group.myGroupName) ?? []}
                placeholder="Select Wallet Group"
                defaultValue={
                  selectedWalletGroup ? selectedWalletGroup : undefined
                }
                onSelect={(value: string | string[]) => {
                  setSelectedWalletGroup(value as string);
                  setDeleteSecondValue(true);
                  setSelectedWalletNames([]);
                }}
                deleteFieldValue={(field: string) => {
                  setSelectedWalletGroup("");
                  setDeleteSecondValue(true);
                  setSelectedWalletNames([]);
                }}
                fieldValue={""}
                label="Wallet Group*"
                clearSelectedValues={clearSelectedValues}
                setClearSelectedValues={setClearSelectedValues}
              />
              <LabelWithDropdown
                isSearch
                options={walletNames}
                placeholder="Wallets"
                onSelect={(value: string | string[]) => {
                  setSelectedWalletNames(value);
                }}
                deleteFieldValue={(field: string) => {
                  setSelectedWalletNames([]);
                }}
                fieldValue={""}
                label="Wallet Name*"
                defaultValue={selectedWalletNames ?? ""}
                multiSelect={true}
                disabled={!selectedWalletGroup}
                clearSelectedValues={clearSelectedValues}
                setClearSelectedValues={setClearSelectedValues}
                deleteSecondValue={deleteSecondValue}
                setDeleteSecondValue={setDeleteSecondValue}
              />
            </div>
          )}
        {!formData && taskCategory === "link" && (
          <>
            <LabelAndInputModals
              label="Discord Token*"
              labelClassName="w-full text-label"
              inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:text-white text-xs-plus placeholder:text-nickle  shadow-[0_4px_30px_rgba(0,0,0,0.1)] "
              placeholder="Write Discord Token"
              value={tokenDiscord}
              onChange={(e) => {
                const value = e.target.value.trimStart();
                setTokenDiscord(value);

                // Regular expression for matching Discord token structure
                const tokenRegex =
                  /^[A-Za-z0-9_\-]{24}\.[A-Za-z0-9_\-]{6}\.[A-Za-z0-9_\-]{27,43}$/;

                // Update the isValidDiscord state
                setIsValidDiscord(tokenRegex.test(value));
              }}
              // Show error only if isValidDiscord is explicitly false (and not null)
              error={isValidDiscord === false ? "Invalid Token" : ""}
            />
            <div className="w-full flex items-center gap-3">
              <LabelWithDropdown
                isSearch
                options={wallets?.map((group) => group.myGroupName) ?? []}
                placeholder="Select Wallet Group"
                defaultValue={
                  selectedWalletGroup ? selectedWalletGroup : undefined
                }
                onSelect={(value: string | string[]) => {
                  setSelectedWalletGroup(value as string);
                  setDeleteSecondValue(true);
                  setSelectedWalletNames([]);
                }}
                deleteFieldValue={(field: string) => {
                  setSelectedWalletGroup("");
                  setDeleteSecondValue(true);
                  setSelectedWalletNames([]);
                }}
                fieldValue={""}
                label="Wallet Group*"
                clearSelectedValues={clearSelectedValues}
                setClearSelectedValues={setClearSelectedValues}
              />
              <LabelWithDropdown
                isSearch
                options={walletNames}
                placeholder="Wallets"
                onSelect={(value: string | string[]) => {
                  setSelectedWalletNames(value);
                }}
                deleteFieldValue={(field: string) => {
                  setSelectedWalletNames([]);
                }}
                fieldValue={""}
                label="Wallet Name*"
                defaultValue={
                  selectedWalletNames && selectedWalletNames.length === 0
                    ? undefined
                    : selectedWalletNames
                }
                multiSelect={true}
                disabled={!selectedWalletGroup}
                clearSelectedValues={clearSelectedValues}
                setClearSelectedValues={setClearSelectedValues}
                deleteSecondValue={deleteSecondValue}
                setDeleteSecondValue={setDeleteSecondValue}
              />
            </div>
          </>
        )}
      </div>
    </ModalHeader>
  );
};

export default AddAccountsModal;
