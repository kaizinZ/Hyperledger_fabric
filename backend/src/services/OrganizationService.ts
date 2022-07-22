/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { provide } from "inversify-binding-decorators";

import { Status } from "../storages/constants";
import { AssetModel } from "src/models/AssetModel";
import { FabricClient } from "../storages/Fabric/client/FabricClient";
import { FabricClientFactory } from "../storages/Fabric/client/FabricClientFactory";
import { FabricQuery } from "src/storages/Fabric/client/FabricQuery";
import { OrganizationRepository } from "../storages/mysql/OrganizationEntity";
import { OrganizationModel } from "../models/OrganizationModel";
import { buildCCPOrg, buildWallet, createWalletPath } from "src/utils/AppUtil";
import { buildCAClient, enrollAdmin } from "src/utils/CAUtil";
import { Gateway, GatewayOptions, Wallets } from "fabric-network";

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

@provide(OrganizationService)

export class OrganizationService {

    constructor(readonly  organizationRepository: OrganizationRepository) {
        
    }

    private async initalizeOrganizations(): Promise<void> {
        const entities = await this.organizationRepository.rawRepository.find()
        if (entities.length === 0) {
            for (let i = 0; i < 5; i++) {
                await this.organizationRepository.rawRepository.save({
                    domain: `org${i}.example.com`,
                    organizationNumber: i
                })
            }
        } 
    }


    public async getAllOrganizations(): Promise<OrganizationModel[]> {
        await this.initalizeOrganizations()
        const entities = await this.organizationRepository.rawRepository.find()
        return entities.map(OrganizationModel.fromEntity)
    }

    
}
