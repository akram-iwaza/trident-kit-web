import { useFormik } from "formik";
import React, { FC, useEffect, useState } from "react";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { v4 as uuidv4 } from "uuid";
import useFetchV3 from "../../../../hooks/useFetchV3";
import { validationSchemaDistricone } from "../../../schema/Task";
import { toast } from "../../../ui/use-toast";
import LabelWithDropdownIcons from "../../../dropdowns/LabelWithDropdownIcons";
import LabelAndInputModals from "../../../custom/LabelAndInputModals";
import LabelWithDropdown from "../../../dropdowns/LabelWithDropdown";
import LabelAndSwitch from "../../../custom/LabelAndSwitch";

interface ITask {
  Mode: string;
  Proxy: string;
  key: string;
  WalletGroup: string;
  myWallet: [string, ...string[]] | undefined;
  inviteCode: string;
  stakedModeSwitch: boolean;
  StageId: string;
  websocketUrl: string;
  CapsolverAPI: string | undefined;
  skipClaims: string;
}

interface IPropDistrictOne {
  data: {
    myGroupName: string | undefined;
    mode: string | undefined;
    type: string | undefined;
  };
  tab: any;
  onClose: () => void;
  objectEditData?: ITask;
  isEdit: boolean;
  selectedTasks: string[] | undefined;
  setHandleSubmit: (handleSubmit: () => void) => void;
  setHandleClear: (handleClear: () => void) => void;
}

const DistrictOne: FC<IPropDistrictOne> = ({
  objectEditData,
  isEdit,
  selectedTasks,
  onClose,
  data,
  setHandleSubmit,
  setHandleClear,
  tab,
}) => {
  const isEditAll = selectedTasks && selectedTasks?.length > 1;
  const [walletNames, setWalletNames] = useState<string[]>([]);
  const storedGroups = localStorage.getItem("groupsWallet");
  const wallets = storedGroups ? JSON.parse(storedGroups) : [];

  const storedGroups1 = localStorage.getItem("groupsProxy");
  const Proxies = storedGroups1 ? JSON.parse(storedGroups1) : [];
  type IDisctrictOneResponse = z.infer<typeof validationSchemaDistricone>;
  const [clearSelectedValues, setClearSelectedValues] =
    useState<boolean>(false);
  const {
    errors,
    values,
    handleSubmit,
    setFieldValue,
    submitCount,
    touched,
    setSubmitting,
    initialValues,
    isSubmitting,
    setValues,
  } = useFormik<Partial<IDisctrictOneResponse>>({
    initialValues: {
      Proxy: objectEditData?.Proxy ?? undefined,
      inviteCode: objectEditData?.inviteCode ?? "",
      stakedModeSwitch: objectEditData?.stakedModeSwitch ?? false,
      WalletGroup: objectEditData?.WalletGroup ?? "",
      myWallet: objectEditData?.myWallet ?? undefined,
      StageId: objectEditData?.StageId ?? "",
      websocketUrl: objectEditData?.websocketUrl ?? "",
      CapsolverAPI: objectEditData?.CapsolverAPI ?? "",
      skipClaims: objectEditData?.skipClaims ?? "",
      key: objectEditData?.key ?? undefined,
      Mode: data.mode,
    },
    validationSchema: toFormikValidationSchema(validationSchemaDistricone),
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
      Mode: data.mode,
      Proxy: objectEditData?.Proxy ?? undefined,
      inviteCode: "",
      stakedModeSwitch: false,
      WalletGroup: "",
      myWallet: undefined,
      StageId: "",
      websocketUrl: "",
      CapsolverAPI: "",
      skipClaims: "",
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
          label="Stage Id * :"
          labelClassName="w-full text-label"
          inputClassName="w-full !h-[2.2rem]  text-xs-plus placeholder:text-nickle"
          placeholder="write Stage Id"
          value={values.StageId}
          onChange={(e) => setFieldValue("StageId", e.target.value.trimStart())}
          error={
            (touched.StageId || submitCount > 0) && errors.StageId
              ? errors.StageId
              : undefined
          }
          errorClassName="-bottom-5"
        />
        <LabelAndInputModals
          label="Websocket Url * :"
          labelClassName="w-full text-label"
          inputClassName="w-full !h-[2.2rem]  text-xs-plus placeholder:text-nickle"
          placeholder="write Websocket Url"
          value={values.websocketUrl}
          onChange={(e) =>
            setFieldValue("websocketUrl", e.target.value.trimStart())
          }
          error={
            (touched.websocketUrl || submitCount > 0) && errors.websocketUrl
              ? errors.websocketUrl
              : undefined
          }
          errorClassName="-bottom-5"
        />
        <LabelAndInputModals
          label="Invite Code * :"
          labelClassName="w-full text-label"
          inputClassName="w-full !h-[2.2rem]  text-xs-plus placeholder:text-nickle"
          placeholder="write Invite Code"
          value={values.inviteCode}
          onChange={(e) =>
            setFieldValue("inviteCode", e.target.value.trimStart())
          }
          error={
            (touched.inviteCode || submitCount > 0) && errors.inviteCode
              ? errors.inviteCode
              : undefined
          }
          errorClassName="-bottom-5"
        />
      </div>
      <div className="w-full flex items-center gap-3">
        <LabelAndInputModals
          label="Capsolver API :"
          labelClassName="w-full text-label"
          inputClassName="w-full !h-[2.2rem]  text-xs-plus placeholder:text-nickle"
          placeholder="write Capsolver APIl"
          value={values.CapsolverAPI}
          onChange={(e) =>
            setFieldValue("CapsolverAPI", e.target.value.trimStart())
          }
          error={
            (touched.CapsolverAPI || submitCount > 0) && errors.CapsolverAPI
              ? errors.CapsolverAPI
              : undefined
          }
        />

        <LabelAndInputModals
          label="Percentage Of Claims :"
          labelClassName="w-full text-label"
          inputClassName="w-full !h-[2.2rem]  text-xs-plus placeholder:text-nickle"
          placeholder="write percentage of claims"
          value={values.skipClaims}
          onChange={(e) =>
            setFieldValue("skipClaims", e.target.value.trimStart())
          }
          error={
            (touched.skipClaims || submitCount > 0) && errors.skipClaims
              ? errors.skipClaims
              : undefined
          }
        />
        <LabelAndSwitch
          label={"is Stacked Account"}
          labelClassName="w-full text-label"
          inputClassName="w-full !h-[2.2rem]  text-xs-plus placeholder:text-nickle"
          wrapperClassName="w-[20rem] flex items-start"
          placeholder="0.00"
          checked={values.stakedModeSwitch ?? false}
          onClick={() =>
            setFieldValue("stakedModeSwitch", !values.stakedModeSwitch)
          }
          error={
            (touched.stakedModeSwitch || submitCount > 0) &&
            errors.stakedModeSwitch
              ? errors.stakedModeSwitch
              : undefined
          }
        />
      </div>
    </form>
  );
};

export default DistrictOne;
