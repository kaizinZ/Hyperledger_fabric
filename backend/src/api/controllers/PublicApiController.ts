import { provide } from "inversify-binding-decorators";
import { Body, Controller, Get, Post, Query, Route } from "tsoa";
import { CreateAssetRequestBody, AssetUseCase } from "../usecases/AssetUseCase";
import { AssetResponse } from "../responses/AssetResponse";
import { OrganizationModel } from "../../models/OrganizationModel";
import { OrganizationUseCase } from "../usecases/OrganizationUseCase";

@provide(PublicApiController)
@Route("/api/v1")
export class PublicApiController extends Controller {
    constructor(private readonly assetUseCase: AssetUseCase, private readonly organizationUseCase: OrganizationUseCase) {
        super();
    }

    @Post("/assets")
    public async createAsset(@Body() body: CreateAssetRequestBody): Promise<AssetResponse> {
        return this.assetUseCase.createAsset(body);
    }

    @Get("/assets/name")
    public async getAssetsByName(@Query() name: string): Promise<AssetResponse[]> {
        return this.assetUseCase.getAssetsByName(name);
    }

    @Get("/organizations")
    public async getAllOrganizations(): Promise<OrganizationModel[]> {
        return this.organizationUseCase.getAllOrganizations()
    }
}
