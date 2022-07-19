
import * as path from "path";

export const channelName = "mychannel";
export const chaincodeName = "ledger";
export const mspOrg1 = "Org1MSP";
export const walletPath = path.join(__dirname, "wallet");
export const org1UserId = "appUser-test-test";

const STATUSES = ["sale", "problem", "deliver"] as const
export type Status = typeof STATUSES[number]