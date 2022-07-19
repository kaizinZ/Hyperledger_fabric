import { provide } from "inversify-binding-decorators";
import { FabricService } from "../../services/FabricService";
import { Body, Controller, Get, Post, Query, Route } from "tsoa";
import { CreateAssetRequestBody, TestAssetUseCase } from "../usecases/TestAssetUseCase";
import { FabricClient } from "src/Entities/Fabric/FabricClient";
import { FabricClientFactory } from "src/Entities/Fabric/FabricClientFactory";

@provide(PublicApiController)
@Route("/api/v1")
export class PublicApiController extends Controller {
    constructor(private readonly testAssetUseCase: TestAssetUseCase, ) {
        super();
    }

    @Post("/test")
    public async test(@Body() body: CreateAssetRequestBody): Promise<any> {
        return this.testAssetUseCase.test(body)
    }

    @Get("/test-assets")
    public async getTestAssets(): Promise<any[]> {
        return this.testAssetUseCase.getAll()
    }

    @Get("/test-query")
    public async testQuery(): Promise<any> {
        return (await FabricClientFactory.build()).queryAsset()
    }
}
