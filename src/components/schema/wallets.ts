import { z } from 'zod';

export const distributeSchema = z.object({
    distributeFromGroup: z.string().nonempty('Required'),
    distributeFromWallet: z.string().nonempty('Required'),
    myEthAmount: z.string(), // Expect string input
    distributeToGroup: z.string().nonempty('Required'),
    distributeToWallets: z.array(z.string()).nonempty('Required'),
  });

  export const recollectSchema = z.object({
    recollectFromGroup: z.string().nonempty('Required'),
    recollectFromWallet: z.array(z.string()).nonempty('Required'),
    myEthAmount: z.string(), // Expect string input
    recollectToGroup: z.string().nonempty('Required'),
    recollectToWallet: z.string().nonempty('Required'),
  });

