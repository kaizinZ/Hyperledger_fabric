/**
 * inversify.jsによってInversion of Control (DI; Dependency Injectionとしても知られる)を達成するためのコード
 */
import { Container, decorate, injectable } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { Controller } from "tsoa";

const iocContainer = new Container();
decorate(injectable(), Controller); // TSOA のコントローラに対して依存性を注入できるようにする。

// inversify に inversify-binding-decorators を読み込ませる。便利なデコレータが使えるようになる。
iocContainer.load(buildProviderModule());
export const initializeIoCContainer = async (): Promise<Container> => {
    console.log("IoC Containerを初期化しています...");

    //  registerAllMySqlRepositoriesToIoCContainer(iocContainer);
    //  registerEventQueuesToIoCContainer(iocContainer);

    return iocContainer;
};

export { iocContainer };
