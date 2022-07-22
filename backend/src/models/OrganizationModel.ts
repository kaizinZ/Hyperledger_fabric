import { OrganizationEntity } from "../storages/mysql/OrganizationEntity";

export class OrganizationModel {
    readonly organizationId: string;
    readonly domain: string
    readonly organizationNumber: number


    constructor(props: {
        readonly organizationId: string
        readonly domain: string
        readonly organizationNumber: number

    }) {
        this.organizationId = props.organizationId
        this.domain = props.domain
        this.organizationNumber = props.organizationNumber
    }

    public static fromEntity(entity: OrganizationEntity): OrganizationModel {
        return new OrganizationModel({
            organizationId: entity.organizationId,
            domain: entity.domain,
            organizationNumber: entity.organizationNumber
        })
    }
}