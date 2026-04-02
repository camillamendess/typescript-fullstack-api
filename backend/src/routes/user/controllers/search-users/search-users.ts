import { User } from "../../../../models/user";
import { badRequest, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { ISearchUsersRepository } from "./protocols";

export class SearchUsersController implements IController {
  constructor(private readonly searchUsersRepository: ISearchUsersRepository) {}

  async handle(
    httpRequest: HttpRequest<any>,
  ): Promise<HttpResponse<User[] | string>> {
    try {
      const name = httpRequest.query?.name;

      if (!name || typeof name !== "string" || !name.trim()) {
        return badRequest("Query param 'name' is required");
      }

      const users = await this.searchUsersRepository.searchUsers(name);

      return ok<User[]>(users);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
