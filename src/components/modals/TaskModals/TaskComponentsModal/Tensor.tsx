import React, { FC, useEffect, useState } from "react";
import { validationSchemaTensor } from "../../../schema/Task";
import { z } from "zod";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { gasOptions } from "../../../../lib/globalVariables";
import LabelAndSwitch from "../../../custom/LabelAndSwitch";
import { toast } from "../../../ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import useFetchV3 from "../../../../hooks/useFetchV3";
import LabelWithDropdown from "../../../dropdowns/LabelWithDropdown";
import LabelAndInputModals from "../../../custom/LabelAndInputModals";

interface Task {
  Mode: string;
  Proxy: string;
  WalletGroup: string;
  collectionsToBid: string;
  collectionsToSkip: string[];
  floorPriceRange: string[];
  fpSafety: boolean;
  heliusRpc: string;
  isAntiAcceptMode: boolean;
  isAutoBidder: boolean;
  isSafeMode: boolean;
  key: string;
  loopTask: boolean;
  myGasMode: string;
  myWallet: [string, ...string[]] | undefined;
  numberOfBids: string;
  underBidAmount: string;
  NumberOfBidders: string;
  NumberOfBids: string;
  myGroupName: string;
  priorityFee: string;
}

interface IPropsTensor {
  data: {
    myGroupName: string | undefined;
    mode: string | undefined;
    type: string | undefined;
  };
  tab: any;
  onClose: () => void;
  objectEditData?: Task;
  isEdit: boolean;
  selectedTasks: string[] | undefined;
  setHandleSubmit: (handleSubmit: () => void) => void;
  setHandleClear: (handleClear: () => void) => void;
}
const Tensor: FC<IPropsTensor> = ({
  data,
  onClose,
  objectEditData,
  isEdit,
  selectedTasks,
  setHandleSubmit,
  setHandleClear,
  tab,
}) => {
  const isEditAll = selectedTasks && selectedTasks?.length > 1;
  const storedGroups = localStorage.getItem("groupsWallet");
  const wallets = storedGroups ? JSON.parse(storedGroups) : [];

  const storedGroups1 = localStorage.getItem("groupsProxy");
  const Proxies = storedGroups1 ? JSON.parse(storedGroups1) : [];
  const [walletNames, setWalletNames] = useState<string[]>([]);
  const [slugs, setSlugs] = useState<string[]>([]);
  const [clearSelectedValues, setClearSelectedValues] =
    useState<boolean>(false);
  type ITensorResponse = z.infer<typeof validationSchemaTensor>;
  const {
    errors,
    touched,
    setFieldValue,
    handleSubmit,
    values,
    isSubmitting,
    submitCount,
    setSubmitting,
    initialValues,
    setValues,
  } = useFormik<Partial<ITensorResponse>>({
    initialValues: {
      Mode: objectEditData?.Mode ?? data.mode,
      NumberOfBidders: objectEditData?.NumberOfBidders ?? undefined,
      NumberOfBids: objectEditData?.NumberOfBids ?? undefined,
      Proxy: objectEditData?.Proxy ?? undefined,
      WalletGroup: objectEditData?.WalletGroup ?? undefined,
      collectionsToBid: objectEditData?.collectionsToBid ?? undefined,
      collectionsToSkip: objectEditData?.collectionsToSkip ?? [],
      floorPriceRange: objectEditData?.floorPriceRange ?? [],
      fpSafety: objectEditData?.fpSafety ?? false,
      heliusRpc: objectEditData?.heliusRpc ?? undefined,
      isAntiAcceptMode: objectEditData?.isAntiAcceptMode ?? false,
      isAutoBidder: objectEditData?.isAutoBidder ?? false,
      isSafeMode: objectEditData?.isSafeMode ?? false,
      loopTask: objectEditData?.loopTask ?? false,
      myGasMode: objectEditData?.myGasMode ?? undefined,
      myGroupName: objectEditData?.myGroupName ?? undefined,
      myWallet: objectEditData?.myWallet ?? undefined,
      numberOfBids: objectEditData?.numberOfBids ?? undefined,
      priorityFee: objectEditData?.priorityFee ?? undefined,
      underBidAmount: objectEditData?.underBidAmount ?? undefined,
      key: objectEditData?.key ?? undefined,
    },
    validationSchema: toFormikValidationSchema(validationSchemaTensor),
    onSubmit: (values) => {
      const key = uuidv4(); // Generate a unique key for the new account
      const formWithKey = { ...values, key }; // Add the key to the form data
      const storedAccount = localStorage.getItem("groupsTask");
      let groupsTask = storedAccount ? JSON.parse(storedAccount) : [];

      console.log("formWithKey: ", formWithKey);
      console.log("groupsTask: ", groupsTask);

      // Find the group that matches the form's myGroupName
      let groupFound = false;
      const updatedgroupsTask = groupsTask.map((group: any) => {
        if (group.myGroupName === tab) {
          groupFound = true;
          // Ensure that myGroupTasks is initialized as an array
          const updatedTasks = group.myGroupTasks
            ? [...group.myGroupTasks]
            : [];

          // Add the new account to the myGroupTasks array
          updatedTasks.push(formWithKey);

          return {
            ...group,
            myGroupTasks: updatedTasks, // Set the updated tasks array
          };
        }
        return group; // If no match, return the group unchanged
      });

      // If no group was found, add a new group with the account
      if (!groupFound) {
        updatedgroupsTask.push({
          myGroupName: tab,
          myGroupTasks: [formWithKey], // Add the form data to the new group
        });
      }

      // Save the updated groupsTask back to localStorage
      localStorage.setItem("groupsTask", JSON.stringify(updatedgroupsTask));
      onClose();

      console.log("Updated groupsTask: ", updatedgroupsTask);
    },
  });

  const handleClearValues = () => {
    setValues(() => ({
      Mode: objectEditData?.Mode ?? data.mode,
      NumberOfBidders: undefined,
      NumberOfBids: undefined,
      Proxy: undefined,
      WalletGroup: undefined,
      collectionsToBid: undefined,
      collectionsToSkip: [],
      floorPriceRange: [],
      fpSafety: false,
      heliusRpc: undefined,
      isAntiAcceptMode: false,
      isAutoBidder: false,
      isSafeMode: false,
      loopTask: false,
      myGasMode: undefined,
      myGroupName: undefined,
      myWallet: undefined,
      numberOfBids: undefined,
      priorityFee: undefined,
      underBidAmount: undefined,
      key: undefined,
    }));
    setClearSelectedValues(true);
  };

  useEffect(() => {
    const selectedWalletGroups = Array.isArray(values.WalletGroup)
      ? values.WalletGroup
      : [values.WalletGroup];

    if (selectedWalletGroups.length > 0) {
      const selectedGroups = wallets?.filter((group: { myGroupName: string }) =>
        selectedWalletGroups.includes(group.myGroupName)
      );

      const newWalletNames = selectedGroups
        ? selectedGroups.flatMap((group: { myGroupWallets: any[] }) =>
            group.myGroupWallets.map(
              (wallet: { WalletName: any }) => wallet.WalletName
            )
          )
        : [];

      setWalletNames(newWalletNames);
    } else {
      setWalletNames([]); // Clear wallet names if no valid group is selected
    }
  }, [values.WalletGroup, wallets]);

  useEffect(() => {
    setHandleSubmit(() => handleSubmit);
    setHandleClear(() => handleClearValues);
  }, [setHandleSubmit, setHandleClear]);

  useEffect(() => {
    const fetchSlugs = async () => {
      try {
        const response = await fetch(
          "http://34.214.96.241:3000/supportedSlugs/"
        );
        const data = await response.json();
        const slugsData = Object.keys(data);
        setSlugs(slugsData);
      } catch (error) {
        console.error("Failed to fetch slugs:", error);
      } finally {
      }
    };

    fetchSlugs();
  }, []);
  const [deleteSecondValue, setDeleteSecondValue] = useState(false);

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
      <div className="w-full flex items-center gap-3">
        <LabelWithDropdown
          isSearch
          options={
            wallets?.map((group: { myGroupName: any }) => group.myGroupName) ??
            []
          }
          placeholder="Select Wallet Group"
          defaultValue={values.WalletGroup ? values.WalletGroup : undefined}
          onSelect={(value: string | string[]) => {
            setFieldValue("WalletGroup", value);
            setDeleteSecondValue(true);
            setFieldValue("myWallet", undefined);
          }}
          deleteFieldValue={(field: string) => {
            setFieldValue("WalletGroup", undefined);
            setDeleteSecondValue(true);
            setFieldValue("myWallet", undefined);
          }}
          fieldValue={"WalletGroup"}
          clearSelectedValues={clearSelectedValues}
          setClearSelectedValues={setClearSelectedValues}
          fromFirst
          label="Wallet Group* :"
          error={
            (touched.WalletGroup || submitCount > 0) && errors.WalletGroup
              ? errors.WalletGroup
              : undefined
          }
        />
        <LabelWithDropdown
          isSearch
          options={walletNames}
          placeholder="Select Wallets"
          onSelect={(value: string | string[]) => {
            setFieldValue("myWallet", value);
          }}
          deleteFieldValue={(field: string) => {
            setFieldValue("myWallet", undefined);
          }}
          fieldValue={"myWallet"}
          clearSelectedValues={clearSelectedValues}
          setClearSelectedValues={setClearSelectedValues}
          fromFirst
          label="Wallet Name* :"
          defaultValue={values.myWallet ?? undefined}
          multiSelect={true}
          disabled={!values.WalletGroup}
          error={
            (touched.myWallet || submitCount > 0) && errors.myWallet
              ? errors.myWallet === "Invalid input"
                ? "Required"
                : errors.myWallet
              : undefined
          }
          deleteSecondValue={deleteSecondValue}
          setDeleteSecondValue={setDeleteSecondValue}
        />
        <LabelWithDropdown
          isSearch
          options={
            Proxies?.map((group: { myGroupName: any }) => group.myGroupName) ??
            []
          }
          placeholder="Select Proxy"
          defaultValue={values.Proxy ? values.Proxy : undefined}
          onSelect={(value: string | string[]) => setFieldValue("Proxy", value)}
          deleteFieldValue={(field: string) => {
            setFieldValue("Proxy", undefined);
          }}
          fieldValue={"Proxy"}
          label="Proxies* :"
          error={
            (touched.Proxy || submitCount > 0) && errors.Proxy
              ? errors.Proxy
              : undefined
          }
          clearSelectedValues={clearSelectedValues}
          setClearSelectedValues={setClearSelectedValues}
          fromFirst
        />
      </div>
      <div className="w-full flex items-center gap-3">
        <LabelAndInputModals
          label="heliusRpc :"
          labelClassName="w-full text-label"
          inputClassName="w-full !h-[2.2rem]  text-xs-plus placeholder:text-nickle"
          placeholder="heliusRpc"
          value={values.heliusRpc}
          onChange={(e) =>
            setFieldValue("heliusRpc", e.target.value.trimStart())
          }
          error={
            (touched.heliusRpc || submitCount > 0) && errors.heliusRpc
              ? errors.heliusRpc
              : undefined
          }
        />
        <LabelAndInputModals
          label="Number Of Bids :"
          labelClassName="w-full text-label"
          inputClassName="w-full !h-[2.2rem]  text-xs-plus placeholder:text-nickle"
          placeholder="Number Of Bids"
          value={values.numberOfBids}
          onChange={(e) =>
            setFieldValue("numberOfBids", e.target.value.trimStart())
          }
          error={
            (touched.numberOfBids || submitCount > 0) && errors.numberOfBids
              ? errors.numberOfBids
              : undefined
          }
        />
        <LabelAndInputModals
          label="Under Bid Amount (SOL) :"
          labelClassName="w-full text-label"
          inputClassName="w-full !h-[2.2rem]  text-xs-plus placeholder:text-nickle"
          placeholder="amount.."
          value={values.underBidAmount}
          onChange={(e) =>
            setFieldValue("underBidAmount", e.target.value.trimStart())
          }
          error={
            (touched.underBidAmount || submitCount > 0) && errors.underBidAmount
              ? errors.underBidAmount
              : undefined
          }
        />
      </div>
      <div className="w-full flex items-center gap-3">
        <LabelWithDropdown
          isSearch
          options={gasOptions?.map((x) => x) ?? []}
          placeholder="Select Gas Mode"
          defaultValue={values.myGasMode ? values.myGasMode : undefined}
          onSelect={(value: string | string[]) =>
            setFieldValue("myGasMode", value)
          }
          deleteFieldValue={(field: string) => {
            setFieldValue("myGasMode", undefined);
          }}
          fieldValue={"myGasMode"}
          label="Gas Mode * :"
          error={
            (touched.myGasMode || submitCount > 0) && errors.myGasMode
              ? errors.myGasMode
              : undefined
          }
          clearSelectedValues={clearSelectedValues}
          setClearSelectedValues={setClearSelectedValues}
          fromFirst
        />
        <LabelWithDropdown
          isSearch
          options={slugs?.map((x) => x) ?? []}
          placeholder="Select a slug"
          defaultValue={
            values.collectionsToBid ? values.collectionsToBid : undefined
          }
          onSelect={(value: string | string[]) =>
            setFieldValue("collectionsToBid", value)
          }
          deleteFieldValue={(field: string) => {
            setFieldValue("collectionsToBid", undefined);
          }}
          fieldValue={"collectionsToBid"}
          label="Select a slug * :"
          error={
            (touched.collectionsToBid || submitCount > 0) &&
            errors.collectionsToBid
              ? errors.collectionsToBid
              : undefined
          }
          clearSelectedValues={clearSelectedValues}
          setClearSelectedValues={setClearSelectedValues}
          fromFirst
        />
      </div>
      <div className="w-full flex items-center gap-3">
        <LabelAndSwitch
          label={"Loop Task"}
          labelClassName="w-full text-label"
          inputClassName="w-full !h-[2.2rem]  text-xs-plus placeholder:text-nickle"
          placeholder="0.00"
          wrapperClassName="w-fit"
          checked={values.loopTask ?? false}
          onClick={() => setFieldValue("loopTask", !values.loopTask)}
          error={
            (touched.loopTask || submitCount > 0) && errors.loopTask
              ? errors.loopTask
              : undefined
          }
        />
        <LabelAndSwitch
          label={"FP safety"}
          labelClassName="w-full text-label"
          inputClassName="w-full !h-[2.2rem]  text-xs-plus placeholder:text-nickle"
          placeholder="0.00"
          wrapperClassName="w-fit"
          checked={values.fpSafety ?? false}
          onClick={() => setFieldValue("fpSafety", !values.fpSafety)}
          error={
            (touched.fpSafety || submitCount > 0) && errors.fpSafety
              ? errors.fpSafety
              : undefined
          }
        />
      </div>
    </form>
  );
};

export default Tensor;
