import { Contract } from "fabric-network";
import { v4 as uuid } from "uuid";
import { Status } from "../../constants";
import { AssetEntity } from "../AssetEntity";

type CreateAssetArgs = {
    from: string;
    fromId: string;
    to: string;
    toId: string;
    dueDate: Date;
    amount: number;
    name: string;
    status: Status;
};

export class FabricClient {
    private contract: Contract;

    constructor(contract: Contract) {
        this.contract = contract;
    }

    public async getAllAssets(query: string): Promise<AssetEntity[]> {
        const res = await this.contract.evaluateTransaction("QueryAssets", `{"selector":${query}}`);
        const parsed = JSON.parse(res.toString());
        return parsed;
    }

    public async createAsset(args: CreateAssetArgs): Promise<AssetEntity> {
        const id = uuid();
        await this.contract.submitTransaction(
            "CreateAsset",
            id,
            args.from,
            args.fromId,
            args.to,
            args.toId,
            args.dueDate.toISOString(),
            args.amount.toString(),
            args.name.toString(),
            args.status,
            new Date().toISOString(),
            new Date().toISOString()
        );
        return this.getAsset(id);
    }

    public async getAsset(id: string): Promise<AssetEntity> {
        const result = await this.contract.evaluateTransaction("ReadAsset", id);
        const parsed = JSON.parse(result.toString()) as AssetEntity
        return {...parsed, dueDate: new Date(parsed.dueDate), createdAt: new Date(parsed.createdAt), updatedAt: new Date(parsed.updatedAt)};
    }

    // public async updateAsset(id: string, ...properties: any[]): Promise<void> {
    //     await this.contract.submitTransaction("UpdateAsset", id, ...properties, "", "", "");
    // }

    public async transferAsset(assetId: string, userId: string): Promise<void> {
        await this.contract.submitTransaction("TransferAsset", assetId, userId);
    }

    public async getAssetByQuery(query: string): Promise<AssetEntity[]> {
        const response = await this.contract.evaluateTransaction("QueryAssets", `{"selector":${query}}`);
        const entities = JSON.parse(response.toString()) as AssetEntity[]
        return entities.map((entity) => ({...entity, dueDate: new Date(entity.dueDate), createdAt: new Date(entity.createdAt), updatedAt: new Date(entity.updatedAt)}));
    }
}
