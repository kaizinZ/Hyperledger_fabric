import { EncryptionOptions } from "typeorm-encrypted/src/options/index";

export const encryptionOptions: EncryptionOptions = {
    key: process.env.RDB_ENCRYPTION_KEY as string, 
    algorithm: "aes-256-cbc",
    ivLength: 16,
    iv: "b632c7d3bf049b720766564ec0af52b4",
};
