import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    EntityRepository,
    Repository,
    AbstractRepository,
    JoinColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { JsonEncryptionTransformer } from "./encription/JsonEncriptionTransformer";
import { EncryptionTransformer } from "typeorm-encrypted";
import { encryptionOptions } from "./encription/encriptionOptions";
import { interfaces } from "inversify";

@Entity({ name: "organization" })
export class OrganizationEntity {
    @PrimaryGeneratedColumn("uuid", { name: "organizationId" })
    organizationId!: string;

    @Column({name: "domain", type: "varchar"})
    domain!: string;

    @Column({name: "organizationNumber", type: "int"})
    organizationNumber!: number
}

@EntityRepository(OrganizationEntity)
export class OrganizationRepository extends AbstractRepository<OrganizationEntity> {
    get rawRepository(): Repository<OrganizationEntity> {
        return this.repository;
    }
}
