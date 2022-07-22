import { provide } from "inversify-binding-decorators";
import { Status } from "../../storages/constants";
import { FabricService } from "../../services/FabricService";
import { AssetResponse } from "../responses/AssetResponse";

export type CreateAssetRequestBody = {
    from: string;
    fromId: string;
    to: string;
    toId: string;
    dueDate: Date;
    amount: number;
    name: string;
    status: Status;
};

@provide(AssetUseCase)
export class AssetUseCase {
    constructor(private readonly fabricService: FabricService) {}

    public async createAsset(requestBody: CreateAssetRequestBody): Promise<AssetResponse> {
        return this.fabricService.createAsset(requestBody);
    }

    public async getAssetsByName(name: string): Promise<AssetResponse[]> {
        return this.fabricService.getAssetsByName(name);
    }
}
