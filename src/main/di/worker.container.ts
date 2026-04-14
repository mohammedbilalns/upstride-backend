import { Container } from "inversify";
import { registerInfrastructureServiceBindings } from "./infrastructure-services.di";
import { registerQueueBindings } from "./queues.di";
import { registerRepositoryBindings } from "./repositories.di";

const workerContainer = new Container();

registerRepositoryBindings(workerContainer);
registerInfrastructureServiceBindings(workerContainer);
registerQueueBindings(workerContainer);

export { workerContainer };
