import { buildCAClient, enrollAdmin } from "../../../utils/CAUtil";
import { buildCCPOrg1, buildWallet } from "../../../utils/AppUtil";

import { FabricClient } from "./FabricClient";
import { Gateway, GatewayOptions } from "fabric-network";
import { chaincodeName, channelName, mspOrg1, walletPath } from "../../constants";

export class FabricClientFactory {
    private static fabricClient: FabricClient;

    public static async build() {
        if (this.fabricClient === undefined) {
            const ccp = buildCCPOrg1();
            const caClient = buildCAClient(ccp, "ca.org1.example.com");
            const wallet = await buildWallet(walletPath);
            try {
                await enrollAdmin(caClient, wallet, mspOrg1);
                // await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, "org1.department1");
            } catch (e) {
                console.error(e);
            }
            const gateway = new Gateway();
            const gatewayOpts: GatewayOptions = {
                wallet,
                identity: "admin",
                discovery: { enabled: true, asLocalhost: true },
            };
            await gateway.connect(ccp, gatewayOpts);
            const network = await gateway.getNetwork(channelName);
            const contract = network.getContract(chaincodeName);
            this.fabricClient = new FabricClient(contract);
        }

        return this.fabricClient;
    }
}
