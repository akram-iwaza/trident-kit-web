import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { toast } from "../../../ui/use-toast";
import LabelAndSwitch from "../../../custom/LabelAndSwitch";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { validationSchemaMultifarm } from "../../../schema/Task";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import LabelWithDropdown from "../../../dropdowns/LabelWithDropdown";
import LabelAndInputModals from "../../../custom/LabelAndInputModals";
import useFetchV3 from "../../../../hooks/useFetchV3";

interface ITask {
  Mode: string;
  Proxy: any;
  key: string;
  selectedAccountKey: any;
  inviteCode: string;
  skipTwitterAction: boolean;
  selectedAccountGroup: any;
  multiFarmModeChange: any;
  setPartnersToSkip: any;
  enterRaffles: any;
  enterRafflePercentage: any;
  Pledge: any;
  pledgePercentage: any;
}
interface IPropsMultifarm {
  data: {
    myGroupName: string | undefined;
    mode: string | undefined;
    type: string | undefined;
  };
  onClose: () => void;
  objectEditData?: ITask;
  isEdit: boolean;
  tab: any;
  selectedTasks: string[] | undefined;
  setHandleSubmit: (handleSubmit: () => void) => void;
  setHandleClear: (handleClear: () => void) => void;
}

const Multifarm = ({
  data,
  onClose,
  objectEditData,
  isEdit,
  selectedTasks,
  setHandleSubmit,
  setHandleClear,
  tab,
}: IPropsMultifarm) => {
  const [clearSelectedValues, setClearSelectedValues] = useState(false);
  const isEditAll = selectedTasks && selectedTasks?.length > 1;
  const storedGroups = localStorage.getItem("groupsAccount");
  const AccountsData = storedGroups ? JSON.parse(storedGroups) : [];

  const storedGroups1 = localStorage.getItem("groupsProxy");
  const Proxies = storedGroups1 ? JSON.parse(storedGroups1) : [];

  const [selectedGroupNames, setSelectedGroupNames] = useState<string[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<any[]>([]);
  const [deleteSecondValue, setDeleteSecondValue] = useState(false);

  type IMultifarmnResponse = z.infer<typeof validationSchemaMultifarm>;

  const {
    errors,
    values,
    handleSubmit,
    setFieldValue,
    submitCount,
    touched,
    setSubmitting,
    initialValues,
    setValues,
  } = useFormik<Partial<IMultifarmnResponse>>({
    initialValues: {
      proxy: objectEditData?.Proxy ?? [],
      myGroupName: tab,
      mode: "MultiFarm",
      inviteCode: objectEditData?.inviteCode ?? "",
      skipTwitterAction: objectEditData?.skipTwitterAction ?? false,
      selectedAccountGroup: objectEditData?.selectedAccountGroup ?? [],
      selectedAccountKey: objectEditData?.selectedAccountKey
        ? [objectEditData?.selectedAccountKey]
        : [],
      multiFarmModeChange: objectEditData?.multiFarmModeChange ?? [],
      setPartnersToSkip: objectEditData?.setPartnersToSkip ?? undefined,
      enterRaffles: objectEditData?.enterRaffles ?? false,
      enterRafflePercentage: objectEditData?.enterRafflePercentage ?? "",
      Pledge: objectEditData?.Pledge ?? false,
      pledgePercentage: objectEditData?.pledgePercentage ?? "",
    },
    validationSchema: toFormikValidationSchema(validationSchemaMultifarm),
    onSubmit: (values) => {
      const key = uuidv4(); // Generate a unique key for the new account
      const formWithKey = { ...values, key }; // Add the key to the form data
      const storedAccount = localStorage.getItem("groupsTask");
      let groupsTask = storedAccount ? JSON.parse(storedAccount) : [];

      console.log("formWithKey: ", formWithKey);
      console.log("groupsTask: ", groupsTask);

      // Find the group that matches the form's myGroupName
      const updatedgroupsTask = groupsTask.map((group: any) => {
        if (
          group.myGroupName === formWithKey.myGroupName &&
          group.mode === formWithKey.mode
        ) {
          // Add the new account to the myGroupAccounts array
          return {
            ...group,
            myGroupTasks: [...group.myGroupTasks, formWithKey],
          };
        }
        return group; // If no match, return the group unchanged
      });

      // If no group was found, add a new group with the account
      if (
        !updatedgroupsTask.find(
          (group: any) => group.myGroupName === formWithKey.myGroupName
        )
      ) {
        updatedgroupsTask.push({
          myGroupName: formWithKey.myGroupName,
          myGroupTasks: [formWithKey], // Add the form data to the new group
        });
      }

      // Save the updated groupsTask back to localStorage
      localStorage.setItem("groupsTask", JSON.stringify(updatedgroupsTask));
      onClose();
      console.log("Updated groupsTask: ", updatedgroupsTask);
    },
  });

  const handleGroupNamesSelect = (selectedGroupNames: any) => {
    // Ensure selectedGroupNames is an array
    setFieldValue("selectedAccountKey", undefined);
    setDeleteSecondValue(true);
    const groupNamesArray = Array.isArray(selectedGroupNames)
      ? selectedGroupNames
      : [selectedGroupNames];

    setSelectedGroupNames(groupNamesArray);

    // Filter accounts based on selected group names
    const accounts = groupNamesArray.flatMap((groupName: string) => {
      const group = AccountsData.find(
        (group: { myGroupName: string }) => group.myGroupName === groupName
      );
      return group ? group.myGroupAccounts : [];
    });

    // Further filter accounts that have a valid TwitterAuthToken
    const filteredAccounts = accounts.filter(
      (account: { TwitterAuthToken: string }) =>
        account.TwitterAuthToken && account.TwitterAuthToken.trim() !== ""
    );
    setFieldValue("selectedAccountGroup", [selectedGroupNames]);
    setFilteredAccounts(filteredAccounts);
  };
  // console.log('errors', errors)

  const handleTwitterAccountsSelect = (selectedAccounts: string | any[]) => {
    if (typeof selectedAccounts === "string") {
      selectedAccounts = [selectedAccounts];
    }
    const keys = selectedAccounts.flatMap((accountName) =>
      AccountsData.flatMap((group: { myGroupAccounts: any[] }) =>
        group.myGroupAccounts
          .filter(
            (account: { accountName: any }) =>
              account.accountName === accountName
          )
          .map((account: { key: any }) => account.key)
      )
    );
    setFieldValue("selectedAccountKey", keys);
  };

  const getAccountName = () => {
    let accountName = "";
    for (const accountGroup of AccountsData) {
      const account = accountGroup.myGroupAccounts.find(
        (acc: { key: string }) =>
          values?.selectedAccountKey &&
          values?.selectedAccountKey.includes(acc.key)
      );
      if (account) {
        accountName = account.accountName;
        break;
      }
    }
    return [accountName];
  };

  const handleClearValues = () => {
    setValues(() => ({
      proxy: undefined,
      inviteCode: "",
      skipTwitterAction: false,
      selectedAccountKey: [],
    }));
    setSelectedGroupNames([]);
    setFilteredAccounts([]);
    setClearSelectedValues(true);
  };

  useEffect(() => {
    if (isEdit && objectEditData) {
      const group = AccountsData.find((group: { myGroupAccounts: any[] }) =>
        group.myGroupAccounts.some(
          (account: { key: any }) =>
            account.key === objectEditData.selectedAccountKey
        )
      );

      if (group) {
        setSelectedGroupNames([group.myGroupName]);
        setFilteredAccounts(
          group.myGroupAccounts.filter(
            (account: { TwitterAuthToken: string }) =>
              account.TwitterAuthToken && account.TwitterAuthToken.trim() !== ""
          )
        );
      }
    }
  }, [isEdit, objectEditData, AccountsData]);

  useEffect(() => {
    setHandleSubmit(() => handleSubmit);
    setHandleClear(() => handleClearValues);
  }, [setHandleSubmit, setHandleClear]);

  const deleteFieldValue = (field: string) => {
    setFieldValue(field, undefined);
    if (field === "selectedAccountGroup") {
      setSelectedGroupNames([]);
      setFilteredAccounts([]);
      setFieldValue("selectedAccountKey", undefined);
    }
  };
  const multifarmModes = ["Raffling", "Checker", "Farming"];
  const setPartnersToSkipArray = ["iAgentv2", "USDCv2", "Refactedv2"];

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="w-full flex flex-col items-center gap-8">
        <div className="w-full flex items-center gap-3">
          <LabelWithDropdown
            isSearch
            options={AccountsData.map(
              (group: { myGroupName: any }) => group.myGroupName
            )}
            placeholder="Select Group Accounts"
            onSelect={handleGroupNamesSelect}
            defaultValue={values.selectedAccountGroup}
            label="Select Group Accounts*"
            isSelectAll={!isEdit}
            isLength
            deleteFieldValue={(field: string) => {
              deleteFieldValue(field);
            }}
            fieldValue={"selectedAccountGroup"}
            clearSelectedValues={clearSelectedValues}
            setClearSelectedValues={setClearSelectedValues}
          />

          {selectedGroupNames.length > 0 && (
            <LabelWithDropdown
              isSearch
              options={filteredAccounts.map((x: any) => x.accountName)}
              placeholder="Select Accounts"
              onSelect={handleTwitterAccountsSelect}
              defaultValue={isEdit ? getAccountName() : undefined}
              label="Select Accounts*"
              deleteFieldValue={(field: string) => {
                deleteFieldValue(field);
              }}
              fieldValue={"selectedAccountKey"}
              multiSelect={!isEdit}
              isSelectAll={!isEdit}
              isLength
              error={
                (touched.selectedAccountKey || submitCount > 0) &&
                errors.selectedAccountKey
                  ? errors.selectedAccountKey
                  : undefined
              }
              clearSelectedValues={clearSelectedValues}
              setClearSelectedValues={setClearSelectedValues}
              deleteSecondValue={deleteSecondValue}
              setDeleteSecondValue={setDeleteSecondValue}
            />
          )}
        </div>
        <div className="w-full flex items-center gap-3">
          <LabelWithDropdown
            isSearch
            options={
              Proxies?.map(
                (group: { myGroupName: any }) => group.myGroupName
              ) ?? []
            }
            placeholder="Select Proxy"
            defaultValue={values.proxy ?? undefined}
            onSelect={(value: string | string[]) =>
              setFieldValue("proxy", [value])
            }
            deleteFieldValue={(field: string) => {
              deleteFieldValue(field);
            }}
            fieldValue={"proxy"}
            label="Proxies* :"
            error={
              (touched.proxy || submitCount > 0) && errors.proxy
                ? errors.proxy
                : undefined
            }
            clearSelectedValues={clearSelectedValues}
            setClearSelectedValues={setClearSelectedValues}
          />
          <LabelWithDropdown
            isSearch
            options={multifarmModes}
            placeholder="Select Mode"
            defaultValue={values.multiFarmModeChange ?? undefined}
            onSelect={(value: string | string[]) =>
              setFieldValue("multiFarmModeChange", value)
            }
            deleteFieldValue={(field: string) => {
              deleteFieldValue(field);
            }}
            fieldValue={"multiFarmModeChange"}
            label="Run Mode :"
            error={
              (touched.multiFarmModeChange || submitCount > 0) &&
              errors.multiFarmModeChange
                ? errors.multiFarmModeChange
                : undefined
            }
            clearSelectedValues={clearSelectedValues}
            setClearSelectedValues={setClearSelectedValues}
          />
          <LabelAndInputModals
            label="Invite Code :"
            labelClassName="w-full text-label"
            inputClassName="w-full !h-[2.2rem] text-xs-plus placeholder:text-nickle"
            placeholder="Write Invite Code"
            value={values.inviteCode}
            onChange={(e) =>
              setFieldValue("inviteCode", e.target.value.trimStart())
            }
          />
          <LabelAndSwitch
            label={"Skip Twitter Actions"}
            labelClassName="w-full text-label"
            inputClassName="w-full !h-[2.2rem]  text-xs-plus placeholder:text-nickle"
            wrapperClassName="w-[20rem] flex items-start"
            checked={values.skipTwitterAction ?? false}
            onClick={() =>
              setFieldValue("skipTwitterAction", !values.skipTwitterAction)
            }
          />
        </div>
        {values.multiFarmModeChange === "Raffling" && (
          <>
            <div className="w-full flex items-center gap-3">
              <LabelAndInputModals
                label="Raffle Percentage From Points:"
                labelClassName="w-full text-label"
                inputClassName="w-full !h-[2.2rem] text-xs-plus placeholder:text-nickle"
                placeholder="Write Raffle Percentage"
                value={values.enterRafflePercentage}
                onChange={(e) =>
                  setFieldValue(
                    "enterRafflePercentage",
                    e.target.value.trimStart()
                  )
                }
              />
              <LabelAndInputModals
                label="Pledge Percentage From Points:"
                labelClassName="w-full text-label"
                inputClassName="w-full !h-[2.2rem] text-xs-plus placeholder:text-nickle"
                placeholder="Write Raffle Percentage"
                value={values.pledgePercentage}
                onChange={(e) =>
                  setFieldValue("pledgePercentage", e.target.value.trimStart())
                }
              />
            </div>
            <div className="w-full flex items-center gap-3">
              <LabelWithDropdown
                isSearch
                options={setPartnersToSkipArray}
                placeholder="Select Partner to skip"
                defaultValue={values.setPartnersToSkip ?? undefined}
                onSelect={(value: string | string[]) =>
                  setFieldValue("setPartnersToSkip", [value])
                }
                deleteFieldValue={(field: string) => {
                  deleteFieldValue(field);
                }}
                fieldValue={"setPartnersToSkip"}
                label="Partner To Skip :"
                error={
                  (touched.setPartnersToSkip || submitCount > 0) &&
                  errors.setPartnersToSkip
                    ? errors.setPartnersToSkip
                    : undefined
                }
                clearSelectedValues={clearSelectedValues}
                setClearSelectedValues={setClearSelectedValues}
              />

              <LabelAndSwitch
                label={"Enter Raffles Entries"}
                labelClassName="w-full text-label"
                inputClassName="w-full !h-[2.2rem]  text-xs-plus placeholder:text-nickle"
                wrapperClassName="w-[20rem] flex items-start"
                checked={values.enterRaffles ?? false}
                onClick={() =>
                  setFieldValue("enterRaffles", !values.enterRaffles)
                }
              />
              <LabelAndSwitch
                label={"Enter Pledge"}
                labelClassName="w-full text-label"
                inputClassName="w-full !h-[2.2rem]  text-xs-plus placeholder:text-nickle"
                wrapperClassName="w-[20rem] flex items-start"
                checked={values.Pledge ?? false}
                onClick={() => setFieldValue("Pledge", !values.Pledge)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Multifarm;
