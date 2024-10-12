interface Task {
  Mode: number;
  WalletGroup: string;
  myWallet: string | string[];
  Proxy: string;
  key: string;
  selectedAccountKey?: string;
}

interface wallet {
  WalletName: string;
  address: string;
  privateKey: string;
  coinType: string;
  balance: string;
  key: string;
}
interface account {
  accountName: string;
  category: string;
  WalletGroup: string;
  myWallet: string[];
  Proxies: string;
  key: string;
  myGroupName?: string;
  tokenDiscord?: string;
  TwitterAuthToken?: string;
  profileImage?: string;
}
interface Proxies {
  IP: string;
  PASSWORD: string;
  PORT: string;
  USERNAME: string;
  key: string;
}

interface Group {
  name: string;
  groupData: Task[];
}

interface IProps {
  isOpen: boolean;
  isAccountTab?: boolean;
  onReturnValue: (value: any) => void;
  onReturnValueAccountNameOptions?: (value: any) => void;
  searchedValue: any;
  clearValue?: boolean;
  setClearValue?: any;
  clearSearchInput?: any;
  isReady: boolean;
}

interface MyTask {
  id: number;
  taskname: string;
  walletname: string;
  proxyname: string;
}

interface TableComponentProps<T> {
  tasks: T[];
  getVisibleKeys?: any;
  columns: Array<{
    label: string;
    dataKey:
      | keyof Task
      | keyof Proxies
      | keyof wallet
      | keyof account
      | "status"
      | "actions";
    width: number;
    cellRenderer?: (props: any) => React.ReactNode;
  }>;
  playingTasks?: string[];
  handleTogglePlay?: (id: string) => void;
  handleSelectAll: (selectAll: boolean) => void;
  handleSelectTask: (id: string) => void;
  selectedTasks: string[];
  isOpen: boolean;
  isTask?: boolean;
  isAccounts?: boolean;
  disabled: boolean;
  noDataButtonText: string;
  noDataButtonOnclick: any;
  isWallet?: boolean;
  isProxies?: boolean;
}

interface TableComponentDashboardProps<T> {
  tasks: T[];
  columns: Array<{
    label: string;
    dataKey: string;
    width: number;
    cellRenderer?: (props: any) => React.ReactNode;
  }>;
  isSize?: boolean;
  isOpen: boolean;
}

interface IGroupTabsProps {
  tabs: string[];
  onAddTab: () => void;
  onTabClick: (tabName: string) => void;
  selectedTab: string;
  onEditClick: (value: string) => void;
}
interface FetchState<T> {
  data: T;
  isLoading: boolean;
  error: boolean;
}
interface IPropsCreateGroupTaskNameModal {
  onClose: () => void;
  tabName?: string | undefined;
  onCallback: (value: string | undefined) => void;
  typeTab: string;
  getType: string;
  isAccount?: boolean;
  isTask?: boolean;
  taskGroups: TaskGroup[] | string[];
  setActions?: any;
  actions?: any;
}
interface ICreateGroupNameResponse {
  groupName: string | undefined;
  previousGroupName: string | undefined;
  mainCategory?: string | undefined;
  mode?: string | undefined;
  type?: string | undefined;
}

interface IProxy {
  IP: string;
  PORT: string;
  USERNAME: string;
  PASSWORD: string;
}

interface ICreateProxiesResponse {
  myGroupName: string;
  myGroupProxies: IProxy[];
}

interface IPropsAddProxiesModal {
  onClose: () => void;
  tabName: string;
  taskGroups: string[];
  rowKey: string | undefined;
  wallet: any;
  address: string | undefined;
  emptyGroups?: boolean;
  setSelectedTab: any;
  walletNames: string[];
  balance: string | undefined;
}

interface IPropsGenerateWallets {
  onClose: () => void;
  tabName?: string | undefined;
  emptyGroups?: boolean;
  taskGroups: string[];
  setSelectedTab: any;
}

interface IGroup {
  myGroupName: string;
  myGroupWallets: Array<{
    address: string;
    privateKey: string;
    WalletName: string;
    coinType: string;
    key: number;
  }>;
}

interface IPropsAddAccountsModal {
  onClose: () => void;
  tabName: string;
  taskGroups: TaskGroup[];
  rowKey: number | null | undefined;
  wallet?: string | undefined;
  formData: account | undefined;
  categoryValue: string | undefined;
  taskCategory: string | undefined;
  setSelectedTab?: any;
  selectedTab?: string;
  setCreateAccountsModal?: any;
  createAccountsModal?: any;
  setTabValue?: any;
  accountNames?: string[];
}

interface IGroupWallet {
  myGroupName: string;
  myGroupWallets: Array<{
    address: string;
    privateKey: string;
    WalletName: string;
    coinType: string;
    key: number;
  }>;
}

interface IGroupProxies {
  myGroupName: string;
  myGroupProxies: Array<{
    IP: string;
    PASSWORD: string;
    PORT: string;
    USERNAME: string;
    key: number;
  }>;
}

interface IGroupAccounts {
  mainCategory: string;
  myGroupName: string;
  myGroupAccounts: Array<{
    TwitterAuthToken: string;
    tokenDiscord: string;
    myGroupName: string;
    key: string;
    category: string;
    accountName: string;
    WalletGroup: string;
    Proxies: string;
    myWallet: string | string[];
  }>;
}

interface IForm {
  myGroupName: string;
  WalletGroup: string | undefined;
  accountName: string;
  category: string;
  tokenDiscord: string;
  TwitterAuthToken: string;
  myWallet: string | string[];
}
interface TaskGroup {
  tab: string;
  category: string;
}

interface IPropsMassLinkModal {
  onClose: () => void;
  isOpenMassLinkModal: {
    isOpen: boolean;
    category: string | undefined;
    tabName: string | undefined;
  };
  tasks: account[];
  twitterGroupAccounts: account[];
  discordGroupAccounts: account[];
  taskCategory: string | undefined;
  taskGroups: TaskGroup[];
}

interface IFormMassLink {
  category: string | undefined;
  myGroupName: string | undefined;
  WalletGroup: string | undefined;
  myWallet: string | string[] | undefined;
  tokenDiscord: string | undefined;
  TwitterAuthToken: string | undefined;
  accountName: string | undefined;
  type: string;
}

interface IGroupWallets {
  myGroupName: string;
  myGroupWallets: { WalletName: string }[];
}

interface TwitterAccount {
  name?: string;
  password?: string;
  email?: string;
  confirmPassword?: string;
  TwitterAuthToken?: string;
  faValue?: string;
  TwitterAuthTokenSingle?: string;
  ct0?: string;
}
interface MultiFarmTask {
  Mode: string;
  myGroupName: string;
  generateWallets: boolean;
  twitterAccounts: TwitterAccount[];
}
