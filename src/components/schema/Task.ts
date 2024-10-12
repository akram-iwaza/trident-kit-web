import { z } from "zod";

export const createGroupNameSchema = z.object({
  groupName: z
    .string()
    .min(3, { message: "must be at least 3 characters" })
    .max(10, { message: "must be at most 10 characters" }),
});

export const validationSchemaMagiceden = z.object({
  Mode: z.string().nonempty("Mode is required"),
  Proxy: z.string().nonempty("Proxy is required"),
  SnipingPrice: z.string().nonempty("SnipingPrice is required"),
  WalletGroup: z.union([
    z.string().nonempty("WalletGroup is required"),
    z.array(z.string()).min(1, "At least one WalletGroup is required"),
  ]),
  collectionSlug: z.string().nonempty("collectionSlug is required"),
  key: z.string().optional(),
  myGasMode: z.string().optional(),
  myWallet: z.union([z.string(), z.array(z.string())]),
});

export const validationSchemaContractMinting = z.object({
  ContractAddress: z.string().nonempty("ContractAddress is required"),
  Mode: z.string().nonempty("Mode is required"),
  Price: z.string().nonempty("Price is required"),
  Proxy: z.string().nonempty("Proxy is required"),
  WalletGroup: z.union([
    z.string().nonempty("WalletGroup is required"),
    z.array(z.string()).min(1, "At least one WalletGroup is required"),
  ]),
  gasLimit: z.string().optional(),
  key: z.string().optional(),
  gasPrice: z.string().optional(),
  maxPriorityFeePerGas: z.string().optional(),
  mintFunctionName: z.string().nonempty("mintFunctionName is required"),
  mintFunctionParameters: z
    .string()
    .nonempty("mintFunctionParameters is required"),
  myGasMode: z.string().nonempty("myGasMode is required"),
  myWallet: z.union([z.string(), z.array(z.string())]),
  nbGroupTask: z.string().nonempty("Number Task is required"),
});

export const validationSchemaAirdropFarming = z
  .object({
    Mode: z.string().nonempty("Mode is required"),
    Proxy: z.string().nonempty("Proxy is required"),
    WalletGroup: z.string().nonempty("WalletGroup is required"),
    bridgeDirection: z.boolean().optional(),
    bridgingProtocols: z.array(z.string()).optional(),
    buyEth: z.boolean(),
    buyEthPer: z.number().positive("buyEthPer must be a positive number"),
    buyEthSlippage: z
      .number()
      .positive("buyEthSlippage must be a positive number"),
    enableQueue: z.boolean(),
    farmingEth: z.number().positive("farmingEth must be a positive number"),
    key: z.string().optional(),
    gasPrice: z.number().optional(),
    gasPriority: z.number().optional(),
    inputPercentage: z.number(),
    isPercentage: z.boolean(),
    maxSleepTime: z.number().positive("maxSleepTime must be a positive number"),
    minSleepTime: z.number().positive("minSleepTime must be a positive number"),
    myFarmingFlow: z.array(z.string()).nonempty("At least Select One"),
    myGasMode: z.string().nonempty("Required"),
    myGroupName: z.string().optional(),
    myLiquidityProtocol: z.array(z.string()).optional(),
    myMintingProtocols: z.array(z.string()).optional(),
    myOthersProtocols: z.array(z.string()).optional(),
    myProtocolType: z.string().nonempty("myProtocolType is required"),
    myWallet: z.array(z.string()).nonempty("At least one myWallet is required"),
    swapProtocols: z.array(z.string()).nonempty("At least Select One"),
    timesToBuyEth: z
      .number()
      .positive("timesToBuyEth must be a positive number"),
    walletAutoRefund: z.boolean().optional(),
  })
  .refine(
    (data) => {
      console.log("data : ", data);

      const flow = data.myFarmingFlow;
      const requiredFields = [];

      if (flow.includes("Bridging") && data?.bridgingProtocols) {
        requiredFields.push(data?.bridgingProtocols?.length > 0);
      }

      if (flow.includes("Swapping") && data?.swapProtocols) {
        requiredFields.push(data?.swapProtocols?.length > 0);
      }

      if (flow.includes("Liquidity") && data?.myLiquidityProtocol) {
        requiredFields.push(data?.myLiquidityProtocol?.length > 0);
      }

      if (flow.includes("Minting") && data?.myMintingProtocols) {
        requiredFields.push(data?.myMintingProtocols?.length > 0);
      }

      if (flow.includes("Others") && data?.myOthersProtocols) {
        requiredFields.push(data?.myOthersProtocols?.length > 0);
      }

      return requiredFields.every(Boolean);
    },
    {
      message: "",
      path: ["myFarmingFlow"],
    }
  );

export const validationSchemaBlurBidder = z.object({
  Mode: z.string().nonempty("Mode is required"),
  NumberOfBidders: z.string().optional(),
  NumberOfBids: z.string().optional(),
  OwnershipThreshold: z.string().optional(),
  Proxy: z.string().nonempty("Proxy is required"),
  WalletGroup: z.string().nonempty("WalletGroup is required"),
  collectionsToBid: z.array(z.string()).optional(),
  collectionsToSkip: z.array(z.string()).optional(),
  floorPriceRange: z.array(z.string()).optional(),
  key: z.string().optional(),
  fpSafety: z.boolean(),
  isAdvancedMode: z.boolean(),
  isAntiAcceptMode: z.boolean(),
  isAutoBidder: z.boolean(),
  isBlast: z.boolean(),
  isSafeMode: z.boolean(),
  myGasMode: z.string().nonempty("myGasMode is required"),
  myGroupName: z.string().optional(),
  myWallet: z.array(z.string()).nonempty("At least one myWallet is required"),
  percentageOfBids: z.string().optional(),
  positionToBidAt: z.string().optional(),
});

