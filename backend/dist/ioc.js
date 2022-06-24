"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iocContainer = exports.initializeIoCContainer = void 0;
/**
 * inversify.jsによってInversion of Control (DI; Dependency Injectionとしても知られる)を達成するためのコード
 */
const inversify_1 = require("inversify");
const inversify_binding_decorators_1 = require("inversify-binding-decorators");
const tsoa_1 = require("tsoa");
const iocContainer = new inversify_1.Container();
exports.iocContainer = iocContainer;
(0, inversify_1.decorate)((0, inversify_1.injectable)(), tsoa_1.Controller); // TSOA のコントローラに対して依存性を注入できるようにする。
// inversify に inversify-binding-decorators を読み込ませる。便利なデコレータが使えるようになる。
iocContainer.load((0, inversify_binding_decorators_1.buildProviderModule)());
const initializeIoCContainer = async () => {
    console.log("IoC Containerを初期化しています...");
    //  registerAllMySqlRepositoriesToIoCContainer(iocContainer);
    //  registerEventQueuesToIoCContainer(iocContainer);
    return iocContainer;
};
exports.initializeIoCContainer = initializeIoCContainer;
//# sourceMappingURL=ioc.js.map