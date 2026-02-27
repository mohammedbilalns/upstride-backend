import { Container } from "inversify";
import { ICryptoService } from "../domain/service/crypto.service";
import { Argon2Service } from "../infrastructure/services/argon2.service";

const container = new Container();

container.bind(ICryptoService).to(Argon2Service);

export { container };
