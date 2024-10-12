import React, { FC, useEffect, useState } from "react";
import { validationSchemaMagicedenFarmer } from "../../../schema/Task";
import { z } from "zod";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import LabelAndInputModals from "../../../custom/LabelAndInputModals";
import { gasOptions } from "../../../../lib/globalVariables";
import LabelAndSwitch from "../../../custom/LabelAndSwitch";
import { toast } from "../../../ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import useFetchV3 from "../../../../hooks/useFetchV3";
import LabelWithDropdown from "../../../dropdowns/LabelWithDropdown";

interface Task {
  Mode: string;
  Proxy: string;
  WalletGroup: string;
  fpSafety: boolean;
  heliusRpc: string;
  isSafeMode: boolean;
  key: string;
  loopTask: boolean;
  myGasMode: string;
  myWallet: [string, ...string[]] | undefined;
  underBidAmount: string;
  myGroupName: string;
  percentageUndercut: String;
}
interface IPropsMagicedenFarmer {
  data: {
    myGroupName: string | undefined;
    mode: string | undefined;
    type: string | undefined;
  };
  onClose: () => void;
  objectEditData?: Task;
  tab: any;
  isEdit: boolean;
  selectedTasks: string[] | undefined;
  setHandleSubmit: (handleSubmit: () => void) => void;
  setHandleClear: (handleClear: () => void) => void;
}
const MagicedenFarmer: FC<IPropsMagicedenFarmer> = ({
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
  type IMagicedenFarmeResponse = z.infer<
    typeof validationSchemaMagicedenFarmer
  >;
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
  } = useFormik<Partial<IMagicedenFarmeResponse>>({
    initialValues: {
      Mode: objectEditData?.Mode ?? data.mode,
      Proxy: objectEditData?.Proxy ?? undefined,
      WalletGroup: objectEditData?.WalletGroup ?? undefined,
      fpSafety: objectEditData?.fpSafety ?? false,
      heliusRpc: objectEditData?.heliusRpc ?? "",
      isSafeMode: objectEditData?.isSafeMode ?? false,
      loopTask: objectEditData?.loopTask ?? false,
      myGasMode: objectEditData?.myGasMode ?? "Base",
      myGroupName: objectEditData?.myGroupName ?? undefined,
      myWallet: objectEditData?.myWallet ?? undefined,
      underBidAmount: objectEditData?.underBidAmount ?? undefined,
      key: objectEditData?.key ?? undefined,
      percentageUndercut:
        (objectEditData?.percentageUndercut &&
          String(objectEditData?.percentageUndercut)) ??
        undefined,
    },
    validationSchema: toFormikValidationSchema(validationSchemaMagicedenFarmer),
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
      Proxy: undefined,
      WalletGroup: undefined,
      fpSafety: false,
      heliusRpc: "",
      isSafeMode: false,
      loopTask: false,
      myGasMode: "Base",
      myGroupName: undefined,
      myWallet: undefined,
      underBidAmount: undefined,
      key: objectEditData?.key ?? undefined,
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
          label="Wallet Group* :"
          error={
            (touched.WalletGroup || submitCount > 0) && errors.WalletGroup
              ? errors.WalletGroup
              : undefined
          }
          clearSelectedValues={clearSelectedValues}
          setClearSelectedValues={setClearSelectedValues}
          fromFirst
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
          clearSelectedValues={clearSelectedValues}
          setClearSelectedValues={setClearSelectedValues}
          fromFirst
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
        {values.heliusRpc && !errors.heliusRpc ? (
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
        ) : null}
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
          clearSelectedValues={clearSelectedValues}
          setClearSelectedValues={setClearSelectedValues}
          fromFirst
          error={
            (touched.collectionsToBid || submitCount > 0) &&
            errors.collectionsToBid
              ? errors.collectionsToBid
              : undefined
          }
        />
        <LabelAndInputModals
          label="Under Cut Percentage  * :"
          labelClassName="w-full text-label"
          inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:  shadow-[0_4px_30px_rgba(0,0,0,0.1)]  text-white text-xs-plus placeholder:text-nickle"
          placeholder="Under Cut Percentage :"
          value={
            values.percentageUndercut ? values.percentageUndercut : undefined
          }
          onChange={(e) =>
            setFieldValue("percentageUndercut", e.target.value.trimStart())
          }
          error={
            (touched.percentageUndercut || submitCount > 0) &&
            errors.percentageUndercut
              ? errors.percentageUndercut
              : undefined
          }
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

export default MagicedenFarmer;
