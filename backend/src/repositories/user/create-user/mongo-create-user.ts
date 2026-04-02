import {
  CreateUserParams,
  ICreateUserRepository,
} from "../../../routes/user/controllers/create-users/protocols";
import { MongoClient } from "../../../database/mongo";
import { User } from "../../../models/user";
import { MongoUser } from "../../mongo-protocols";

export class MongoCreateUserRepository implements ICreateUserRepository {
  async createUser(params: CreateUserParams): Promise<User> {
    // criando usuario
    const { insertedId } = await MongoClient.db
      .collection("users")
      .insertOne(params);

    // buscando o usuario
    const user = await MongoClient.db
      .collection<MongoUser>("users")
      .findOne({ _id: insertedId });

    // validando
    if (!user) {
      throw new Error("User not created");
    }

    const { _id, ...rest } = user;

    // caso criado, substituindo _id para id
    return { id: _id.toHexString(), ...rest };
  }
}
