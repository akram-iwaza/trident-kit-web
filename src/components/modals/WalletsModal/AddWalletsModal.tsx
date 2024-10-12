import React, { FC, useEffect, useState } from "react";
import CustomButton from "../../custom/CustomButton";
import ModalHeader from "../../custom/ModalHeader";
import { toast } from "../../ui/use-toast";
import TextArea from "../../ui/TextArea";
import { v4 as uuidv4 } from "uuid";
import Web3 from "web3";

const web3 = new Web3();

const AddWalletsModal: FC<IPropsAddProxiesModal> = ({
  onClose,
  tabName,
  rowKey,
  wallet,
  emptyGroups,
  address: addressValue,
  setSelectedTab,
  walletNames,
  balance,
}) => {
  const [myGroupName] = useState(tabName ?? "");
  const [walletValue, setWalletValue] = useState(wallet ?? "");
  const [error, setError] = useState("");
  const isEdit = !!rowKey && !!wallet;
  const titleValue = isEdit ? "Edit Wallet" : "Add Wallets";

  const originalWalletName = wallet && wallet.split(",")[0].trim();

  const handleWalletChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setWalletValue(value);

    const walletName = value.split(",")[0].trim();

    if (
      walletNames &&
      walletName.toLowerCase() !== originalWalletName?.toLowerCase() &&
      walletNames.some(
        (name) => name.toLowerCase() === walletName.toLowerCase()
      )
    ) {
      setError(`Wallet name "${walletName}" already exists.`);
    } else {
      setError("");
    }
  };

  // Function to derive Solana public key from private key
  const getSolanaPublicKey = (privateKey: string) => {
    return "";
  };

  const getPublicKey = (privateKey: string, coinType: string) => {
    if (coinType === "Ethereum") {
      // Handle Ethereum
      try {
        return web3.eth.accounts.privateKeyToAccount(privateKey).address;
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to generate public key: Invalid Ethereum private key.",
        });
        return "";
      }
    } else if (coinType === "Solana") {
      // Handle Solana
      return getSolanaPublicKey(privateKey);
    }
    return ""; // Default empty string
  };

  const ensureHexPrefix = (key: string) => {
    if (!key.startsWith("0x")) {
      return "0x" + key;
    }
    return key;
  };

  const handleSubmit = () => {
    setSelectedTab(tabName);
    let myGroupWallets: {
      WalletName: string;
      address: string;
      privateKey: string;
      coinType: string;
      key: string;
    }[] = [];

    const myWallets = walletValue;
    const walletEntries = myWallets
      .split("\n")
      .filter((entry: string) => entry.trim() !== "");

    walletEntries.forEach((entry: string) => {
      const splitedInputData = entry.split(",");

      if (splitedInputData.length !== 2) {
        toast({
          variant: "destructive",
          title: "Invalid input format. Please use the format: Name,PrivateKey",
        });
        return;
      }

      const WalletName = splitedInputData[0].trim();
      let privateKeyValue = splitedInputData[1].trim();
      console.log("privateKeyValue : ", privateKeyValue);

      // Check if the private key is for Ethereum, Bitcoin, or Solana
      const isEthereum = /^0x[0-9a-fA-F]{64}$/.test(privateKeyValue); // Ethereum format
      const isBitcoin = /^[A-Za-z0-9]{52}$/.test(privateKeyValue); // Bitcoin format
      const isSolana = /^[A-Za-z0-9]{88}$/.test(privateKeyValue);

      let coinType = "";
      if (isEthereum) {
        privateKeyValue = ensureHexPrefix(privateKeyValue);
        coinType = "Ethereum";
      } else if (isBitcoin) {
        coinType = "Bitcoin";
      } else if (isSolana) {
        coinType = "Solana";
      } else {
        toast({
          variant: "destructive",
          title: "Invalid PrivateKey format.",
        });
        return;
      }

      const publicKey = getPublicKey(privateKeyValue, coinType);

      const Taskdata = {
        WalletName,
        address: addressValue ?? publicKey,
        privateKey: privateKeyValue,
        coinType,
        balance: balance ?? "",
        key: rowKey ?? uuidv4(),
      };
      myGroupWallets.push(Taskdata);
    });

    if (myGroupWallets.length > 0) {
      const walletsData = {
        myGroupName: emptyGroups ? "walletGroup" : myGroupName,
        myGroupWallets,
      };
      saveTask(walletsData);
    }
  };

  const saveTask = (walletsData: {
    myGroupName: string;
    myGroupWallets: any[];
  }) => {
    // Get existing wallets from localStorage
    const storedWallets = localStorage.getItem("groupsWallet");
    const groupsWallet = storedWallets ? JSON.parse(storedWallets) : [];

    // Function to find a group by myGroupName
    const findGroupByName = (groupName: string) =>
      groupsWallet.find((group: any) => group.myGroupName === groupName);

    // Function to save data to localStorage
    const saveToLocalStorage = () => {
      localStorage.setItem("groupsWallet", JSON.stringify(groupsWallet));
      console.log("Data saved to localStorage:", groupsWallet);
    };

    // Edit Mode
    const editWallet = () => {
      const group = findGroupByName(walletsData.myGroupName);
      if (group) {
        const walletIndex = group.myGroupWallets.findIndex(
          (w: any) => w.key === rowKey
        );
        if (walletIndex !== -1) {
          // Update the existing wallet by merging new values
          group.myGroupWallets[walletIndex] = {
            ...group.myGroupWallets[walletIndex], // Keep existing values
            ...wallet, // Apply new values (assuming `wallet` contains updated wallet data)
          };
          console.log("Updated wallet:", group.myGroupWallets[walletIndex]);
          saveToLocalStorage();
        } else {
          console.log("Wallet not found for editing.");
        }
      } else {
        console.log("Group not found for editing.");
      }
    };

    // Add Mode
    const addWallet = () => {
      const group = findGroupByName(walletsData.myGroupName);

      if (group) {
        // Add new wallets to the existing group
        group.myGroupWallets.push(...walletsData.myGroupWallets);
        console.log("Added wallets to existing group:", group);
      } else {
        // If group doesn't exist, add a new group with wallets
        groupsWallet.push({
          myGroupName: walletsData.myGroupName,
          myGroupWallets: [...walletsData.myGroupWallets],
        });
        console.log("New group added with wallets:", walletsData);
      }
      saveToLocalStorage();
    };

    // Check if it's Edit Mode or Add Mode (use `wallet` and `rowKey` to determine Edit Mode)
    if (wallet && rowKey) {
      editWallet();
    } else {
      addWallet();
    }

    // Close the modal after saving
    onClose();
  };

  const handleClear = () => {
    setWalletValue("");
  };

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

  return (
    <ModalHeader
      label={titleValue}
      onClose={onClose}
      wrapperClassName="w-[56.25rem] h-[32.5rem]"
      onClear={handleClear}
      onSubmit={handleSubmit}
      textSubmit={isEdit ? "Edit" : "Add"}
      disabled={!!error}
    >
      <TextArea
        inputClassName="w-full h-full py-3 px-4 border border-borderLight dark:border-borderDropdown rounded-[8px] bg-white dark:bg-[#2A2A2C] text-default dark:text-white placeholder:placeholder  shadow-[0_4px_30px_rgba(0,0,0,0.1)] "
        placeholder="Name,PrivateKey"
        id="myWallets"
        value={walletValue}
        onChange={handleWalletChange}
        error={error}
        errorClassName="-bottom-5"
      />
    </ModalHeader>
  );
};

export default AddWalletsModal;
