import { AssetEntity } from "../storages/Fabric/AssetEntity";
import { Status } from "../storages/constants";

export class AssetModel {
    readonly id: string;
    readonly from: string;
    readonly fromId: string;
    readonly to: string;
    readonly toId: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly dueDate: Date;
    readonly amount: number;
    readonly name: string;
    readonly status: Status;

    constructor(props: {
        readonly id: string;
        readonly from: string;
        readonly fromId: string;
        readonly to: string;
        readonly toId: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly dueDate: Date;
        readonly amount: number;
        readonly name: string;
        readonly status: Status;
    }) {
        this.id = props.id;
        this.from = props.from;
        this.fromId = props.fromId;
        this.to = props.to;
        this.toId = props.toId;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.dueDate = props.dueDate;
        this.amount = props.amount;
        this.name = props.name;
        this.status = props.status;
    }

    public static fromEntity(entity: AssetEntity): AssetModel {
        return new AssetModel({
            id: entity.id,
            from: entity.from,
            fromId: entity.fromId,
            to: entity.to,
            toId: entity.toId,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            dueDate: entity.dueDate,
            amount: entity.amount,
            name: entity.name,
            status: entity.status,
        });
    }
}
