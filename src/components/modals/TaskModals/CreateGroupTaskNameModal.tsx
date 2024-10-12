import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { createGroupNameSchema } from "../../schema/Task";
import { toast } from "../../ui/use-toast";
import { cateogryOptions, ModesOptions } from "../../../lib/globalVariables";
import ModalHeader from "../../custom/ModalHeader";
import DropdownHover from "../../dropdowns/DropdownHover";
import LabelWithDropdown from "../../dropdowns/LabelWithDropdown";
import ButtonTabs from "../../custom/ButtonTabs";
import LabelAndInputModals from "../../custom/LabelAndInputModals";
import { useMutation } from "@tanstack/react-query";

interface IGroup {
  myGroupName: string;
  mode: string;
  type: string;
  myGroupTasks: Array<any>; // Define this according to the shape of the tasks
}

// Form values type
interface ICreateGroupNameResponse {
  groupName: string;
  previousGroupName?: string;
  mainCategory: string;
  type: string;
  mode: string;
}

const CreateGroupTaskNameModal: FC<IPropsCreateGroupTaskNameModal> = ({
  onClose,
  tabName,
  onCallback,
  typeTab,
  getType,
  isAccount,
  isTask,
  taskGroups,
  setActions,
  actions,
}) => {
  const [clearSelectedValues, setClearSelectedValues] = useState(false);
  const [resetDropdown, setResetDropdown] = useState(false);
  const [error, setError] = useState("");

  const [groups, setGroups] = useState<IGroup[] | any[]>([]);

  // Load initial groups from localStorage (if any)
  const typeValue =
    typeTab === "task"
      ? "groupsTask"
      : typeTab === "wallet"
      ? "groupsWallet"
      : typeTab === "proxy"
      ? "groupsProxy"
      : typeTab === "account"
      ? "groupsAccount"
      : "";

  const handleEditGroup = (values: any) => {
    const updatedGroups = groups.map((group) =>
      group.myGroupName === values.previousGroupName
        ? typeTab === "task"
          ? {
              ...group,
              myGroupName: values.groupName,
              mode: values.mode,
              type: values.type,
            }
          : typeTab === "account"
          ? {
              ...group,
              myGroupName: values.groupName,
              mainCategory: values.mainCategory,
            }
          : group
        : group
    );

    if (typeTab === "task") {
      localStorage.setItem("groupsTask", JSON.stringify(updatedGroups));
    }
    if (typeTab === "proxy") {
      localStorage.setItem("groupsProxy", JSON.stringify(updatedGroups));
    }
    if (typeTab === "wallet") {
      localStorage.setItem("groupsWallet", JSON.stringify(updatedGroups));
    }
    if (typeTab === "account") {
      localStorage.setItem("groupsAccount", JSON.stringify(updatedGroups));
    }

    toast({
      variant: "success",
      title: "Edited Group Name",
    });
    setActions(!actions);
  };

  const handleAddGroup = (values: any) => {
    let newGroup: any = {};
    if (typeTab === "task") {
      newGroup = {
        myGroupName: values.groupName ?? "",
        mode: values.mode ?? "",
        type: values.type ?? "",
        myGroupTasks: [], // Initialize with empty tasks
      };
      localStorage.setItem("groupsTask", JSON.stringify([...groups, newGroup]));
    }
    if (typeTab === "proxy") {
      newGroup = {
        myGroupName: values.groupName ?? "",
        myGroupProxies: [], // Initialize with empty tasks
      };
      localStorage.setItem(
        "groupsProxy",
        JSON.stringify([...groups, newGroup])
      );
    }
    if (typeTab === "wallet") {
      newGroup = {
        myGroupName: values.groupName ?? "",
        myGroupWallets: [], // Initialize with empty tasks
      };
      localStorage.setItem(
        "groupsWallet",
        JSON.stringify([...groups, newGroup])
      );
    }
    if (typeTab === "account") {
      newGroup = {
        myGroupName: values.groupName ?? "",
        mainCategory: values.mainCategory ?? "",
        myGroupAccounts: [], // Initialize with empty tasks
      };
      localStorage.setItem(
        "groupsAccount",
        JSON.stringify([...groups, newGroup])
      );
    }

    setGroups([...groups, newGroup]);
    toast({
      variant: "success",
      title: "Created Group Name",
    });
    setActions(!actions);
  };

  const {
    errors,
    touched,
    setFieldValue,
    handleSubmit,
    values,
    dirty,
    isValid,
    isSubmitting,
    submitCount,
    setValues,
    setFieldTouched,
  } = useFormik<Partial<ICreateGroupNameResponse>>({
    initialValues: {
      groupName: tabName ?? "",
      previousGroupName: tabName,
      mainCategory: "",
      type: "",
      mode: "",
    },
    enableReinitialize: true,
    validationSchema: toFormikValidationSchema(createGroupNameSchema),

    onSubmit: (values) => {
      if (values.previousGroupName) {
        console.log("Edit:");
        handleEditGroup(values);
      } else {
        console.log("Add:");
        handleAddGroup(values);
      }

      setActions(!actions);
      onClose();
    },
  });

  const isEdit = !!tabName;
  const titleValue = isEdit ? "Edit Group Name" : "Create Group Name";

  const handleSelect = (mainValue: string, subTaskValue?: string) => {
    if (!subTaskValue) {
      setValues((prev) => ({
        ...prev,
        type: mainValue,
        mode: mainValue,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        type: mainValue,
        mode: subTaskValue,
      }));
    }
  };
  useEffect(() => {
    if (!values.groupName) {
      setError("");
      return;
    }

    let groupExists = false;
    const newGroupNameLowerCase =
      values.groupName && values.groupName.toLowerCase(); // Convert new value to lowercase

    if (taskGroups.length > 0) {
      if (typeof taskGroups[0] === "string") {
        // Convert each existing group name to lowercase for comparison
        groupExists = (taskGroups as string[]).some(
          (group) => group?.toLowerCase() === newGroupNameLowerCase
        );
      } else if (typeof taskGroups[0] === "object" && taskGroups[0] !== null) {
        groupExists = (taskGroups as TaskGroup[]).some((group) => {
          if (Array.isArray(group.tab)) {
            // Convert each existing group name in the array to lowercase for comparison
            return group.tab.some(
              (tab) => tab?.toLowerCase() === newGroupNameLowerCase
            );
          }
          // Convert single group name to lowercase for comparison
          return group.tab?.toLowerCase() === newGroupNameLowerCase;
        });
      }
    }

    if (groupExists) {
      setError("This group name already exists.");
    } else {
      setError("");
    }
  }, [values.groupName, taskGroups]);

  useEffect(() => {
    const storedGroups = localStorage.getItem(typeValue);
    if (storedGroups) {
      setGroups(JSON.parse(storedGroups));
    }
  }, [actions]);

  const handleClear = () => {
    setValues(() => ({
      groupName: tabName ?? "",
      previousGroupName: tabName,
      mainCategory: "",
      type: "",
      mode: "",
    }));
    setResetDropdown(true); // Toggle the reset state
  };

  return (
    <ModalHeader label={titleValue} onClose={onClose}>
      <div className="w-full flex flex-col items-start gap-5">
        {isTask && (
          <DropdownHover
            label="Mode :"
            options={ModesOptions}
            onSelect={handleSelect}
            reset={resetDropdown}
            setResetDropdown={setResetDropdown}
          />
        )}
        <LabelAndInputModals
          label={"Group Name :"}
          labelClassName="w-full text-label"
          inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:text-white text-xs-plus placeholder:text-placeholder  shadow-[0_4px_30px_rgba(0,0,0,0.1)] "
          value={values.groupName ?? ""}
          onBlur={() => {
            setFieldTouched("groupName", true);
          }}
          placeholder="Write Group Name ..."
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value.trimStart();
            const finalValue = value ? value : undefined;
            setFieldValue("groupName", finalValue, true);
          }}
          errorClassName="text-[0.8125rem]  -bottom-5"
          error={
            error
              ? error
              : (touched.groupName || submitCount > 0) && errors.groupName
              ? errors.groupName
              : undefined
          }
        />
        {isAccount && (
          <LabelWithDropdown
            isSearch
            label="Category"
            options={cateogryOptions}
            defaultValue={values.mainCategory ? values.mainCategory : undefined}
            deleteFieldValue={(field: string) => {
              setFieldValue("mainCategory", undefined);
            }}
            fieldValue={"mainCategory"}
            onSelect={(value: string | string[]) => {
              setFieldValue("mainCategory", value, true);
            }}
            placeholder="Select a category"
            clearSelectedValues={clearSelectedValues}
            setClearSelectedValues={setClearSelectedValues}
          />
        )}
        <div className="w-full grid grid-cols-2 gap-[10px]">
          <ButtonTabs
            buttonClassName="w-full h-[37px]"
            onClick={() => {
              handleClear();
            }}
          >
            Clear
          </ButtonTabs>
          <ButtonTabs
            buttonClassName="w-full h-[37px]"
            disabled={
              !!error ||
              (isAccount && !values.mainCategory) ||
              !values.groupName
            }
            isSubmitting={isSubmitting}
            isValid={isValid}
            dirty={dirty}
            onClick={() => {
              handleSubmit();
            }}
            type="active"
          >
            Confirm
          </ButtonTabs>
        </div>
      </div>
    </ModalHeader>
  );
};

export default CreateGroupTaskNameModal;
// || (!isAccount && (!values.mode || !values.type))
