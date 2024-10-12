import { ReactNode } from 'react';

export interface ITab {
    name: string;
    icon?: JSX.Element;
    activeIcon?:JSX.Element;
    subTabs?: ITab[];
}

interface SubTask {
    id: number;
    label: string;
    icon?: JSX.Element;
    value: string;
}

export interface ModeOption {
    id: number;
    label: string;
    value: string;
    icon?: JSX.Element;
    subTasks?: SubTask[];
}
