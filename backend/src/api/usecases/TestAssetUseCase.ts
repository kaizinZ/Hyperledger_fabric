import { provide } from "inversify-binding-decorators";
import { Status } from "../..//Entities/constants";
import { FabricService } from "../..//services/FabricService";

export type CreateAssetRequestBody = {
    from: string;
    fromId: string;
    to: string;
    toId: string;
    dueDate: Date;
    amount: number;
    name: string;
    status: Status
}

@provide(TestAssetUseCase)
export class TestAssetUseCase {
    constructor(private readonly fabricService: FabricService){}

    public async test(requestBody: CreateAssetRequestBody): Promise<any> {
        return this.fabricService.createAsset(requestBody)
    }

    public async getAll(): Promise<any[]> {
        return this.fabricService.getAllTestAssets()
    }
}