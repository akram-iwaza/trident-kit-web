import { v4 as uuidv4 } from "uuid";
import React, { FC, useEffect, useState } from "react";
import ModalHeader from "../../custom/ModalHeader";
import { toast } from "../../ui/use-toast";
import TextArea from "../../ui/TextArea";
import { checkIfValidProxyFormat } from "../../../lib/utils";

interface IPropsAddProxiesModal {
  onClose: () => void;
  tabName: string;
  taskGroups: string[];
  rowKey: string | undefined;
  proxy: string | undefined;
  emptyGroups?: boolean;
}

const AddProxiesModal: FC<IPropsAddProxiesModal> = ({
  onClose,
  tabName,
  taskGroups,
  rowKey,
  proxy,
  emptyGroups,
}) => {
  const [myGroupName] = useState(tabName ?? "");
  console.log("proxy : ", proxy);

  const [proxiesValue, setProxiesValue] = useState(proxy ?? "");
  const [error, setError] = useState("");
  const isEdit = !!rowKey && !!proxy;

  const handleSubmit = () => {
    const proxiesList = proxiesValue.trimEnd().split("\n");
    const myGroupProxies = [];

    for (const myProxy of proxiesList) {
      if (!checkIfValidProxyFormat(myProxy)) {
        setError(`Proxy format is incorrect!`);
        return;
      }
      const [IP, PORT, USERNAME, PASSWORD] = myProxy.split(":");
      if (isEdit) {
        myGroupProxies.push({ IP, PORT, USERNAME, PASSWORD });
      } else {
        myGroupProxies.push({
          IP,
          PORT,
          USERNAME,
          PASSWORD,
          key: uuidv4(),
        });
      }
    }

    const proxiesData = {
      myGroupName: emptyGroups ? "proxyGroup" : myGroupName,
      myGroupProxies,
    };

    saveTask(proxiesData);
  };

  const saveTask = (proxiesData: {
    myGroupName: string;
    myGroupProxies: any[];
  }) => {
    // Get existing proxies from localStorage
    const storedProxies = localStorage.getItem("groupsProxy");
    let groupsProxy = storedProxies ? JSON.parse(storedProxies) : [];

    // Function to find group by myGroupName
    const findGroupByName = (groupName: string) =>
      groupsProxy.find((group: any) => group.myGroupName === groupName);

    if (proxy && rowKey) {
      // Edit Mode
      console.log("Edit Mode");

      const group = findGroupByName(proxiesData.myGroupName);
      if (group) {
        const proxyIndex = group.myGroupProxies.findIndex(
          (p: any) => p.key === rowKey
        );
        if (proxyIndex !== -1) {
          // Update the existing proxy by key
          group.myGroupProxies[proxyIndex] = proxy; // Assuming `proxy` contains the updated proxy data
        }
      }
    } else {
      // Add Mode
      console.log("Add Mode");

      // Check if group exists in localStorage
      const group = findGroupByName(proxiesData.myGroupName);

      if (group) {
        // Add new proxies to the existing group
        group.myGroupProxies.push(...proxiesData.myGroupProxies);
      } else {
        // If group doesn't exist, add a new group with proxies
        groupsProxy.push({
          myGroupName: proxiesData.myGroupName,
          myGroupProxies: [...proxiesData.myGroupProxies],
        });
      }
    }

    // Save the updated groupsProxy data back to localStorage
    localStorage.setItem("groupsProxy", JSON.stringify(groupsProxy));

    onClose();
  };

  const titleValue = isEdit ? "Edit Proxy" : "Add Proxies";
  const handleClear = () => {
    setProxiesValue("");
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <ModalHeader
      label={titleValue}
      onClose={onClose}
      wrapperClassName="w-[56.25rem] h-[32.5rem]"
      onClear={handleClear}
      onSubmit={handleSubmit}
      textSubmit={isEdit ? "Edit" : "Add"}
    >
      <TextArea
        inputClassName="w-full h-full py-3 px-4 border border-borderLight dark:border-borderDropdown rounded-[8px] bg-white dark:bg-[#2A2A2C] text-default dark:text-white placeholder:placeholder  shadow-[0_4px_30px_rgba(0,0,0,0.1)] "
        placeholder="IP:PORT:USERNAME:PASSWORD"
        id="myProxies"
        value={proxiesValue}
        onChange={(e) => setProxiesValue(e.target.value)}
        error={error}
      />
    </ModalHeader>
  );
};

export default AddProxiesModal;
