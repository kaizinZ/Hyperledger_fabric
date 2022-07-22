import { FindOperator, ValueTransformer } from "typeorm";
import { EncryptionTransformer } from "typeorm-encrypted";

export class JsonEncryptionTransformer<T> implements ValueTransformer {
    private encryptionTransformer: EncryptionTransformer;

    constructor(encryptionTransformer: EncryptionTransformer) {
        this.encryptionTransformer = encryptionTransformer;
    }

    public to(value: T | null) {
        if (value === null) {
            return;
        } else if (typeof value === "string") {
            throw new TypeError("引数にobject(json)が来るべきですがstringが渡されました: " + value);
        } else if (value instanceof FindOperator) {
            throw new TypeError("引数にobject(json)が来るべきですがFindOperator instanceが渡されました: " + value);
        } else {
            // valueの方がTの時
            const serializedJson = JSON.stringify(value);
            return this.encryptionTransformer.to(serializedJson);
        }
    }

    public from(value: string | null) {
        const transformedValue = this.encryptionTransformer.from(value);
        if (transformedValue === undefined) {
            return;
        }
        return JSON.parse(transformedValue);
    }
}
