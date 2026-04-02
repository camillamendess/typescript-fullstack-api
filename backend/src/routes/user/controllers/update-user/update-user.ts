import { User } from "../../../../models/user";
import { badRequest, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { IUpdateUserRepository, UpdateUserParams } from "./protocols";

export class UpdateUserController implements IController {
  constructor(private readonly updateUserRepository: IUpdateUserRepository) {}

  async handle(
    httpRequest: HttpRequest<UpdateUserParams>,
  ): Promise<HttpResponse<User | string>> {
    try {
      const id = httpRequest?.params?.id;
      const body = httpRequest?.body;

      if (!body) {
        return badRequest("Missing fields.");
      }

      if (!id) {
        return badRequest("Missing user id");
      }

      const allowedFieldsToUpdate: (keyof UpdateUserParams)[] = [
        "firstName",
        "lastName",
        "password",
        "city",
        "country",
        "img",
      ];

      const receivedFields = Object.keys(body);
      const disallowedFields = receivedFields.filter(
        (key) => !allowedFieldsToUpdate.includes(key as keyof UpdateUserParams),
      );

      if (disallowedFields.length > 0) {
        return badRequest(
          `Fields not allowed to update: ${disallowedFields.join(", ")}`,
        );
      }

      const user = await this.updateUserRepository.updateUser(id, body);

      if (!user) {
        return badRequest("User not found or not updated");
      }

      return ok<User>(user);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
