import { provide } from "inversify-binding-decorators";
import { buildCAClient, enrollAdmin, registerAndEnrollUser } from "../../utils/CAUtil";
import { buildCCPOrg1, buildWallet } from "../../utils/AppUtil";
import { Contract, Gateway, GatewayOptions } from "fabric-network";
import { stringify, v4 as uuid } from "uuid";
import { Status } from "../constants";

type CreateAssetArgs= {
    from: string;
    fromId: string;
    to: string;
    toId: string;
    dueDate: Date;
    amount: number;
    name: string;
    status: Status
}

export class FabricClient {
    private contract: Contract

    constructor(contract: Contract) {
        this.contract = contract;
    }

    public async getAllAssets(): Promise<any> {
        const res = await this.contract.evaluateTransaction('QueryAssets', '{"selector":{"from":"Tanaka"}}');
        const parsed = JSON.parse(res.toString())
        console.log(parsed)
        return parsed
    }


    public async createAsset(args: CreateAssetArgs): Promise<any> {
        const stringfiedArgs = Object.values(args).map((arg) => arg.toString()).reverse()
        console.log(...stringfiedArgs)
        const id = uuid()
        await this.contract.submitTransaction("CreateAsset", id, args.from, args.fromId, args.to, args.toId, args.dueDate.toISOString(), args.amount.toString(), args.name.toString(), args.status)
        return this.getAsset(id)
    }

    public async getAsset(id: string): Promise<any> {
        const result = await this.contract.evaluateTransaction("ReadAsset", id)
        return JSON.parse(result.toString())
    }

    public async updateAsset(id: string, ...properties: any[]): Promise<void> {
        await this.contract.submitTransaction("UpdateAsset", id, ...properties, "", "", "")
    }

    public async transferAsset(assetId: string, userId: string): Promise<void> {
        await this.contract.submitTransaction("TransferAsset", assetId, userId)
    }

    public async queryAsset(): Promise<any> {
        const response = await this.contract.evaluateTransaction('QueryAssets', "{\"selector\":{\"docType\":\"asset\"}}")
        return JSON.parse(response.toString())
    }
}