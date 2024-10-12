interface IPropsMainSettings {
  isOpen: boolean;
  unlockApp:boolean
  checkUnlockApp:any
  getUserData:any
  isReady: boolean
}

interface ICreateOrUpdateSettingsResponse {
  DiscordWebhook: string | undefined;
  EtherscanApiKey: string | undefined;
  NodeApiKey: string | undefined;
  BlocknativeApiKey: string | undefined;
  MempoolWss: string | undefined;
  myEthDelay:any;
  licenceKey: string | undefined;
}
interface ISettingsData {
  settings: {
    BlocknativeApiKey: string;
    DiscordWebhook: string;
    EtherscanApiKey: string;
    H2Captcha: string;
    MempoolWss: string;
    NodeApiKey: string;
    TwoHCaptcha: string;
    myEthDelay: string;
    numberOfThreads?: string;
    sleepTime?: string;
  };
  licenseKey: {
    KEY: string;
  };
}
