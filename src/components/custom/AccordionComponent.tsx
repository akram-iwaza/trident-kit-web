import { cn } from "../../lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import React from "react"; // <-- Add this line

interface AccordionComponentProps {
  label: string;
  children: React.ReactNode;
  paddingClassName?: string;
}

const AccordionComponent: React.FC<AccordionComponentProps> = ({
  label,
  children,
  paddingClassName,
}) => (
  <Accordion
    type="single"
    collapsible
    className="w-full text-default dark:text-whiteColor"
  >
    <AccordionItem
      value="item-1"
      className={cn(
        `w-full py-4 border-b-[1px] border-borderLight dark:border-default`,
        paddingClassName
      )}
    >
      <AccordionTrigger className="text-default dark:text-whiteColor font-semibold text-xs-plus">
        {label}
      </AccordionTrigger>
      <AccordionContent className="pb-[15px]">{children}</AccordionContent>
    </AccordionItem>
  </Accordion>
);

export default AccordionComponent;
