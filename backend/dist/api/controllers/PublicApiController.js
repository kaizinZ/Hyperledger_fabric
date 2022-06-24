"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PublicApiController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicApiController = void 0;
const inversify_binding_decorators_1 = require("inversify-binding-decorators");
const tsoa_1 = require("tsoa");
let PublicApiController = PublicApiController_1 = class PublicApiController extends tsoa_1.Controller {
    async test(text) {
        return text + " Hellow";
    }
};
__decorate([
    (0, tsoa_1.Get)("/test"),
    __param(0, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicApiController.prototype, "test", null);
PublicApiController = PublicApiController_1 = __decorate([
    (0, inversify_binding_decorators_1.provide)(PublicApiController_1),
    (0, tsoa_1.Route)("/api/v1")
], PublicApiController);
exports.PublicApiController = PublicApiController;
//# sourceMappingURL=PublicApiController.js.map