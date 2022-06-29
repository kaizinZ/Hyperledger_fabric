import { provide } from "inversify-binding-decorators";
import { FabricService } from "../../services/FabricService";
import { Controller, Get, Query, Route } from "tsoa";

@provide(PublicApiController)
@Route("/api/v1")
export class PublicApiController extends Controller {
    constructor(private readonly fabricService: FabricService) {
        super();
    }
    @Get("/test")
    public async test(@Query() text: string): Promise<string> {
        await this.fabricService.test();
        return text + " Hellow";
    }
}
