import { z } from 'zod';

export const updateSettingsSchema = z.object({
  discordWebhook: z.string().optional(),
  etherscanKey: z.string().optional(),
  nodeKey: z.string().optional(),
  blockNativeKey: z.string().optional(),
  mempool: z.string().optional(),
  delay: z.string().optional(),
  licenceKey: z.string().optional(),
});
