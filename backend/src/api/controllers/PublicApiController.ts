import { provide } from "inversify-binding-decorators";
import { Controller, Get, Query, Route } from "tsoa";

@provide(PublicApiController)
@Route("/api/v1")
export class PublicApiController extends Controller {
    @Get("/test")
    public async test(@Query() text: string): Promise<string> {
        return text + " Hellow";
    }
}
