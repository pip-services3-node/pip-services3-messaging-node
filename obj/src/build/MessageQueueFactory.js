"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @module build */
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const MemoryMessageQueue_1 = require("../queues/MemoryMessageQueue");
/**
 * Creates [[MemoryMessageQueue]] components by their descriptors.
 * Name of created message queue is taken from its descriptor.
 *
 * @see [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/classes/build.factory.html Factory]]
 * @see [[MemoryMessageQueue]]
 */
class MessageQueueFactory extends pip_services3_components_node_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.register(MessageQueueFactory.MemoryQueueDescriptor, (locator) => {
            return new MemoryMessageQueue_1.MemoryMessageQueue(locator.getName());
        });
    }
}
MessageQueueFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "factory", "message-queue", "default", "1.0");
MessageQueueFactory.MemoryQueueDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "message-queue", "memory", "*", "1.0");
exports.MessageQueueFactory = MessageQueueFactory;
//# sourceMappingURL=MessageQueueFactory.js.map