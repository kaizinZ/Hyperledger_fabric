import { buildCAClient, enrollAdmin, registerAndEnrollUser } from "../../../utils/CAUtil";
import { buildCCPOrg, buildWallet, createWalletPath } from "../../../utils/AppUtil";

import { FabricClient } from "./FabricClient";
import { Gateway, GatewayOptions } from "fabric-network";
import { chaincodeName, channelName } from "../../constants";

export class FabricClientFactory {
    private static fabricClient: FabricClient;

    public static async build(organizationNumber: number) {
        if (this.fabricClient === undefined) {
            const ccp = buildCCPOrg(organizationNumber)
            const caClient = buildCAClient(ccp, `ca.org${organizationNumber}.example.com`)
            const wallet = await buildWallet(createWalletPath(organizationNumber))
            try {
                await enrollAdmin(caClient, wallet, `Org${organizationNumber}MSP`)
            } catch(e) {
                console.error(e)
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
