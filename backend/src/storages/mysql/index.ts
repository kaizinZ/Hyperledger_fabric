import { Container, interfaces } from "inversify";
import { BaseEntity, createConnection, getConnection } from "typeorm";
import { OrganizationEntity, OrganizationRepository } from "./OrganizationEntity";


export const ALL_ENTITIES = [
    OrganizationEntity
];

export function registerAllMySqlRepositoriesToIoCContainer(iocContainer: Container): void {
    const registerRepositoryToIoCContainer = <T>(customRepositoryClass: interfaces.Newable<T>) =>
        iocContainer
            .bind(customRepositoryClass)
            .toDynamicValue(() => getConnection().getCustomRepository(customRepositoryClass));
    registerRepositoryToIoCContainer(OrganizationRepository);
}

export const establishMySqlConnection = async (): Promise<void> => {
    console.log("DBへの接続を確立しています...")
    const conn = await createConnection({
        host: process.env.MYSQL_HOST,
        port:Number(process.env.MYSQL_PORT),
        username: process.env.MYSQL_USERNAME,
        database: process.env.MYSQL_DATABASE,
        type: "mysql",
        entities: ALL_ENTITIES,
        migrations: ["dist/mysql-migration/**/*.js"],
        migrationsRun: true,
        password: process.env.MYSQL_PASSWORD
    });
    console.log("DBへの接続が確立されました。");
    BaseEntity.useConnection(conn);
};
