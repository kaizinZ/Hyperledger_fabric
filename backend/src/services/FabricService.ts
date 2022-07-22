/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { provide } from "inversify-binding-decorators";

import { Status } from "../storages/constants";
import { AssetModel } from "src/models/AssetModel";
import { FabricClient } from "../storages/Fabric/client/FabricClient";
import { FabricClientFactory } from "../storages/Fabric/client/FabricClientFactory";
import { FabricQuery } from "src/storages/Fabric/client/FabricQuery";

type CreateAssetParams = {
    from: string;
    fromId: string;
    to: string;
    toId: string;
    dueDate: Date;
    amount: number;
    name: string;
    status: Status;
};

@provide(FabricService)
export class FabricService {
    private fabricClient?: FabricClient;

    constructor() {
        FabricClientFactory.build().then((fabricClient) => {
            this.fabricClient = fabricClient;
        });
    }

    public async createAsset(params: CreateAssetParams): Promise<AssetModel> {
        return this.fabricClient!.createAsset(params);
    }

    public async getAssetsByName(name: string): Promise<AssetModel[]> {
        const query = FabricQuery.build().addQuery("name", name).getQuery();
        const entities = await this.fabricClient!.getAssetByQuery(query);
        return entities.map(AssetModel.fromEntity);
    }
}
