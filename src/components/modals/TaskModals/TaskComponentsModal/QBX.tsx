import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { toast } from "../../../ui/use-toast";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { validationSchemaMultifarm } from "../../../schema/Task";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import useFetchV3 from "../../../../hooks/useFetchV3";
import LabelAndInputModals from "../../../custom/LabelAndInputModals";
import LabelAndSwitch from "../../../custom/LabelAndSwitch";
import LabelWithDropdown from "../../../dropdowns/LabelWithDropdown";

interface ITask {
  Mode: string;
  Proxy: any;
  key: string;
  selectedAccountKey: any;
  inviteCode: string;
  skipTwitterAction: boolean;
  selectedAccountGroup: any;
}

interface IPropsQBX {
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

const QBX = ({
  data,
  onClose,
  objectEditData,
  isEdit,
  selectedTasks,
  setHandleSubmit,
  setHandleClear,
  tab,
}: IPropsQBX) => {
  const [clearSelectedValues, setClearSelectedValues] = useState(false);
  const isEditAll = selectedTasks && selectedTasks?.length > 1;
  const { data: Proxies } = useFetchV3<IGroupProxies[]>("MyProxiesData");
  const { data: AccountsData } = useFetchV3<IGroupAccounts[]>("MyAccountsData");
  const [selectedGroupNames, setSelectedGroupNames] = useState<string[]>(
    objectEditData?.selectedAccountGroup ?? []
  );
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
      inviteCode: objectEditData?.inviteCode ?? "",
      selectedAccountGroup: objectEditData?.selectedAccountGroup ?? [],
      skipTwitterAction: objectEditData?.skipTwitterAction ?? false,
      selectedAccountKey: objectEditData?.selectedAccountKey ?? [],
    },
    validationSchema: toFormikValidationSchema(validationSchemaMultifarm),
    onSubmit: (values) => {},
  });

  const handleGroupNamesSelect = (selectedGroupNames: any) => {
    setFieldValue("selectedAccountKey", undefined);
    setDeleteSecondValue(true);
    const groupNamesArray = Array.isArray(selectedGroupNames)
      ? selectedGroupNames
      : [selectedGroupNames];

    setSelectedGroupNames(groupNamesArray);

    const accounts = groupNamesArray.flatMap((groupName: string) => {
      const group = AccountsData.find(
        (group) => group.myGroupName === groupName
      );
      return group ? group.myGroupAccounts : [];
    });

    const filteredAccounts = accounts.filter(
      (account: { TwitterAuthToken: string }) =>
        account.TwitterAuthToken && account.TwitterAuthToken.trim() !== ""
    );

    setFieldValue("selectedAccountGroup", [selectedGroupNames]);
    setFilteredAccounts(filteredAccounts);
  };

  const handleTwitterAccountsSelect = (selectedAccounts: string | any[]) => {
    if (typeof selectedAccounts === "string") {
      selectedAccounts = [selectedAccounts];
    }
    const keys = selectedAccounts.flatMap((accountName) =>
      AccountsData.flatMap((group) =>
        group.myGroupAccounts
          .filter((account) => account.accountName === accountName)
          .map((account) => account.key)
      )
    );
    setFieldValue("selectedAccountKey", keys);
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

  const getAccountName = () => {
    let accountName = "";
    for (const accountGroup of AccountsData) {
      const account = accountGroup.myGroupAccounts.find(
        (acc) =>
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

  useEffect(() => {
    setHandleSubmit(() => handleSubmit);
    setHandleClear(() => handleClearValues);
  }, [setHandleSubmit, setHandleClear]);

  useEffect(() => {
    if (isEdit && objectEditData?.selectedAccountGroup) {
      handleGroupNamesSelect(objectEditData.selectedAccountGroup);
    }
  }, [isEdit, objectEditData]);

  const deleteFieldValue = (field: string) => {
    setFieldValue(field, undefined);
    if (field === "selectedAccountGroup") {
      setSelectedGroupNames([]);
      setFilteredAccounts([]);
      setFieldValue("selectedAccountKey", undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
      <div className="w-full flex items-center gap-3">
        <LabelWithDropdown
          isSearch
          options={AccountsData.map((group) => group.myGroupName)}
          placeholder="Select Group Accounts"
          onSelect={handleGroupNamesSelect}
          defaultValue={values.selectedAccountGroup}
          deleteFieldValue={(field: string) => {
            deleteFieldValue(field);
          }}
          fieldValue={"selectedAccountGroup"}
          label="Select Group Accounts*"
          isSelectAll={!isEdit}
          isLength
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
            deleteFieldValue={(field: string) => {
              deleteFieldValue(field);
            }}
            fieldValue={"selectedAccountKey"}
            label="Select Accounts*"
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
          options={Proxies?.map((group) => group.myGroupName) ?? []}
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
        <LabelAndInputModals
          label="Invite Code :"
          labelClassName="w-full text-label"
          inputClassName="w-full !h-[2.2rem] text-white text-xs-plus placeholder:text-nickle"
          placeholder="Write Invite Code"
          value={values.inviteCode}
          onChange={(e) =>
            setFieldValue("inviteCode", e.target.value.trimStart())
          }
        />
        <LabelAndSwitch
          label={"Skip Twitter Actions"}
          labelClassName="w-full text-label"
          inputClassName="w-full !h-[2.2rem] text-white text-xs-plus placeholder:text-nickle"
          wrapperClassName="w-[20rem] flex items-start"
          checked={values.skipTwitterAction ?? false}
          onClick={() =>
            setFieldValue("skipTwitterAction", !values.skipTwitterAction)
          }
        />
      </div>
    </form>
  );
};

export default QBX;
