import { useFormik } from "formik";
import React, { FC, useEffect, useState } from "react";
import { validationSchemaMagiceden } from "../../../schema/Task";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { toast } from "../../../ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import LabelWithDropdown from "../../../dropdowns/LabelWithDropdown";
import useFetchV3 from "../../../../hooks/useFetchV3";
import LabelAndInputModals from "../../../custom/LabelAndInputModals";

interface Task {
  Mode: string;
  Proxy: string;
  SnipingPrice: string;
  WalletGroup: string;
  collectionSlug: string;
  key: string;
  myGasMode: string;
  myWallet: string[];
}

interface IPropsMagiceden {
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
type IMagicedenResponse = z.infer<typeof validationSchemaMagiceden>;

const Magiceden: FC<IPropsMagiceden> = ({
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
    initialValues,
    submitCount,
    isSubmitting,
    setSubmitting,
    setValues,
  } = useFormik<Partial<IMagicedenResponse>>({
    initialValues: {
      Mode: objectEditData?.Mode ?? data.mode,
      Proxy: objectEditData?.Proxy ?? undefined,
      SnipingPrice: objectEditData?.SnipingPrice ?? undefined,
      WalletGroup: objectEditData?.WalletGroup ?? undefined,
      collectionSlug: objectEditData?.collectionSlug ?? undefined,
      myGasMode: objectEditData?.myGasMode ?? undefined,
      myWallet: objectEditData?.myWallet ?? undefined,
      key: objectEditData?.key ?? undefined,
    },
    validationSchema: toFormikValidationSchema(validationSchemaMagiceden),
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
      SnipingPrice: undefined,
      WalletGroup: undefined,
      collectionSlug: undefined,
      myGasMode: undefined,
      myWallet: undefined,
      key: undefined,
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
          deleteSecondValue={deleteSecondValue}
          setDeleteSecondValue={setDeleteSecondValue}
        />
      </div>
      <div className="w-full flex items-center gap-3">
        <LabelAndInputModals
          label="Collection Slug * :"
          labelClassName="w-full text-label"
          inputClassName="w-full h-10  text-xs-plus placeholder:text-nickle"
          placeholder="Write Collection Slug"
          value={values.collectionSlug}
          onChange={(e: { target: { value: string } }) =>
            setFieldValue("collectionSlug", e.target.value.trimStart())
          }
          error={
            (touched.collectionSlug || submitCount > 0) && errors.collectionSlug
              ? errors.collectionSlug
              : undefined
          }
        />{" "}
        <LabelAndInputModals
          label="Sniping Price* :"
          labelClassName="w-full text-label"
          inputClassName="w-full h-10  text-xs-plus placeholder:text-nickle"
          placeholder="Write Sniping Price"
          value={values.SnipingPrice}
          onChange={(e: { target: { value: string } }) =>
            setFieldValue("SnipingPrice", e.target.value.trimStart())
          }
          error={
            (touched.SnipingPrice || submitCount > 0) && errors.SnipingPrice
              ? errors.SnipingPrice
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default Magiceden;
