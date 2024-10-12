import { z } from 'zod';

export const proxySchema = z.object({
  IP: z.string().min(1, 'IP is required'),
  PORT: z.string().min(1, 'PORT is required'),
  USERNAME: z.string().min(1, 'USERNAME is required'),
  PASSWORD: z.string().min(1, 'PASSWORD is required'),
});

export const createProxiesSchema = z.object({
  myGroupName: z.string().min(1, 'Group name is required'),
  myGroupProxies: z
    .array(proxySchema)
    .nonempty('At least one proxy is required'),
});
