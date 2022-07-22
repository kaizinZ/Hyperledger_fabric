import { Status } from "../constants";

export type AssetEntity = {
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
};
