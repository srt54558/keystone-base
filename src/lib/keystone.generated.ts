import type { ModuleConfig } from "./modules/registry.js";

export interface KeystoneGeneratedConfig {
  version: number;
  providers: {
    auth: string;
    payments: "stripe" | "polar" | "lemonsqueezy" | "none";
    storage: "convex" | "s3" | "r2" | "uploadthing" | "none";
    analytics: "posthog" | "plausible" | "google" | "none";
  };
  modules: ModuleConfig[];
  requiredEnv: string[];
}

export const KEYSTONE_GENERATED: KeystoneGeneratedConfig = {
  version: 1,
  providers: {
    auth: "none",
    payments: "none",
    storage: "none",
    analytics: "none",
  },
  modules: [],
  requiredEnv: [],
};
