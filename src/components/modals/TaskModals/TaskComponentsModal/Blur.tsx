import React, { FC, useEffect, useState } from "react";
import { validationSchemaBlurBidder } from "../../../schema/Task";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useFormik } from "formik";
import useFetchV2 from "../../../../hooks/useFetchV2";
import LabelWithDropdown from "../../../dropdowns/LabelWithDropdown";
import LabelAndSwitch from "../../../custom/LabelAndSwitch";
import LabelAndInputModals from "../../../custom/LabelAndInputModals";
import LabelInputNumbered from "../../../custom/LabelInputNumbered";
import CustomButton from "../../../custom/CustomButton";
import { toast } from "../../../ui/use-toast";
import { gasOptions } from "../../../../lib/globalVariables";
import { v4 as uuidv4 } from "uuid";
import useFetchV3 from "../../../../hooks/useFetchV3";

interface Task {
  Mode: string;
  Proxy: string;
  WalletGroup: string;
  collectionsToBid: string[];
  collectionsToSkip: string[];
  floorPriceRange: [string, string];
  fpSafety: boolean;
  isAdvancedMode: boolean;
  isAntiAcceptMode: boolean;
  isAutoBidder: boolean;
  isBlast: boolean;
  isSafeMode: boolean;
  key: string;
  myGasMode: string;
  myGroupName: string;
  myWallet: [string, ...string[]] | undefined;
  percentageOfBids: string;
  positionToBidAt: string;
  NumberOfBidders: string;
  NumberOfBids: string;
  OwnershipThreshold: string;
}

interface IPropsBlur {
  data: {
    myGroupName: string | undefined;
    mode: string | undefined;
    type: string | undefined;
  };
  onClose: () => void;
  objectEditData?: Task;
  isEdit: boolean;
  selectedTasks: string[] | undefined;
  tab: any;
  setHandleSubmit: (handleSubmit: () => void) => void;
  setHandleClear: (handleClear: () => void) => void;
}

