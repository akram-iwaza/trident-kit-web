import { EventEmitter } from 'events';

class StatusEmitter extends EventEmitter {}

const statusEmitter = new StatusEmitter();

export default statusEmitter;
