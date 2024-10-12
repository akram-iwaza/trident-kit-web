import React, { FC, useState, useEffect } from "react";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { distributeSchema, recollectSchema } from "../../schema/wallets";
import { toast } from "../../ui/use-toast";
import ModalHeader from "../../custom/ModalHeader";
import LabelWithDropdown from "../../dropdowns/LabelWithDropdown";
import DelayInputNumber from "../../custom/DelayInputNumber";

interface Group {
  myGroupName: string;
  myGroupWallets: Array<{
    address: string;
    privateKey: string;
    WalletName: string;
    coinType: string;
    key: number;
  }>;
}

interface IPropsDistributeRecollectModal {
  onClose: () => void;
  isRecollect: boolean;
  groups: Group[] | any[];
}

const DistributeRecollectModal: FC<IPropsDistributeRecollectModal> = ({
  onClose,
  isRecollect,
  groups,
}) => {
  const [clearSelectedValues, setClearSelectedValues] = useState(false);
  const [selectedFromGroup, setSelectedFromGroup] = useState<string>("");
  const [selectedToGroup, setSelectedToGroup] = useState<string>("");
  const [fromWalletOptions, setFromWalletOptions] = useState<string[]>([]);
  const [toWalletOptions, setToWalletOptions] = useState<string[]>([]);

  const title = isRecollect ? "Recollect Funds" : "Distribute Funds";

  const schema = isRecollect ? recollectSchema : distributeSchema;

  const initialValues = isRecollect
    ? {
        recollectFromGroup: "",
        recollectFromWallet: [] as string[],
        myEthAmount: 0,
        recollectToGroup: "",
        recollectToWallet: "",
      }
    : {
        distributeFromGroup: "",
        distributeFromWallet: "",
        myEthAmount: 0,
        distributeToGroup: "",
        distributeToWallets: [] as string[],
      };

  const formik = useFormik({
    initialValues,
    //@ts-ignore
    validationSchema: toFormikValidationSchema(schema),
    onSubmit: (values) => {
      const data = isRecollect
        ? {
            myEthAmount: values.myEthAmount,
            walletToRecollectFrom: {
              myFromGroup: values.recollectFromGroup,
              selectedRecollectWallets: values.recollectFromWallet,
            },
            walletsToRecollectTo: {
              myToGroup: values.recollectToGroup,
              recollectToWallet: values.recollectToWallet,
            },
          }
        : {
            myEthAmount: values.myEthAmount,
            walletToDistributeFrom: {
              distributeFromWallets: values.distributeFromWallet,
              myFromGroup: values.distributeFromGroup,
            },
            walletsToDitributeTo: {
              myToGroup: values.distributeToGroup,
              selectedDistributeWallets: values.distributeToWallets,
            },
          };

      if (isRecollect) {
        onClose();
        toast({
          variant: "success",
          title: `Recollect Funds Successfuly`,
        });
      } else {
        onClose();
        toast({
          variant: "success",
          title: `Distribute Funds Successfuly`,
        });
      }
    },
  });

  const { values, setFieldValue, handleSubmit, errors, touched, setValues } =
    formik;

  const handleClear = () => {
    setValues(() => initialValues);
    setClearSelectedValues(true);
  };
  useEffect(() => {
    if (selectedFromGroup) {
      const group = groups.find((g) => g.myGroupName === selectedFromGroup);
      if (group) {
        setFromWalletOptions(
          group.myGroupWallets.map(
            (wallet: { WalletName: any }) => wallet.WalletName
          )
        );
      }
    } else {
      setFromWalletOptions([]);
    }
  }, [selectedFromGroup, groups]);

  useEffect(() => {
    if (selectedToGroup) {
      const group = groups.find((g) => g.myGroupName === selectedToGroup);
      if (group) {
        setToWalletOptions(
          group.myGroupWallets.map(
            (wallet: { WalletName: any }) => wallet.WalletName
          )
        );
      }
    } else {
      setToWalletOptions([]);
    }
  }, [selectedToGroup, groups]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "Enter") {
        handleSubmit();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  console.log(values);

  return (
    <ModalHeader
      label={title}
      onClose={onClose}
      wrapperClassName="w-fit h-fit"
      onSubmit={handleSubmit}
      onClear={handleClear}
    >
      <div className="w-full flex flex-col gap-[32px]">
        <div className="w-full grid grid-cols-3 gap-[14px]">
          <LabelWithDropdown
            isSearch
            wrapperClassName="w-full"
            options={groups.map((group) => group.myGroupName)}
            placeholder="Wallet Group"
            onSelect={(value: string | string[]) => {
              setFieldValue(
                isRecollect ? "recollectFromGroup" : "distributeFromGroup",
                value
              );
              setSelectedFromGroup(value as string);
            }}
            deleteFieldValue={(field: string) => {
              setFieldValue("recollectFromGroup", undefined);
              setFieldValue("distributeFromGroup", undefined);
            }}
            fieldValue={"recollectFromGroup"}
            label={isRecollect ? "Wallet Group From" : "Wallet Group From"}
            error={
              isRecollect
                ? touched.recollectFromGroup && errors.recollectFromGroup
                  ? errors.recollectFromGroup
                  : undefined
                : touched.distributeFromGroup && errors.distributeFromGroup
                ? errors.distributeFromGroup
                : undefined
            }
            clearSelectedValues={clearSelectedValues}
            setClearSelectedValues={setClearSelectedValues}
          />
          <LabelWithDropdown
            wrapperClassName="w-full"
            isSearch
            options={fromWalletOptions}
            placeholder="Wallets"
            onSelect={(value: string | string[]) =>
              setFieldValue(
                isRecollect ? "recollectFromWallet" : "distributeFromWallet",
                value
              )
            }
            deleteFieldValue={(field: string) => {
              setFieldValue("recollectFromWallet", undefined);
              setFieldValue("distributeFromWallet", undefined);
            }}
            fieldValue={"distributeFromWallet"}
            label={isRecollect ? "Wallet(s) From" : "Wallet From"}
            multiSelect={isRecollect}
            error={
              isRecollect
                ? touched.recollectFromWallet && errors.recollectFromWallet
                  ? errors.recollectFromWallet
                  : undefined
                : touched.distributeFromWallet && errors.distributeFromWallet
                ? errors.distributeFromWallet
                : undefined
            }
            disabled={!selectedFromGroup}
            clearSelectedValues={clearSelectedValues}
            setClearSelectedValues={setClearSelectedValues}
          />
          <DelayInputNumber
            labelClassName="text-sm font-normal text-default dark:text-textSwitch  mb-0"
            wrapperClassName="w-full gap-[0.8rem]"
            wrapperInputClassName="bg-white dark:bg-[#2A2A2C] border border-borderLight dark:border-borderDropdown h-[2.3rem]"
            label={"Amount"}
            value={values.myEthAmount}
            onChange={(value: number) => {
              setFieldValue("myEthAmount", value, true);
            }}
            error={
              touched.myEthAmount && errors.myEthAmount
                ? errors.myEthAmount
                : undefined
            }
            errorClassName="-bottom-3"
            delayUnit="ETH"
            isDecimal={true}
          />
        </div>

        <div className="w-full h-[1px] bg-borderLight dark:bg-[#333336]" />

        <div className="w-full flex items-center gap-3">
          <LabelWithDropdown
            isSearch
            options={groups.map((group) => group.myGroupName)}
            placeholder="Wallet Group"
            onSelect={(value: string | string[]) => {
              setFieldValue(
                isRecollect ? "recollectToGroup" : "distributeToGroup",
                value
              );
              setSelectedToGroup(value as string);
            }}
            deleteFieldValue={(field: string) => {
              setFieldValue("recollectToGroup", undefined);
              setFieldValue("distributeToGroup", undefined);
              setSelectedToGroup("");
            }}
            fieldValue={"distributeFromWallet"}
            label={isRecollect ? "Wallet Group To" : "Wallet Group To"}
            error={
              isRecollect
                ? touched.recollectToGroup && errors.recollectToGroup
                  ? errors.recollectToGroup
                  : undefined
                : touched.distributeToGroup && errors.distributeToGroup
                ? errors.distributeToGroup
                : undefined
            }
            clearSelectedValues={clearSelectedValues}
            setClearSelectedValues={setClearSelectedValues}
          />
          <LabelWithDropdown
            isSearch
            options={toWalletOptions}
            placeholder="Wallets"
            onSelect={(value: string | string[]) =>
              setFieldValue(
                isRecollect ? "recollectToWallet" : "distributeToWallets",
                value
              )
            }
            deleteFieldValue={(field: string) => {
              setFieldValue("recollectToWallet", undefined);
              setFieldValue("distributeToWallets", undefined);
            }}
            fieldValue={"distributeFromWallet"}
            label={isRecollect ? "Wallet To" : "Wallet(s) To"}
            multiSelect={!isRecollect}
            error={
              isRecollect
                ? touched.recollectToWallet && errors.recollectToWallet
                  ? errors.recollectToWallet
                  : undefined
                : touched.distributeToWallets && errors.distributeToWallets
                ? errors.distributeToWallets
                : undefined
            }
            disabled={!selectedToGroup}
            clearSelectedValues={clearSelectedValues}
            setClearSelectedValues={setClearSelectedValues}
          />
        </div>
      </div>
    </ModalHeader>
  );
};

export default DistributeRecollectModal;
