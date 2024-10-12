import React, { FC, useEffect, useState } from "react";
import ModalHeader from "../../custom/ModalHeader";
import Magiceden from "./TaskComponentsModal/Magiceden";
import Blur from "./TaskComponentsModal/Blur";
import ContractMinting from "./TaskComponentsModal/ContractMinting";
import AirdropFarming from "./TaskComponentsModal/AirdropFarming";
import { cn } from "../../../lib/utils";
import Tensor from "./TaskComponentsModal/Tensor";
import Multifarm from "./TaskComponentsModal/Multifarm";
import QBX from "./TaskComponentsModal/QBX";
import DistrictOne from "./TaskComponentsModal/DistrictOne";
import MagicedenFarmer from "./TaskComponentsModal/MagicedenFarmer";
import OpenseaBidder from "./TaskComponentsModal/OpenseaBidder";

interface IPropsCreateTasksModal {
  onClose: () => void;
  propsData: {
    isOpen: boolean;
    tab: string | undefined;
    mode: string | undefined;
    type: string | undefined;
    key?: string | undefined;
  };
  tasks?: any;
  selectedTasks?: string[];
}
const CreateTasksModal: FC<IPropsCreateTasksModal> = ({
  propsData,
  onClose,
  tasks,
  selectedTasks,
}) => {
  const [handleSubmit, setHandleSubmit] = useState<(() => void) | null>(null);
  const [handleClear, setHandleClear] = useState<(() => void) | null>(null);

  const isEdit = !!propsData.key;
  const { key } = propsData;
  const matchingTask =
    tasks &&
    tasks?.find((task: { key: string | undefined }) => task.key === key);
  const objectEditData = matchingTask ? { ...matchingTask } : {};
  const titleValue = isEdit ? "Edit Task" : "Create Tasks";
  const Mode = propsData.mode;
  const unChangableData: {
    myGroupName: string | undefined;
    mode: string | undefined;
    type: string | undefined;
  } = {
    myGroupName: propsData.tab,
    mode: Mode,
    type: propsData.type,
  };

  const renderActiveTab = () => {
    switch (Mode) {
      case "Opensea Bidder":
        return (
          <OpenseaBidder
            data={unChangableData}
            onClose={onClose}
            objectEditData={objectEditData}
            isEdit={isEdit}
            selectedTasks={selectedTasks}
            setHandleSubmit={setHandleSubmit}
            setHandleClear={setHandleClear}
            tab={propsData.tab}
          />
        );
      case "Magiceden Sniper":
        return (
          <Magiceden
            data={unChangableData}
            onClose={onClose}
            objectEditData={objectEditData}
            isEdit={isEdit}
            selectedTasks={selectedTasks}
            setHandleSubmit={setHandleSubmit}
            tab={propsData.tab}
            setHandleClear={setHandleClear}
          />
        );
      case "Contract Minting":
        return (
          <ContractMinting
            data={unChangableData}
            onClose={onClose}
            objectEditData={objectEditData}
            isEdit={isEdit}
            selectedTasks={selectedTasks}
            setHandleSubmit={setHandleSubmit}
            setHandleClear={setHandleClear}
            tab={propsData.tab}
          />
        );
      case "Scroll":
        return (
          <AirdropFarming
            data={unChangableData}
            onClose={onClose}
            objectEditData={objectEditData}
            isEdit={isEdit}
            selectedTasks={selectedTasks}
            setHandleSubmit={setHandleSubmit}
            setHandleClear={setHandleClear}
            mode={propsData.mode}
            tab={propsData.tab}
          />
        );
      case "ZkysyncEra":
        return (
          <AirdropFarming
            data={unChangableData}
            onClose={onClose}
            objectEditData={objectEditData}
            isEdit={isEdit}
            selectedTasks={selectedTasks}
            setHandleSubmit={setHandleSubmit}
            setHandleClear={setHandleClear}
            mode={propsData.mode}
            tab={propsData.tab}
          />
        );
      case "Blur":
        return (
          <Blur
            data={unChangableData}
            onClose={onClose}
            objectEditData={objectEditData}
            selectedTasks={selectedTasks}
            isEdit={isEdit}
            setHandleSubmit={setHandleSubmit}
            tab={propsData.tab}
            setHandleClear={setHandleClear}
          />
        );
      case "Tensor":
        return (
          <Tensor
            data={unChangableData}
            onClose={onClose}
            objectEditData={objectEditData}
            isEdit={isEdit}
            selectedTasks={selectedTasks}
            setHandleSubmit={setHandleSubmit}
            setHandleClear={setHandleClear}
            tab={propsData.tab}
          />
        );
      case "MultiFarm":
        return (
          <Multifarm
            data={unChangableData}
            onClose={onClose}
            objectEditData={objectEditData}
            isEdit={isEdit}
            selectedTasks={selectedTasks}
            setHandleSubmit={setHandleSubmit}
            setHandleClear={setHandleClear}
            tab={propsData.tab}
          />
        );
      case "QBX":
        return (
          <QBX
            data={unChangableData}
            onClose={onClose}
            objectEditData={objectEditData}
            isEdit={isEdit}
            selectedTasks={selectedTasks}
            setHandleSubmit={setHandleSubmit}
            setHandleClear={setHandleClear}
            tab={propsData.tab}
          />
        );
      case "DistrictOne":
        return (
          <DistrictOne
            data={unChangableData}
            onClose={onClose}
            objectEditData={objectEditData}
            isEdit={isEdit}
            selectedTasks={selectedTasks}
            setHandleSubmit={setHandleSubmit}
            setHandleClear={setHandleClear}
            tab={propsData.tab}
          />
        );
      case "Magiceden Farmer":
        return (
          <MagicedenFarmer
            data={unChangableData}
            onClose={onClose}
            objectEditData={objectEditData}
            isEdit={isEdit}
            selectedTasks={selectedTasks}
            setHandleSubmit={setHandleSubmit}
            setHandleClear={setHandleClear}
            tab={propsData.tab}
          />
        );
      default:
        return (
          <AirdropFarming
            data={unChangableData}
            onClose={onClose}
            objectEditData={objectEditData}
            isEdit={isEdit}
            selectedTasks={selectedTasks}
            setHandleSubmit={setHandleSubmit}
            setHandleClear={setHandleClear}
            mode={propsData.mode}
            tab={propsData.tab}
          />
        );
    }
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
      wrapperClassName={cn(
        `h-fit w-[45rem] max-h-[90%]`,
        Mode === "Blur" && "w-[50rem]",
        (Mode === "Scroll" || Mode === "ZkysyncEra") && "overflow-y-auto"
      )}
      disabled={Mode === "MultiFarm" || Mode === "QBX"}
      onClear={handleClear}
      onSubmit={handleSubmit}
      textSubmit={isEdit ? "Edit" : "Create"}
    >
      {renderActiveTab()}
    </ModalHeader>
  );
};

export default CreateTasksModal;
