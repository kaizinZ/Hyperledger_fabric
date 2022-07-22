import { AssetModel } from "src/models/AssetModel";
import { Status } from "../../storages/constants";

export interface AssetResponse {
    id: string;
    from: string;
    fromId: string;
    to: string;
    toId: string;
    createdAt: Date;
    updatedAt: Date;
    dueDate: Date;
    amount: number;
    name: string;
    status: Status;
}

export namespace AssetResponse {
    export function fromModel(model: AssetModel): AssetResponse {
        return {
            id: model.id,
            from: model.from,
            fromId: model.fromId,
            to: model.to,
            toId: model.to,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
            dueDate: model.dueDate,
            amount: model.amount,
            name: model.name,
            status: model.status,
        };
    }
}
