import { Container } from "inversify";
import { registerInfrastructureServiceBindings } from "./infrastructure-services.di";
import { registerQueueBindings } from "./queues.di";

const workerContainer = new Container();

registerInfrastructureServiceBindings(workerContainer);
registerQueueBindings(workerContainer);

export { workerContainer };
