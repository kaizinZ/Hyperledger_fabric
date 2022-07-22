import { OnlyStringKeys } from "../../../utils/TypeUtil";
import { AssetEntity } from "../AssetEntity";

type KeyValuesQuery = Partial<Record<OnlyStringKeys<AssetEntity>, string>>;

export class FabricQuery {
    private keyValuesQuery: KeyValuesQuery = {};

    constructor(query: KeyValuesQuery = {}) {
        this.keyValuesQuery = query;
    }

    public static build(): FabricQuery {
        return new FabricQuery();
    }

    public addQuery(key: keyof KeyValuesQuery, value: string): FabricQuery {
        this.keyValuesQuery[key] = value;
        return this;
    }

    public getQuery(): string {
        return JSON.stringify(this.keyValuesQuery);
    }
}
