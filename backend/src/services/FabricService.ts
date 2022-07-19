import { provide } from "inversify-binding-decorators";

import { Gateway, GatewayOptions } from "fabric-network";
import { buildCCPOrg1, buildWallet, prettyJSONString } from "../utils/AppUtil";
import { buildCAClient, enrollAdmin, registerAndEnrollUser } from "../utils/CAUtil";
import { FabricClient } from "src/Entities/Fabric/FabricClient";
import { FabricClientFactory } from "src/Entities/Fabric/FabricClientFactory";
import { Status } from "../Entities/constants";

type CreateAssetParams = {
    from: string;
    fromId: string;
    to: string;
    toId: string;
    dueDate: Date;
    amount: number;
    name: string;
    status: Status
}

@provide(FabricService)
export class FabricService {
    private fabricClient?: FabricClient;

    constructor() {
        FabricClientFactory.build().then((fabricClient) => {
            this.fabricClient = fabricClient
        })
    }

    public async createAsset(params: CreateAssetParams): Promise<any> {
        return this.fabricClient?.createAsset(params)
    }

    public async getAllTestAssets(): Promise<any[]> {
        const res = await  this.fabricClient?.getAllAssets()
        console.log(res)
        return res
    }
}
