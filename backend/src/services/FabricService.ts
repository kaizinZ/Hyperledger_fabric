import { provide } from "inversify-binding-decorators";

import { Gateway, GatewayOptions } from "fabric-network";
import * as path from "path";
import { buildCCPOrg1, buildWallet, prettyJSONString } from "../utils/AppUtil";
import { buildCAClient, enrollAdmin, registerAndEnrollUser } from "../utils/CAUtil";
const channelName = "mychannel";
const chaincodeName = "basic";
const mspOrg1 = "Org1MSP";
const walletPath = path.join(__dirname, "wallet");
const org1UserId = "appUser-test";

@provide(FabricService)
export class FabricService {
    public async test(): Promise<void> {
        const ccp = buildCCPOrg1();
        const caClient = buildCAClient(ccp, "ca.org1.example.com");
        const wallet = await buildWallet(walletPath);
        await enrollAdmin(caClient, wallet, mspOrg1);
        await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, "org1.department1");
        const gateway = new Gateway();
        const gatewayOpts: GatewayOptions = {
            wallet,
            identity: org1UserId,
            discovery: { enabled: true, asLocalhost: true },
        };
        await gateway.connect(ccp, gatewayOpts);
        const network = await gateway.getNetwork(channelName);
        const contract = network.getContract(chaincodeName);
        await contract.submitTransaction("InitLedger");
        let result = await contract.evaluateTransaction("GetAllAssets");
        console.log(result.toString());
        result = await contract.evaluateTransaction("ReadAsset", "asset13");
        console.log(prettyJSONString(result.toString()));
    }
}
