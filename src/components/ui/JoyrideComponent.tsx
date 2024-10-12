import Joyride from "react-joyride";
import React, { FC } from "react";
import { useTheme } from "../../hooks/ThemeContext";
interface IPropsJoyride {
  handleTourCallback: any;
  isTourOpen: boolean;
  steps: any;
}
const JoyrideComponent: FC<IPropsJoyride> = ({
  handleTourCallback,
  isTourOpen,
  steps,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <Joyride
      steps={steps}
      continuous
      showSkipButton
      showProgress
      callback={handleTourCallback}
      run={isTourOpen}
      disableScrolling
      spotlightClicks={true} // Allow spotlight clicks
      hideBackButton={false} // Show the back button during the tour
      locale={{
        back: "Back",
        close: "Close", // Change the Skip button text to "Close"
        last: "Finish", // Set the last button text to "Finish"
        next: "Next",
        skip: "Close", // Change the Skip button text to "Close"
      }}
      styles={{
        options: {
          zIndex: 10000, // Ensure Joyride overlay is above other elements
        },
        spotlight: {
          borderWidth: "2px",
          borderColor: "#fff",
          borderRadius: "8px",
          width: 1,
        },
        tooltip: {
          backgroundColor: isDarkMode ? "#1A191C" : "#fff", // Tooltip background color
          borderRadius: "8px", // Rounded corners for the tooltip
          color: isDarkMode ? "#fff" : "#1A191C", // Tooltip text color
          textAlign: "left", // Align text to the left
          width: "700px", // Set a specific width for the tooltip
          padding: "22px", // Add padding inside the tooltip
        },
        tooltipContainer: {
          textAlign: "left", // Tooltip content alignment
        },
        tooltipContent: {
          padding: "0", // Remove default padding for more control
        },
        buttonClose: {
          width: "10px",
          height: "10px",
          color: "#AAAAA6", // Close button color
          top: "0px",
          right: "0px",
        },
        buttonNext: {
          backgroundColor: isDarkMode ? "#35463a" : "#1A191C", // Next button color
          borderRadius: "0.5rem", // Rounded corners for spotlight
          color: isDarkMode ? "#93e5ab" : "#fff", // Next button text color
          fontSize: "14px", // Font size for the next button
          padding: "8px 16px", // Padding for the next button
        },
        buttonBack: {
          backgroundColor: isDarkMode ? "#302f2f" : "gray",
          borderRadius: "0.5rem", // Rounded corners for spotlight
          borderColor: isDarkMode ? "#333336" : "gray",
          color: "#fff",
        },
        buttonSkip: {
          backgroundColor: isDarkMode ? "#301f20" : "gray",
          borderRadius: "0.5rem", // Rounded corners for spotlight
          borderColor: "#301f20",
          color: "#fff",
        },
      }}
    />
  );
};

export default JoyrideComponent;
