import { Container } from "inversify";
import {
	registerInfrastructureServiceBindings,
	registerQueueBindings,
} from "./di";

const workerContainer = new Container();

registerInfrastructureServiceBindings(workerContainer);
registerQueueBindings(workerContainer);

export { workerContainer };
