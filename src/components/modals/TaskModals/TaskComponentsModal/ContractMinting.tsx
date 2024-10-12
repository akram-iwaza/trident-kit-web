import { v4 as uuidv4 } from "uuid";
import { useFormik } from "formik";
import React, { FC, useEffect, useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import LabelWithDropdown from "../../../dropdowns/LabelWithDropdown";
import useFetchV2 from "../../../../hooks/useFetchV2";
import LabelAndInputModals from "../../../custom/LabelAndInputModals";
import CustomButton from "../../../custom/CustomButton";
import { toast } from "../../../ui/use-toast";
import { validationSchemaContractMinting } from "../../../schema/Task";
import AccordionComponent from "../../../custom/AccordionComponent";
import { handleKeyDown } from "../../../../lib/utils";
import { gasOptions } from "../../../../lib/globalVariables";
import useFetchV3 from "../../../../hooks/useFetchV3";

interface Task {
  ContractAddress: string;
  Mode: string;
  Price: string;
  Proxy: string;
  WalletGroup: string;
  key: string;
  mintFunctionName: string;
  mintFunctionParameters: string;
  myGasMode: string;
  myWallet: string[];
  nbGroupTask: string;
  gasLimit: string;
  gasPrice: string;
  maxPriorityFeePerGas: string;
}

interface IPropsContractMinting {
  data: {
    myGroupName: string | undefined;
    mode: string | undefined;
    type: string | undefined;
  };
  onClose: () => void;
  tab: any;
  objectEditData?: Task;
  isEdit: boolean;
  selectedTasks: string[] | undefined;
  setHandleSubmit: (handleSubmit: () => void) => void;
  setHandleClear: (handleClear: () => void) => void;
}
type IContractMintingResponse = z.infer<typeof validationSchemaContractMinting>;

const ContractMinting: FC<IPropsContractMinting> = ({
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
  const [clearSelectedValues, setClearSelectedValues] =
    useState<boolean>(false);
  const storedGroups = localStorage.getItem("groupsWallet");
  const wallets = storedGroups ? JSON.parse(storedGroups) : [];

  const storedGroups1 = localStorage.getItem("groupsProxy");
  const Proxies = storedGroups1 ? JSON.parse(storedGroups1) : [];
  const [walletNames, setWalletNames] = useState<string[]>([]);
  const {
    errors,
    touched,
    setFieldValue,
    handleSubmit,
    values,
    dirty,
    setSubmitting,
    submitCount,
    isSubmitting,
    initialValues,
    setValues,
  } = useFormik<Partial<IContractMintingResponse>>({
    initialValues: {
      Mode: objectEditData?.Mode ?? data.mode,
      ContractAddress: objectEditData?.ContractAddress ?? undefined,
      Price: objectEditData?.Price ?? undefined,
      Proxy: objectEditData?.Proxy ?? undefined,
      WalletGroup: objectEditData?.WalletGroup ?? undefined,
      gasLimit: objectEditData?.gasLimit ?? undefined,
      gasPrice: objectEditData?.gasPrice ?? undefined,
      maxPriorityFeePerGas: objectEditData?.maxPriorityFeePerGas ?? undefined,
      mintFunctionName: objectEditData?.mintFunctionName ?? undefined,
      mintFunctionParameters:
        objectEditData?.mintFunctionParameters ?? undefined,
      myGasMode: objectEditData?.myGasMode ?? undefined,
      myWallet: objectEditData?.myWallet ?? undefined,
      nbGroupTask: objectEditData?.nbGroupTask ?? undefined,
      key: objectEditData?.key ?? undefined,
    },
    validationSchema: toFormikValidationSchema(validationSchemaContractMinting),
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
      ContractAddress: undefined,
      Price: undefined,
      Proxy: undefined,
      WalletGroup: undefined,
      gasLimit: undefined,
      gasPrice: undefined,
      maxPriorityFeePerGas: undefined,
      mintFunctionName: undefined,
      mintFunctionParameters: undefined,
      myGasMode: undefined,
      myWallet: undefined,
      nbGroupTask: undefined,
      key: undefined,
      Mode: objectEditData?.Mode ?? data.mode,
    }));
    setClearSelectedValues(true);
  };

  useEffect(() => {
    const selectedWalletGroups = Array.isArray(values.WalletGroup)
      ? values.WalletGroup
      : [values.WalletGroup];

    if (selectedWalletGroups.length > 0) {
      const selectedGroups = wallets?.filter(
        (group: { myGroupName: string | undefined }) =>
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
  const [deleteSecondValue, setDeleteSecondValue] = useState(false);

  return (
    <div className="w-full flex flex-col gap-8">
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
          options={walletNames ? walletNames : []}
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
          fromFirst
          clearSelectedValues={clearSelectedValues}
          setClearSelectedValues={setClearSelectedValues}
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
          fromFirst
          clearSelectedValues={clearSelectedValues}
          setClearSelectedValues={setClearSelectedValues}
        />
      </div>
      <div className="w-full flex items-center gap-3">
        <LabelAndInputModals
          label="Contract Address * :"
          labelClassName="w-full text-label"
          inputClassName="w-full h-10  border border-borderLight dark:border-borders text-default dark:text-white text-xs-plus placeholder:text-nickle"
          placeholder="Write Contract Address"
          value={values.ContractAddress ?? ""}
          onChange={(e) =>
            setFieldValue("ContractAddress", e.target.value.trimStart())
          }
          error={
            (touched.ContractAddress || submitCount > 0) &&
            errors.ContractAddress
              ? errors.ContractAddress
              : undefined
          }
        />{" "}
        <LabelAndInputModals
          label="Mint Price* :"
          labelClassName="w-full text-label"
          inputClassName="w-full h-10  border border-borderLight dark:border-borders text-default dark:text-white text-xs-plus placeholder:text-nickle"
          placeholder="Write Mint Price"
          value={values.Price}
          onChange={(e) => setFieldValue("Price", e.target.value.trimStart())}
          error={
            (touched.Price || submitCount > 0) && errors.Price
              ? errors.Price
              : undefined
          }
        />
        <LabelAndInputModals
          label="Mint Parameters* :"
          labelClassName="w-full text-label"
          inputClassName="w-full h-10  border border-borderLight dark:border-borders text-default dark:text-white text-xs-plus placeholder:text-nickle"
          placeholder="Write Mint Parameters"
          value={values.mintFunctionParameters}
          onChange={(e) =>
            setFieldValue("mintFunctionParameters", e.target.value.trimStart())
          }
          error={
            (touched.mintFunctionParameters || submitCount > 0) &&
            errors.mintFunctionParameters
              ? errors.mintFunctionParameters
              : undefined
          }
        />
      </div>
      <div className="w-full flex items-center gap-3">
        <LabelAndInputModals
          label="Mint Function* :"
          labelClassName="w-full text-label"
          inputClassName="w-full h-10  border border-borderLight dark:border-borders text-default dark:text-white text-xs-plus placeholder:text-nickle"
          placeholder="Write Mint Function"
          value={values.mintFunctionName}
          onChange={(e) =>
            setFieldValue("mintFunctionName", e.target.value.trimStart())
          }
          error={
            (touched.mintFunctionName || submitCount > 0) &&
            errors.mintFunctionName
              ? errors.mintFunctionName
              : undefined
          }
        />
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
          fromFirst
          clearSelectedValues={clearSelectedValues}
          setClearSelectedValues={setClearSelectedValues}
        />
        <LabelAndInputModals
          label="Number Of Tasks* :"
          labelClassName="w-full text-label"
          inputClassName="w-full h-10  border border-borderLight dark:border-borders text-default dark:text-white text-xs-plus placeholder:text-nickle"
          placeholder="Write Number Of Tasks"
          value={values.nbGroupTask}
          onChange={(e) =>
            setFieldValue("nbGroupTask", e.target.value.trimStart())
          }
          onKeyDown={handleKeyDown}
          error={
            (touched.nbGroupTask || submitCount > 0) && errors.nbGroupTask
              ? errors.nbGroupTask
              : undefined
          }
        />
      </div>
      <div className="w-full">
        <AccordionComponent label={"Advanced Gas Settings"}>
          <div className="w-full flex items-center gap-3">
            <LabelAndInputModals
              label="Gas Base Fee :"
              labelClassName="w-full text-label"
              inputClassName="w-full h-10  border border-borderLight dark:border-borders text-default dark:text-white text-xs-plus placeholder:text-nickle"
              placeholder="Write Gas Base Fee"
              value={values.gasPrice}
              onChange={(e) =>
                setFieldValue("gasPrice", e.target.value.trimStart())
              }
              error={
                (touched.gasPrice || submitCount > 0) && errors.gasPrice
                  ? errors.gasPrice
                  : undefined
              }
            />
            <LabelAndInputModals
              label="Gas Priority :"
              labelClassName="w-full text-label"
              inputClassName="w-full h-10  border border-borderLight dark:border-borders text-default dark:text-white text-xs-plus placeholder:text-nickle"
              placeholder="Write Gas Priority"
              value={values.maxPriorityFeePerGas}
              onChange={(e) =>
                setFieldValue(
                  "maxPriorityFeePerGas",
                  e.target.value.trimStart()
                )
              }
              error={
                (touched.maxPriorityFeePerGas || submitCount > 0) &&
                errors.maxPriorityFeePerGas
                  ? errors.maxPriorityFeePerGas
                  : undefined
              }
            />
            <LabelAndInputModals
              label="Gas Limit :"
              labelClassName="w-full text-label"
              inputClassName="w-full h-10  border border-borderLight dark:border-borders text-default dark:text-white text-xs-plus placeholder:text-nickle"
              placeholder="Write Gas Limit"
              value={values.gasLimit}
              onChange={(e) =>
                setFieldValue("gasLimit", e.target.value.trimStart())
              }
              error={
                (touched.gasLimit || submitCount > 0) && errors.gasLimit
                  ? errors.gasLimit
                  : undefined
              }
            />
          </div>
        </AccordionComponent>
      </div>
    </div>
  );
};

export default ContractMinting;
