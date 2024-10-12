import React, { FC, useEffect } from "react";
import { toast } from "../../ui/use-toast";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { validationSchemaGenerateWallets } from "../../schema/Task";
import ModalHeader from "../../custom/ModalHeader";
import DelayInput from "../../custom/DelayInput";
import ButtonTabs from "../../custom/ButtonTabs";
const GenerateWalletModal: FC<IPropsGenerateWallets> = ({
  onClose,
  tabName,
  emptyGroups,
  setSelectedTab,
}) => {
  type IBlurBidderResponse = z.infer<typeof validationSchemaGenerateWallets>;
  const {
    errors,
    setFieldValue,
    handleSubmit,
    values,
    isSubmitting,
    setFieldTouched,
    setSubmitting,
  } = useFormik<Partial<IBlurBidderResponse>>({
    initialValues: {
      numberOfWallets: undefined,
      myGroupName: !tabName ? "walletGroup" : tabName,
    },
    validationSchema: toFormikValidationSchema(validationSchemaGenerateWallets),
    onSubmit: (values) => {
      setSelectedTab(tabName);
      setSubmitting(false);

      toast({
        variant: "success",
        title: `Generated ${values.numberOfWallets} wallets successfully`,
      });
      onClose();

      setSelectedTab(tabName);
    },
  });

  const handleClear = () => {
    setFieldValue("numberOfWallets", undefined);
  };

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

  return (
    <ModalHeader
      label={"Generate Wallets"}
      onClose={onClose}
      wrapperClassName="w-[400px] h-fit"
    >
      <div className="w-full flex flex-col items-start gap-[20px]">
        <DelayInput
          wrapperClassName="w-full"
          label="Number of wallets"
          value={values.numberOfWallets || ""} // Show empty if undefined or 0
          onChange={(value: number) => {
            // Handle input change, allowing empty strings
            const finalValue =
              value !== undefined && value !== null ? Number(value) : undefined;
            setFieldValue("numberOfWallets", finalValue, true);
          }}
          error={errors.numberOfWallets}
          onBlur={() => {
            setFieldTouched("numberOfWallets", true);
          }}
        />
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
              !values.myGroupName || !values.numberOfWallets || isSubmitting
            }
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

export default GenerateWalletModal;
