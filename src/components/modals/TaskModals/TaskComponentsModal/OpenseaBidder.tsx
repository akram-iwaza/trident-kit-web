import React, { FC, useEffect, useState } from "react";
import { toast } from "../../../ui/use-toast";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import useFetchV3 from "../../../../hooks/useFetchV3";
import { validationSchemaOpenseaBidder } from "../../../schema/Task";
import LabelWithDropdown from "../../../dropdowns/LabelWithDropdown";
import DelayInputString from "../../../custom/DelayInputString";
import LabelAndInputModals from "../../../custom/LabelAndInputModals";
import DropdownHover from "../../../dropdowns/DropdownHover";

interface Task {
  Mode: string;
  WalletGroup: string;
  myWallet: string[];
  Proxy: string;
  maxAmount: string;
  minAmount: string;
  slug: string;
  outBid: string;
  key: string;
  handleSelect: any;
}

interface IPropsOpenseaBidder {
  data: {
    myGroupName: string | undefined;
    mode: string | undefined;
    type: string | undefined;
  };
  onClose: () => void;
  objectEditData?: Task;
  isEdit: boolean;
  selectedTasks: string[] | undefined;
  setHandleSubmit: (handleSubmit: () => void) => void;
  tab: any;
  setHandleClear: (handleClear: () => void) => void;
}

const OpenseaBidder: FC<IPropsOpenseaBidder> = ({
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
  const [deleteSecondValue, setDeleteSecondValue] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [categories, setCategories] = useState<any>();
  type IOpenseaResponse = z.infer<typeof validationSchemaOpenseaBidder>;
  const [resetDropdown, setResetDropdown] = useState(false);

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
    setFieldTouched,
  } = useFormik<Partial<IOpenseaResponse>>({
    initialValues: {
      Mode: objectEditData?.Mode ?? data.mode,
      Proxy: objectEditData?.Proxy ?? undefined,
      maxAmount: objectEditData?.maxAmount ?? undefined,
      WalletGroup: objectEditData?.WalletGroup ?? undefined,
      minAmount: objectEditData?.minAmount ?? undefined,
      myWallet: objectEditData?.myWallet ?? undefined,
      slug: objectEditData?.slug ?? undefined,
      outBid: objectEditData?.outBid ?? undefined,
      handleSelect: objectEditData?.handleSelect ?? undefined,
      key: objectEditData?.key ?? undefined,
    },
    validationSchema: toFormikValidationSchema(validationSchemaOpenseaBidder),
    onSubmit: (values) => {
      const key = uuidv4(); // Generate a unique key for the new account
      const formWithKey = { ...values, key }; // Add the key to the form data
      const storedAccount = localStorage.getItem("groupsTask");
      let groupsTask = storedAccount ? JSON.parse(storedAccount) : [];

      console.log("formWithKey: ", formWithKey);
      console.log("groupsTask: ", groupsTask);

      // Find the group that matches the form's myGroupName
      const updatedgroupsTask = groupsTask.map((group: any) => {
        if (group.myGroupName === tab) {
          // Add the new account to the myGroupAccounts array
          return {
            ...group,
            myGroupTasks: [...group.myGroupTasks, formWithKey],
          };
        }
        return group; // If no match, return the group unchanged
      });

      // If no group was found, add a new group with the account
      if (!updatedgroupsTask.find((group: any) => group.myGroupName === tab)) {
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
    setResetDropdown(true); // Toggle the reset state
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

  const handleSelect = (mainValue: string, subTaskValue?: string) => {
    const selectedData = {
      type: mainValue,
      mode: subTaskValue || mainValue,
    };

    setValues((prev: any) => ({
      ...prev,
      handleSelect: JSON.stringify(selectedData), // Convert to JSON string
    }));
  };

  const handleCategoriesData = (event: any, res: any) => {
    if (
      res &&
      res.categoriesData &&
      res.categoriesData.categories &&
      res.categoriesData.counts
    ) {
      const formattedCategories: any[] = Object.keys(
        res.categoriesData.categories
      ).map((category, index) => {
        const subCategories = Object.keys(
          res.categoriesData.counts[category] || {}
        ).map((subCategory, subIndex) => ({
          id: subIndex,
          label: subCategory,
          value: subCategory,
        }));
        setShowInput(true);
        return {
          id: index,
          label: category,
          value: category,
          subTasks: subCategories,
        };
      });
      setCategories(formattedCategories);
    } else {
      console.log("Invalid data format:", res);
    }
  };

  console.log("values.slug : ", values);

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
        <DelayInputString
          wrapperClassName="w-full"
          label="Min Amount"
          value={values.minAmount || ""} // Show empty if undefined or 0
          onChange={(value: string) => {
            setFieldValue("minAmount", value, true);
          }}
          error={touched.minAmount && errors.minAmount}
          onBlur={() => {
            setFieldTouched("minAmount", true);
          }}
        />
        <DelayInputString
          wrapperClassName="w-full"
          label="Max Amount"
          value={values.maxAmount || ""} // Show empty if undefined or 0
          onChange={(value: string) => {
            setFieldValue("maxAmount", value, true);
          }}
          error={touched.maxAmount && errors.maxAmount}
          onBlur={() => {
            setFieldTouched("maxAmount", true);
          }}
        />
        <DelayInputString
          wrapperClassName="w-full"
          label="Out Bid"
          value={values.outBid || ""} // Show empty if undefined or 0
          onChange={(value: string) => {
            setFieldValue("outBid", value, true);
          }}
          error={touched.outBid && errors.outBid}
          onBlur={() => {
            setFieldTouched("outBid", true);
          }}
        />
      </div>
      <div className="w-full flex items-center gap-3">
        <LabelAndInputModals
          label="Slug :"
          labelClassName="w-full text-label"
          inputClassName="w-full !h-[2.2rem]  text-xs-plus placeholder:text-nickle"
          placeholder="Slug"
          value={values.slug}
          onChange={(e) => setFieldValue("slug", e.target.value.trimStart())}
        />
        {showInput && values.slug && (
          <DropdownHover
            options={categories ?? []}
            label="Select Category : "
            onSelect={handleSelect}
            reset={resetDropdown}
            setResetDropdown={setResetDropdown}
            wrapperClassName="!h-[2.2rem] mt-1"
            value={values.handleSelect}
          />
        )}
      </div>
    </div>
  );
};

export default OpenseaBidder;
