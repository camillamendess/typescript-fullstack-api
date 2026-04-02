import validator from "validator";

import { User } from "../../../../models/user";
import { badRequest, created, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { CreateUserParams, ICreateUserRepository } from "./protocols";

export class CreateUserController implements IController {
  constructor(private readonly createUserRepository: ICreateUserRepository) {}

  async handle(
    httpRequest: HttpRequest<CreateUserParams>,
  ): Promise<HttpResponse<User | string>> {
    try {
      const requiredFields = [
        "firstName",
        "lastName",
        "city",
        "country",
        "img",
      ];

      for (const field of requiredFields) {
        if (!httpRequest?.body?.[field as keyof CreateUserParams]?.length) {
          return badRequest(`Field ${field} is required`);
        }
      }
      const user = await this.createUserRepository.createUser(
        httpRequest.body!,
      );

      return created<User>(user);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
