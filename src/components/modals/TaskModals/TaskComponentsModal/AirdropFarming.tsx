import { useFormik } from "formik";
import React, { FC, useEffect, useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import LabelWithDropdown from "../../../dropdowns/LabelWithDropdown";
import { toast } from "../../../ui/use-toast";
import { validationSchemaAirdropFarming } from "../../../schema/Task";
import AccordionComponent from "../../../custom/AccordionComponent";
import LabelAndSwitch from "../../../custom/LabelAndSwitch";
import {
  bridgeOptions,
  flowOptions,
  gasOptions,
  liquidityOptions,
  mintingOptions,
  othersOptions,
  swapOptions,
} from "../../../../lib/globalVariables";
import { v4 as uuidv4 } from "uuid";
import LabelAndInputModals from "../../../custom/LabelAndInputModals";
import useFetchV3 from "../../../../hooks/useFetchV3";

interface Task {
  Mode: string;
  Proxy: string;
  WalletGroup: string;
  bridgeDirection: boolean;
  buyEth: boolean;
  buyEthPer: number;
  buyEthSlippage: number;
  enableQueue: boolean;
  farmingEth: number;
  inputPercentage: number;
  isPercentage: boolean;
  key: string;
  gasPrice: number;
  gasPriority: number;
  maxSleepTime: number;
  minSleepTime: number;
  myFarmingFlow: [string, ...string[]] | undefined;
  myGasMode: string;
  myGroupName: string;
  myProtocolType: string;
  myLiquidityProtocol: string[] | undefined;
  myMintingProtocols: string[] | undefined;
  myOthersProtocols: string[] | undefined;
  myWallet: [string, ...string[]] | undefined;
  swapProtocols?: string[];
  timesToBuyEth: number;
  walletAutoRefund: boolean;
  bridgingProtocols?: string[];
}

interface IPropsAirdropFarming {
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
  setHandleClear: (handleClear: () => void) => void;
  tab: any;
  mode: any;
}
type IAirdropFarmingResponse = z.infer<typeof validationSchemaAirdropFarming>;

const AirdropFarming: FC<IPropsAirdropFarming> = ({
  data,
  onClose,
  objectEditData,
  isEdit,
  selectedTasks,
  setHandleSubmit,
  setHandleClear,
  mode,
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
    setSubmitting,
    submitCount,
    isSubmitting,
    initialValues,
    setValues,
  } = useFormik<Partial<IAirdropFarmingResponse>>({
    initialValues: {
      Mode: mode,
      Proxy: objectEditData?.Proxy ?? undefined,
      WalletGroup: objectEditData?.WalletGroup ?? undefined,
      bridgeDirection: objectEditData?.bridgeDirection ?? true,
      bridgingProtocols: objectEditData?.bridgingProtocols ?? [],
      buyEth: objectEditData?.buyEth ?? true,
      buyEthPer: objectEditData?.buyEthPer ?? 80,
      buyEthSlippage: objectEditData?.buyEthSlippage ?? 1,
      enableQueue: objectEditData?.enableQueue ?? true,
      farmingEth: objectEditData?.farmingEth ?? 0.01,
      gasPrice: objectEditData?.gasPrice ?? undefined,
      gasPriority: objectEditData?.gasPriority ?? undefined,
      inputPercentage: objectEditData?.inputPercentage ?? 80,
      isPercentage: objectEditData?.isPercentage ?? true,
      maxSleepTime: objectEditData?.maxSleepTime ?? 60000,
      minSleepTime: objectEditData?.minSleepTime ?? 30000,
      myFarmingFlow: objectEditData?.myFarmingFlow ?? undefined,
      myGasMode: objectEditData?.myGasMode ?? undefined,
      myGroupName: objectEditData?.myGroupName ?? data.myGroupName,
      myLiquidityProtocol: objectEditData?.myLiquidityProtocol ?? [],
      myMintingProtocols: objectEditData?.myMintingProtocols ?? [],
      myOthersProtocols: objectEditData?.myOthersProtocols ?? [],
      myProtocolType: objectEditData?.myProtocolType ?? data.mode,
      myWallet: objectEditData?.myWallet ?? undefined,
      swapProtocols: objectEditData?.swapProtocols?.length
        ? [
            objectEditData.swapProtocols[0],
            ...objectEditData.swapProtocols.slice(1),
          ]
        : undefined,
      timesToBuyEth: objectEditData?.timesToBuyEth ?? 20,
      walletAutoRefund: objectEditData?.walletAutoRefund ?? true,
      key: objectEditData?.key ?? undefined,
    },
    validationSchema: toFormikValidationSchema(validationSchemaAirdropFarming),
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
      Mode: objectEditData?.Mode ?? "Airdrop Farming",
      Proxy: undefined,
      WalletGroup: undefined,
      bridgeDirection: true,
      bridgingProtocols: [],
      buyEth: true,
      buyEthPer: 80,
      buyEthSlippage: 1,
      enableQueue: true,
      farmingEth: 0.01,
      gasPrice: undefined,
      gasPriority: undefined,
      inputPercentage: 80,
      isPercentage: true,
      maxSleepTime: 60000,
      minSleepTime: 30000,
      myFarmingFlow: undefined,
      myGasMode: undefined,
      myGroupName: data.myGroupName,
      myLiquidityProtocol: [],
      myMintingProtocols: [],
      myOthersProtocols: [],
      myProtocolType: data.mode,
      myWallet: undefined,
      swapProtocols: undefined,
      timesToBuyEth: 20,
      walletAutoRefund: true,
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
          label="Wallet Group* :"
          deleteFieldValue={(field: string) => {
            setFieldValue("WalletGroup", undefined);
            setDeleteSecondValue(true);
            setFieldValue("myWallet", undefined);
          }}
          fieldValue={"WalletGroup"}
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
          fromFirst
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
      {/* #flowOptions */}
      <div className="w-full flex flex-col items-start gap-3">
        <div className="w-full flex items-center gap-5">
          <LabelWithDropdown
            isSearch
            options={flowOptions?.map((group) => group) ?? []}
            placeholder="Select Farming Flow"
            defaultValue={
              values.myFarmingFlow ? values.myFarmingFlow : undefined
            }
            onSelect={(value: string | string[]) =>
              setFieldValue("myFarmingFlow", value)
            }
            deleteFieldValue={(field: string) => {
              setFieldValue("myFarmingFlow", undefined);
            }}
            fieldValue={"myFarmingFlow"}
            label="Farming Flow* :"
            wrapperClassName="w-full"
            error={
              (touched.myFarmingFlow || submitCount > 0) && errors.myFarmingFlow
                ? errors.myFarmingFlow
                : undefined
            }
            multiSelect
            clearSelectedValues={clearSelectedValues}
            setClearSelectedValues={setClearSelectedValues}
            fromFirst
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
            clearSelectedValues={clearSelectedValues}
            setClearSelectedValues={setClearSelectedValues}
            fromFirst
          />
        </div>
        <div className="w-full">
          {values.myFarmingFlow && values.myFarmingFlow?.length > 0 && (
            <div className="w-full flex items-center gap-3 flex-wrap">
              {values.myFarmingFlow.includes("Swapping") && (
                <LabelWithDropdown
                  isSearch
                  wrapperClassName="w-[11.5rem]"
                  options={swapOptions?.map((x) => x) ?? []}
                  placeholder="Select Protocols"
                  defaultValue={
                    values.swapProtocols ? values.swapProtocols : undefined
                  }
                  onSelect={(value: string | string[]) =>
                    setFieldValue("swapProtocols", value)
                  }
                  deleteFieldValue={(field: string) => {
                    setFieldValue("swapProtocols", undefined);
                  }}
                  fieldValue={"swapProtocols"}
                  label="Swap Protocols* :"
                  error={
                    (touched.swapProtocols || submitCount > 0) &&
                    errors.swapProtocols
                      ? errors.swapProtocols
                      : undefined
                  }
                  multiSelect
                  clearSelectedValues={clearSelectedValues}
                  setClearSelectedValues={setClearSelectedValues}
                  fromFirst
                />
              )}
              {values.myFarmingFlow.includes("Bridging") && (
                <LabelWithDropdown
                  isSearch
                  wrapperClassName="w-[11.5rem]"
                  options={bridgeOptions?.map((x) => x) ?? []}
                  placeholder="Select Protocols"
                  defaultValue={
                    values.bridgingProtocols
                      ? values.bridgingProtocols
                      : undefined
                  }
                  onSelect={(value: string | string[]) =>
                    setFieldValue("bridgingProtocols", value)
                  }
                  deleteFieldValue={(field: string) => {
                    setFieldValue("bridgingProtocols", undefined);
                  }}
                  fieldValue={"bridgingProtocols"}
                  label="Bridging Protocols* :"
                  error={
                    (touched.bridgingProtocols || submitCount > 0) &&
                    errors.bridgingProtocols
                      ? errors.bridgingProtocols
                      : undefined
                  }
                  multiSelect
                  clearSelectedValues={clearSelectedValues}
                  setClearSelectedValues={setClearSelectedValues}
                  fromFirst
                />
              )}
              {values.myFarmingFlow.includes("Minting") && (
                <LabelWithDropdown
                  isSearch
                  wrapperClassName="w-[11.5rem]"
                  options={mintingOptions?.map((x) => x) ?? []}
                  placeholder="Select Protocols"
                  defaultValue={
                    values.myMintingProtocols
                      ? values.myMintingProtocols
                      : undefined
                  }
                  deleteFieldValue={(field: string) => {
                    setFieldValue("myMintingProtocols", undefined);
                  }}
                  fieldValue={"myMintingProtocols"}
                  onSelect={(value: string | string[]) =>
                    setFieldValue("myMintingProtocols", value)
                  }
                  label="Minting Protocols* :"
                  error={
                    (touched.myMintingProtocols || submitCount > 0) &&
                    errors.myMintingProtocols
                      ? errors.myMintingProtocols
                      : undefined
                  }
                  multiSelect
                  clearSelectedValues={clearSelectedValues}
                  setClearSelectedValues={setClearSelectedValues}
                  fromFirst
                />
              )}
              {values.myFarmingFlow.includes("Liquidity") && (
                <LabelWithDropdown
                  isSearch
                  wrapperClassName="w-[11.5rem]"
                  options={liquidityOptions?.map((x) => x) ?? []}
                  placeholder="Select Protocols"
                  defaultValue={
                    values.myLiquidityProtocol
                      ? values.myLiquidityProtocol
                      : undefined
                  }
                  onSelect={(value: string | string[]) =>
                    setFieldValue("myLiquidityProtocol", value)
                  }
                  deleteFieldValue={(field: string) => {
                    setFieldValue("myLiquidityProtocol", undefined);
                  }}
                  fieldValue={"myLiquidityProtocol"}
                  label="Liquidity Protocols* :"
                  error={
                    (touched.myLiquidityProtocol || submitCount > 0) &&
                    errors.myLiquidityProtocol
                      ? errors.myLiquidityProtocol
                      : undefined
                  }
                  multiSelect
                  clearSelectedValues={clearSelectedValues}
                  setClearSelectedValues={setClearSelectedValues}
                  fromFirst
                />
              )}
              {values.myFarmingFlow.includes("Others") && (
                <LabelWithDropdown
                  isSearch
                  wrapperClassName="w-[11.5rem]"
                  options={othersOptions?.map((x) => x) ?? []}
                  placeholder="Select Protocols"
                  defaultValue={
                    values.myOthersProtocols
                      ? values.myOthersProtocols
                      : undefined
                  }
                  onSelect={(value: string | string[]) =>
                    setFieldValue("myOthersProtocols", value)
                  }
                  deleteFieldValue={(field: string) => {
                    setFieldValue("myOthersProtocols", undefined);
                  }}
                  fieldValue={"myOthersProtocols"}
                  label="Others Protocols* :"
                  error={
                    (touched.myOthersProtocols || submitCount > 0) &&
                    errors.myOthersProtocols
                      ? errors.myOthersProtocols
                      : undefined
                  }
                  multiSelect
                  clearSelectedValues={clearSelectedValues}
                  setClearSelectedValues={setClearSelectedValues}
                  fromFirst
                />
              )}
            </div>
          )}
        </div>
        <div className="w-full flex items-center gap-3">
          <LabelAndInputModals
            label="Input Value * :"
            labelClassName="w-full text-label"
            inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:  shadow-[0_4px_30px_rgba(0,0,0,0.1)]  text-white text-xs-plus placeholder:text-nickle"
            placeholder="0.00"
            value={values.farmingEth}
            onChange={(e) =>
              setFieldValue("farmingEth", e.target.value.trimStart())
            }
            error={
              (touched.farmingEth || submitCount > 0) && errors.farmingEth
                ? errors.farmingEth
                : undefined
            }
          />
          <LabelAndSwitch
            label={values.isPercentage ? "Percentage :" : "ETH :"}
            labelClassName="w-full text-label"
            inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:  shadow-[0_4px_30px_rgba(0,0,0,0.1)]  text-white text-xs-plus placeholder:text-nickle"
            wrapperClassName="w-[20rem] flex items-start"
            placeholder="0.00"
            checked={values.isPercentage ?? false}
            onClick={() => setFieldValue("isPercentage", !values.isPercentage)}
            error={
              (touched.isPercentage || submitCount > 0) && errors.isPercentage
                ? errors.isPercentage
                : undefined
            }
          />
          {values.myFarmingFlow &&
            (values.myFarmingFlow.includes("Swapping") ||
              values.myFarmingFlow.includes("Liquidity")) && (
              <>
                <LabelAndSwitch
                  label="Fund Approve :"
                  labelClassName="w-full text-label"
                  inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:  shadow-[0_4px_30px_rgba(0,0,0,0.1)]  text-white text-xs-plus placeholder:text-nickle"
                  wrapperClassName="w-[26rem] flex items-start"
                  placeholder="0.00"
                  checked={values.walletAutoRefund ?? false}
                  onClick={() =>
                    setFieldValue("walletAutoRefund", !values.walletAutoRefund)
                  }
                  error={
                    (touched.walletAutoRefund || submitCount > 0) &&
                    errors.walletAutoRefund
                      ? errors.walletAutoRefund
                      : undefined
                  }
                />
                <LabelAndSwitch
                  label="Buy Eth :"
                  labelClassName="w-full text-label"
                  wrapperClassName="w-[15rem] flex items-start"
                  inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:  shadow-[0_4px_30px_rgba(0,0,0,0.1)]  text-white text-xs-plus placeholder:text-nickle"
                  placeholder="0.00"
                  checked={values.buyEth ?? false}
                  onClick={() => setFieldValue("buyEth", !values.buyEth)}
                  error={
                    (touched.buyEth || submitCount > 0) && errors.buyEth
                      ? errors.buyEth
                      : undefined
                  }
                />
                <LabelAndInputModals
                  label="Buy Portion(%) * :"
                  labelClassName="w-full text-label"
                  inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:  shadow-[0_4px_30px_rgba(0,0,0,0.1)]  text-white text-xs-plus placeholder:text-nickle"
                  placeholder="0.00"
                  value={values.buyEthPer}
                  onChange={(e) =>
                    setFieldValue("buyEthPer", e.target.value.trimStart())
                  }
                  error={
                    (touched.buyEthPer || submitCount > 0) && errors.buyEthPer
                      ? errors.buyEthPer
                      : undefined
                  }
                />
              </>
            )}
        </div>

        <div className="w-full">
          <AccordionComponent
            label={"Advanced Settings"}
            paddingClassName="h-fit"
          >
            <div className="w-full flex items-center gap-3 py-3">
              <LabelAndInputModals
                label="Min sleep time :"
                labelClassName="w-full text-label"
                inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:  shadow-[0_4px_30px_rgba(0,0,0,0.1)]  text-white text-xs-plus placeholder:text-nickle"
                placeholder="Write Min sleep time"
                value={values.minSleepTime}
                onChange={(e) =>
                  setFieldValue("minSleepTime", e.target.value.trimStart())
                }
                error={
                  (touched.minSleepTime || submitCount > 0) &&
                  errors.minSleepTime
                    ? errors.minSleepTime
                    : undefined
                }
              />
              <LabelAndInputModals
                label="Max sleep time :"
                labelClassName="w-full text-label"
                inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:  shadow-[0_4px_30px_rgba(0,0,0,0.1)]  text-white text-xs-plus placeholder:text-nickle"
                placeholder="Write Max sleep time"
                value={values.maxSleepTime}
                onChange={(e) =>
                  setFieldValue("maxSleepTime", e.target.value.trimStart())
                }
                error={
                  (touched.maxSleepTime || submitCount > 0) &&
                  errors.maxSleepTime
                    ? errors.maxSleepTime
                    : undefined
                }
              />
              <LabelAndInputModals
                label=" Gas Priority :"
                labelClassName="w-full text-label"
                inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:  shadow-[0_4px_30px_rgba(0,0,0,0.1)]  text-white text-xs-plus placeholder:text-nickle"
                placeholder="Write  Gas Priority"
                value={values.gasPriority}
                onChange={(e) =>
                  setFieldValue("gasPriority", e.target.value.trimStart())
                }
                error={
                  (touched.gasPriority || submitCount > 0) && errors.gasPriority
                    ? errors.gasPriority === "Expected number, received string"
                      ? "Required"
                      : errors.gasPriority
                    : undefined
                }
              />
            </div>
            <div className="w-full flex items-center gap-3 py-3">
              <LabelAndInputModals
                label="Gas Price :"
                labelClassName="w-full text-label"
                inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:  shadow-[0_4px_30px_rgba(0,0,0,0.1)]  text-white text-xs-plus placeholder:text-nickle"
                placeholder="Write Gas Price"
                wrapperClassName="w-[10rem]"
                value={values.gasPrice}
                onChange={(e) =>
                  setFieldValue("gasPrice", e.target.value.trimStart())
                }
                error={
                  (touched.gasPrice || submitCount > 0) && errors.gasPrice
                    ? errors.gasPrice === "Expected number, received string"
                      ? "Required"
                      : errors.gasPrice
                    : undefined
                }
              />
              <LabelAndInputModals
                label="BuyFrequency(%) :"
                labelClassName="w-full text-label"
                wrapperClassName="w-[10rem]"
                inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:  shadow-[0_4px_30px_rgba(0,0,0,0.1)]  text-white text-xs-plus placeholder:text-nickle"
                placeholder="Write Frequency"
                value={values.timesToBuyEth}
                onChange={(e) =>
                  setFieldValue("timesToBuyEth", e.target.value.trimStart())
                }
                error={
                  (touched.timesToBuyEth || submitCount > 0) &&
                  errors.timesToBuyEth
                    ? errors.timesToBuyEth
                    : undefined
                }
              />
              <LabelAndSwitch
                // label={
                //     values.bridgeDirection
                //         ? 'ETHEREUM :'
                //         : 'ZKS-ERA:'
                // }
                label={"Bridge Direction :"}
                labelClassName="w-full text-label"
                inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:  shadow-[0_4px_30px_rgba(0,0,0,0.1)]  text-white text-xs-plus placeholder:text-nickle"
                placeholder="0.00"
                wrapperClassName="w-fit"
                valueType={values.bridgeDirection ? "ETH" : "ZKS-ERA"}
                checked={values.bridgeDirection ?? false}
                onClick={() =>
                  setFieldValue("bridgeDirection", !values.bridgeDirection)
                }
                error={
                  (touched.bridgeDirection || submitCount > 0) &&
                  errors.bridgeDirection
                    ? errors.bridgeDirection
                    : undefined
                }
              />
              <LabelAndSwitch
                label={"Enable Queue"}
                labelClassName="w-full text-label"
                inputClassName="w-full h-10 bg-white dark:bg-backgroundInput  border border-borderLight dark:border-borders text-default dark:  shadow-[0_4px_30px_rgba(0,0,0,0.1)]  text-white text-xs-plus placeholder:text-nickle"
                placeholder="0.00"
                wrapperClassName="w-fit"
                checked={values.enableQueue ?? false}
                onClick={() =>
                  setFieldValue("enableQueue", !values.enableQueue)
                }
                error={
                  (touched.enableQueue || submitCount > 0) && errors.enableQueue
                    ? errors.enableQueue
                    : undefined
                }
              />
            </div>
          </AccordionComponent>
        </div>
      </div>
    </form>
  );
};

export default AirdropFarming;
