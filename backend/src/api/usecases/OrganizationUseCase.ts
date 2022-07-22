import { provide } from "inversify-binding-decorators";
import { Status } from "../../storages/constants";
import { FabricService } from "../../services/FabricService";
import { AssetResponse } from "../responses/AssetResponse";
import { OrganizationService } from "src/services/OrganizationService";
import { OrganizationModel } from "src/models/OrganizationModel";

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

@provide(OrganizationUseCase)
export class OrganizationUseCase {
    constructor(private readonly organizationService: OrganizationService) {}

    public async getAllOrganizations(): Promise<OrganizationModel[]> {
        return this.organizationService.getAllOrganizations()
    }
}