export const validationSchemaTensor = z.object({
  Mode: z.string().nonempty("Mode is required"),
  NumberOfBidders: z.string().optional(),
  NumberOfBids: z.string().optional(),
  Proxy: z.string().nonempty("Proxy is required"),
  WalletGroup: z.string().nonempty("WalletGroup is required"),
  collectionsToBid: z.string().nonempty("collectionsToBid is required"),
  collectionsToSkip: z.array(z.string()).optional(),
  floorPriceRange: z.array(z.string()).optional(),
  fpSafety: z.boolean(),
  heliusRpc: z.string().nonempty("heliusRpc is required"),
  isAntiAcceptMode: z.boolean(),
  key: z.string().optional(),
  isAutoBidder: z.boolean(),
  isSafeMode: z.boolean(),
  loopTask: z.boolean(),
  myGasMode: z.string().nonempty("myGasMode is required"),
  myGroupName: z.string().optional(),
  myWallet: z.array(z.string()).nonempty("At least one myWallet is required"),
  numberOfBids: z.string().nonempty("numberOfBids is required"),
  priorityFee: z.string().optional(),
  underBidAmount: z.string().nonempty("underBidAmount is required"),
});

export const validationSchemaMagicedenFarmer = z.object({
  Mode: z.string().nonempty("Mode is required"),
  Proxy: z.string().nonempty("Proxy is required"),
  WalletGroup: z.string().nonempty("WalletGroup is required"),
  collectionsToBid: z.string().nonempty("collectionsToBid is required"),
  collectionsToSkip: z.array(z.string()).optional(),
  floorPriceRange: z.array(z.string()).optional(),
  fpSafety: z.boolean(),
  heliusRpc: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        const urlPattern = /^(http|https):\/\/[^\s$.?#].[^\s]*$/;
        return urlPattern.test(value);
      },
      {
        message: "must be a valid URL",
      }
    ),
  key: z.string().optional(),
  isSafeMode: z.boolean(),
  loopTask: z.boolean(),
  myGasMode: z.string().nonempty("myGasMode is required"),
  myGroupName: z.string().optional(),
  myWallet: z.array(z.string()).nonempty("At least one myWallet is required"),
  priorityFee: z.string().optional(),
  underBidAmount: z.string().nonempty("underBidAmount is required"),
  percentageUndercut: z.string().nonempty("required"),
});

export const validationSchemaMultifarm = z.object({
  proxy: z.array(z.string()).optional(),
  mode: z.string().optional(),
  myGroupName: z.string().optional(),
  inviteCode: z.string().optional(),
  skipTwitterAction: z.boolean(),
  selectedAccountKey: z
    .array(z.string())
    .min(1, "At least one Twitter account is required"),
  selectedAccountGroup: z
    .array(z.string())
    .nonempty("At least one is required"),
  multiFarmModeChange: z.string().optional(),
  setPartnersToSkip: z.array(z.string()).optional(),
  enterRaffles: z.boolean().optional(),
  Pledge: z.boolean().optional(),
  enterRafflePercentage: z.string().optional(),
  pledgePercentage: z.string().optional(),
});

export const validationSchemaDistricone = z.object({
  Proxy: z.string().nonempty("required"),
  inviteCode: z.string().nonempty("required"),
  stakedModeSwitch: z.boolean(),
  WalletGroup: z.string().nonempty("required"),
  myWallet: z.array(z.string()).nonempty("required").min(1),
  StageId: z.string().nonempty("required"),
  websocketUrl: z
    .string()
    .nonempty("required")
    .refine((value) => value.startsWith("wss://"), {
      message: 'must start with "wss://"',
    }),
  CapsolverAPI: z.string().optional(),
  skipClaims: z.string().optional(),
  key: z.string().optional(),
  Mode: z.string().optional(),
});

export const validationSchemaGenerateWallets = z.object({
  myGroupName: z.string().nonempty("required"),
  numberOfWallets: z
    .number()
    .min(1, { message: "Number of wallets must be at least 1" })
    .optional(), // Allow numberOfWallets to be undefined
});

export const validationSchemaOpenseaBidder = z.object({
  Mode: z.string().nonempty("Mode is required"),
  Proxy: z.string().optional(),
  maxAmount: z.string().nonempty("max Amount is required"),
  WalletGroup: z.union([
    z.string().nonempty("WalletGroup is required"),
    z.array(z.string()).min(1, "At least one WalletGroup is required"),
  ]),
  minAmount: z.string().nonempty("min Amount is required"),
  key: z.string().optional(),
  slug: z.string().nonempty("slug is required"),
  outBid: z.string().nonempty("out Bid is required"),
  handleSelect: z.string(),
  myWallet: z.union([z.string(), z.array(z.string())]),
});
