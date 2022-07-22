/* eslint-disable @typescript-eslint/no-explicit-any */

import { Wallet, Wallets } from "fabric-network";
import * as fs from "fs";
import * as path from "path";

const buildCCPOrg = (organizationNumber: number): Record<string, any> => {
    // load the common connection configuration file
    const ccpPath = path.resolve(
        __dirname,
        "..",
        "..",
        "..",
        "chaincode-network",
        "network",
        "organizations",
        "peerOrganizations",
        `org${organizationNumber}.example.com`,
        `connection-org${organizationNumber}.json`,
    );
    const fileExists = fs.existsSync(ccpPath);
    if (!fileExists) {
        throw new Error(`no such file or directory: ${ccpPath}`);
    }
    const contents = fs.readFileSync(ccpPath, "utf8");

    // build a JSON object from the file contents
    const ccp = JSON.parse(contents);

    console.log(`Loaded the network configuration located at ${ccpPath}`);
    return ccp;
};

const buildWallet = async (walletPath?: string): Promise<Wallet> => {
    // Create a new  wallet : Note that wallet is for managing identities.
    let wallet: Wallet;
    if (walletPath) {
        wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Built a file system wallet at ${walletPath}`);
    } else {
        wallet = await Wallets.newInMemoryWallet();
        console.log("Built an in memory wallet");
    }

    return wallet;
};

const createWalletPath = (organizationNumber: number) => {
    return path.join(__dirname, `wallet${organizationNumber}`);
}

const prettyJSONString = (inputString: string): string => {
    if (inputString) {
        return JSON.stringify(JSON.parse(inputString), null, 2);
    } else {
        return inputString;
    }
};

export { buildCCPOrg, createWalletPath, buildWallet, prettyJSONString };