const Blur: FC<IPropsBlur> = ({
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
  const [clearSelectedValues, setClearSelectedValues] =
    useState<boolean>(false);
  type IBlurBidderResponse = z.infer<typeof validationSchemaBlurBidder>;
  const {
    errors,
    touched,
    setFieldValue,
    handleSubmit,
    values,
    isSubmitting,
    initialValues,
    setSubmitting,
    submitCount,
    setValues,
  } = useFormik<Partial<IBlurBidderResponse>>({
    initialValues: {
      Mode: objectEditData?.Mode ?? data.mode,
      NumberOfBidders: objectEditData?.NumberOfBidders ?? undefined,
      NumberOfBids: objectEditData?.NumberOfBids ?? undefined,
      OwnershipThreshold: objectEditData?.OwnershipThreshold ?? undefined,
      Proxy: objectEditData?.Proxy ?? undefined,
      WalletGroup: objectEditData?.WalletGroup ?? undefined,
      collectionsToBid: objectEditData?.collectionsToBid ?? [],
      collectionsToSkip: objectEditData?.collectionsToSkip ?? undefined,
      floorPriceRange: objectEditData?.floorPriceRange ?? [],
      fpSafety: objectEditData?.fpSafety ?? false,
      isAdvancedMode: objectEditData?.isAdvancedMode ?? false,
      isAntiAcceptMode: objectEditData?.isAntiAcceptMode ?? false,
      isAutoBidder: objectEditData?.isAutoBidder ?? false,
      isBlast: objectEditData?.isBlast ?? false,
      isSafeMode: objectEditData?.isSafeMode ?? false,
      myGasMode: objectEditData?.myGasMode ?? undefined,
      myGroupName: objectEditData?.myGroupName ?? data.myGroupName,
      myWallet: objectEditData?.myWallet ?? undefined,
      percentageOfBids: objectEditData?.percentageOfBids ?? undefined,
      positionToBidAt: objectEditData?.positionToBidAt ?? undefined,
      key: objectEditData?.key ?? undefined,
    },
    validationSchema: toFormikValidationSchema(validationSchemaBlurBidder),
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
      OwnershipThreshold: undefined,
      Proxy: undefined,
      WalletGroup: undefined,
      collectionsToBid: [],
      collectionsToSkip: undefined,
      floorPriceRange: [],
      fpSafety: false,
      isAdvancedMode: false,
      isAntiAcceptMode: false,
      isAutoBidder: false,
      isBlast: false,
      isSafeMode: false,
      myGasMode: undefined,
      myGroupName: data.myGroupName,
      myWallet: undefined,
      percentageOfBids: undefined,
      positionToBidAt: undefined,
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
          label="Proxies* :"
          deleteFieldValue={(field: string) => {
            setFieldValue("Proxy", undefined);
          }}
          fieldValue={"Proxy"}
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
        <LabelAndSwitch
          label={"Advanced Mode"}
          labelClassName="w-full "
          inputClassName="w-full h-10  text-xs-plus placeholder:text-nickle"
          placeholder="0.00"
          checked={values.isAdvancedMode ?? false}
          onClick={() => {
            setFieldValue("isAdvancedMode", !values.isAdvancedMode);
            setFieldValue("percentageOfBids", undefined);
            setFieldValue("positionToBidAt", undefined);
            setFieldValue("OwnershipThreshold", undefined);
            setFieldValue("NumberOfBids", undefined);
            setFieldValue("NumberOfBidders", undefined);
          }}
          error={
            (touched.isAdvancedMode || submitCount > 0) && errors.isAdvancedMode
              ? errors.isAdvancedMode
              : undefined
          }
        />
        <LabelAndSwitch
          label={"Safe Mode"}
          labelClassName="w-full "
          inputClassName="w-full h-10  text-xs-plus placeholder:text-nickle"
          placeholder="0.00"
          checked={values.isSafeMode ?? false}
          onClick={() => setFieldValue("isSafeMode", !values.isSafeMode)}
          error={
            (touched.isSafeMode || submitCount > 0) && errors.isSafeMode
              ? errors.isSafeMode
              : undefined
          }
        />
        <LabelAndSwitch
          label={"Anti-Accept Mode"}
          labelClassName="w-full "
          inputClassName="w-full h-10  text-xs-plus placeholder:text-nickle"
          placeholder="0.00"
          checked={values.isAntiAcceptMode ?? false}
          onClick={() =>
            setFieldValue("isAntiAcceptMode", !values.isAntiAcceptMode)
          }
          error={
            (touched.isAntiAcceptMode || submitCount > 0) &&
            errors.isAntiAcceptMode
              ? errors.isAntiAcceptMode
              : undefined
          }
        />
        <LabelAndSwitch
          label={"Blast Network"}
          labelClassName="w-full "
          inputClassName="w-full h-10  text-xs-plus placeholder:text-nickle"
          placeholder="0.00"
          checked={values.isBlast ?? false}
          onClick={() => setFieldValue("isBlast", !values.isBlast)}
          error={
            (touched.isBlast || submitCount > 0) && errors.isBlast
              ? errors.isBlast
              : undefined
          }
        />
        <LabelAndSwitch
          label={"Floor Price Safety"}
          labelClassName="w-full "
          inputClassName="w-full h-10  text-xs-plus placeholder:text-nickle"
          placeholder="0.00"
          checked={values.fpSafety ?? false}
          onClick={() => setFieldValue("fpSafety", !values.fpSafety)}
          error={
            (touched.fpSafety || submitCount > 0) && errors.fpSafety
              ? errors.fpSafety
              : undefined
          }
        />
        <LabelAndSwitch
          label={values.isAutoBidder ? "Automated Bidder" : "Manual Bidder"}
          labelClassName="w-full "
          inputClassName="w-full h-10  text-xs-plus placeholder:text-nickle"
          placeholder="0.00"
          checked={values.isAutoBidder ?? false}
          onClick={() => {
            setFieldValue("isAutoBidder", !values.isAutoBidder);
            setFieldValue("collectionsToBid", []);
            setFieldValue("floorPriceRange", []);
          }}
          error={
            (touched.isAutoBidder || submitCount > 0) && errors.isAutoBidder
              ? errors.isAutoBidder
              : undefined
          }
        />
      </div>
      <div className="w-full flex items-center gap-3">
        {values.isAdvancedMode ? (
          <>
            <LabelInputNumbered
              label="Collections To Skip"
              placeholder="Collections..."
              onChange={(value: any) => {
                setFieldValue("collectionsToSkip", value);
              }}
              initialValues={values.collectionsToSkip}
            />

            <LabelAndInputModals
              label="Number Of Bids :"
              labelClassName="w-full text-label"
              inputClassName="w-full !h-[2.2rem]   text-xs-plus placeholder:text-nickle"
              placeholder="Number Of Bids"
              value={values.percentageOfBids}
              onChange={(e) =>
                setFieldValue("percentageOfBids", e.target.value.trimStart())
              }
              error={
                (touched.percentageOfBids || submitCount > 0) &&
                errors.percentageOfBids
                  ? errors.percentageOfBids
                  : undefined
              }
            />
            <LabelAndInputModals
              label="Position To Bid At :"
              labelClassName="w-full text-label"
              inputClassName="w-full !h-[2.2rem]   text-xs-plus placeholder:text-nickle"
              placeholder="Position To Bid At"
              value={values.positionToBidAt}
              onChange={(e) =>
                setFieldValue("positionToBidAt", e.target.value.trimStart())
              }
              error={
                (touched.positionToBidAt || submitCount > 0) &&
                errors.positionToBidAt
                  ? errors.positionToBidAt
                  : undefined
              }
            />
          </>
        ) : (
          <>
            <LabelInputNumbered
              label="Collections To Skip"
              placeholder="Collections..."
              onChange={(value: any) => {
                setFieldValue("collectionsToSkip", value);
              }}
              initialValues={values.collectionsToSkip}
            />

            <LabelAndInputModals
              label="Ownership Threshold :"
              labelClassName="w-full text-label"
              inputClassName="w-full !h-[2.2rem]  text-xs-plus placeholder:text-nickle"
              placeholder="Ownership Threshold"
              value={values.OwnershipThreshold}
              onChange={(e) =>
                setFieldValue("OwnershipThreshold", e.target.value.trimStart())
              }
              error={
                (touched.OwnershipThreshold || submitCount > 0) &&
                errors.OwnershipThreshold
                  ? errors.OwnershipThreshold
                  : undefined
              }
            />
            <LabelAndInputModals
              label="Number Bids :"
              labelClassName="w-full text-label"
              inputClassName="w-full !h-[2.2rem]   text-xs-plus placeholder:text-nickle"
              placeholder="Number Bids"
              value={values.NumberOfBids}
              onChange={(e) =>
                setFieldValue("NumberOfBids", e.target.value.trimStart())
              }
              error={
                (touched.NumberOfBids || submitCount > 0) && errors.NumberOfBids
                  ? errors.NumberOfBids
                  : undefined
              }
            />
            <LabelAndInputModals
              label="Number Of Bidders :"
              labelClassName="w-full text-label"
              inputClassName="w-full !h-[2.2rem]   text-xs-plus placeholder:text-nickle"
              placeholder="Number Of Bidders"
              value={values.NumberOfBidders}
              onChange={(e) =>
                setFieldValue("NumberOfBidders", e.target.value.trimStart())
              }
              error={
                (touched.NumberOfBidders || submitCount > 0) &&
                errors.NumberOfBidders
                  ? errors.NumberOfBidders
                  : undefined
              }
            />
          </>
        )}
      </div>
      <div className="w-full flex items-center gap-3">
        {values.isAutoBidder ? (
          <div className="w-full flex items-center gap-3">
            <LabelAndInputModals
              label="Floor Pricing"
              labelClassName="w-full text-label"
              inputClassName="w-full !h-[2.2rem]   text-xs-plus placeholder:text-nickle"
              placeholder="Start Price"
              value={values.floorPriceRange && values.floorPriceRange[0]}
              onChange={(e) => {
                const updatedRange = [...(values.floorPriceRange || ["", ""])];
                updatedRange[0] = e.target.value.trimStart();
                setFieldValue("floorPriceRange", updatedRange);
              }}
              error={
                (touched.floorPriceRange || submitCount > 0) &&
                errors.floorPriceRange
                  ? errors.floorPriceRange[0]
                  : undefined
              }
            />
            <LabelAndInputModals
              labelClassName="w-full text-label"
              inputClassName="w-full !h-[2.2rem]   text-xs-plus placeholder:text-nickle"
              placeholder="End Price"
              value={values.floorPriceRange && values.floorPriceRange[1]}
              onChange={(e) => {
                const updatedRange = [...(values.floorPriceRange || ["", ""])];
                updatedRange[1] = e.target.value.trimStart();
                setFieldValue("floorPriceRange", updatedRange);
              }}
              error={
                (touched.floorPriceRange || submitCount > 0) &&
                errors.floorPriceRange
                  ? errors.floorPriceRange[1]
                  : undefined
              }
            />
          </div>
        ) : (
          <LabelInputNumbered
            label="Collections To Bid"
            placeholder="Collections..."
            onChange={(value: any) => {
              setFieldValue("collectionsToBid", value);
            }}
            initialValues={values.collectionsToBid}
          />
        )}
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
      </div>
    </form>
  );
};

export default Blur;
