import { Container } from "inversify";
import { registerInfrastructureServiceBindings } from "./di/infrastructure-services.di";
import { registerQueueBindings } from "./di/queues.di";

const workerContainer = new Container();

registerInfrastructureServiceBindings(workerContainer);
registerQueueBindings(workerContainer);

export { workerContainer };
