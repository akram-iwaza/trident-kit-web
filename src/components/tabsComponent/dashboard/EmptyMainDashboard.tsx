import React, { FC } from "react";
import EmptyLineChart from "../../charts/EmptyLineChart";
import { Icons } from "../../icons/Icons";
interface IPropsEmptyMainDashboard {}

const EmptyMainDashboard: FC<IPropsEmptyMainDashboard> = () => {
  const headers = [
    { label: "Avatar", dataKey: "profileImage", width: 150 },
    { label: "Mode", dataKey: "Mode", width: 150 },
    { label: "Account Name", dataKey: "accountName", width: 150 },
    { label: "Wallet Key", dataKey: "privateKey", width: 150 },
    { label: "Actions", dataKey: "actions", width: 150 },
  ];

  return (
    <div className="w-full flex flex-col items-start gap-[15px]">
      <div className="w-full flex items-start gap-[15px]">
        <div className="w-[70%] h-[325px] bg-white dark:bg-backgroundInput  border border-borderLight dark:border-[#29292B] rounded-[14px]  shadow-[0_4px_30px_rgba(0,0,0,0.1)] ">
          <div className="w-full p-[14px] border-b-[1px] border-borderLight dark:border-[#29292B]">
            <span className="text-base text-default dark:text-white font-normal">
              Transaction Graph
            </span>
          </div>
          <div className="w-full p-[22px]">
            <EmptyLineChart />
          </div>
        </div>
        <div className="w-[30%] flex flex-col items-start bg-white dark:bg-backgroundInput  rounded-[14px] border border-borderLight dark:border-[#29292B] h-[325px]">
          <div className="w-full border-b-[1px] border-borderLight dark:border-[#29292B]">
            <div className="w-full p-[14px]">
              <span className="text-default dark:text-white text-base font-normal">
                Transaction Status
              </span>
            </div>
          </div>
          <div className="w-full flex flex-col items-start p-[22px] gap-[33px]">
            <div className="flex items-center gap-[12px]">
              <div className="w-[45px] h-[45px] rounded-[10px] flex items-center justify-center bg-[#1a2534]">
                <Icons.Dollar className="w-[21.13px] h-[21.13px]" />
              </div>
              <div className="flex flex-col items-start gap-[5px]">
                <span className="text-default dark:text-white text-base font-normal">
                  Total Interactions
                </span>
                <span className="text-placeholder  text-[14px] font-normal">
                  0
                </span>
              </div>
            </div>
            <div className="flex items-center gap-[12px]">
              <div className="w-[45px] h-[45px] rounded-[10px] flex items-center justify-center bg-[#1d2b26]">
                <Icons.Check className="w-[21.13px] h-[21.13px]" />
              </div>
              <div className="flex flex-col items-start gap-[5px]">
                <span className="text-default dark:text-white text-base font-normal">
                  Successful Interactions
                </span>
                <span className="text-placeholder  text-[14px] font-normal">
                  0
                </span>
              </div>
            </div>
            <div className="flex items-center gap-[12px]">
              <div className="w-[45px] h-[45px] rounded-[10px] flex items-center justify-center bg-[#301f20]">
                <Icons.Times className="w-[21.13px] h-[21.13px]" />
              </div>
              <div className="flex flex-col items-start gap-[5px]">
                <span className="text-default dark:text-white text-base font-normal">
                  Failed Interactions
                </span>
                <span className="text-placeholder  text-[14px] font-normal">
                  0
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="!rounded-[14px] bg-white dark:bg-backgroundInput  w-full h-[185px]">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header.dataKey}
                  style={{
                    width: `${header.width}px`,
                    textAlign: "left",
                    padding: "10px",
                    fontWeight: "normal",
                  }}
                  className="bg-white dark:bg-[#232323] border border-borderLight dark:border-[#29292B] text-default dark:text-white"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Display "No Data Found" when there is no data */}
            <tr>
              <td
                colSpan={headers.length}
                style={{ textAlign: "center", padding: "20px" }}
                className="relative top-10 text-default dark:text-white"
              >
                No Data Found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmptyMainDashboard;
