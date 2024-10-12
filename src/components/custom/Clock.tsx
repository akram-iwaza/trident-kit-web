import { useState, useEffect } from 'react';
import { Icons } from '../icons/Icons';
import React from "react"; // <-- Add this line

function Clock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    let hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert 24-hour format hours to 12-hour format
    hours = hours % 12;
    // 12:00 should be shown as 12, not 0
    hours = hours ? hours : 12;

    return (
        <div className="shadow-[0_4px_30px_rgba(0,0,0,0.1)] text-default dark:text-grayColor w-fit px-3 gap-[6px] border border-borderLight dark:border-borders rounded-lg h-8 flex items-center justify-center bg-white dark:bg-transparent">
            <Icons.ClockTime className='w-4 h-4' />
            {hours < 10 ? `0${hours}` : hours}:
            {minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds} {ampm}
        </div>
    );
}

export default Clock;
