"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultMessagingFactory = void 0;
/** @module build */
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const MemoryMessageQueue_1 = require("../queues/MemoryMessageQueue");
const MessageQueueFactory_1 = require("./MessageQueueFactory");
/**
 * Creates [[MemoryMessageQueue]] components by their descriptors.
 * Name of created message queue is taken from its descriptor.
 *
 * @see [[https://pip-services3-node.github.io/pip-services3-components-node/classes/build.factory.html Factory]]
 * @see [[MemoryMessageQueue]]
 */
class DefaultMessagingFactory extends pip_services3_components_node_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.register(DefaultMessagingFactory.MemoryQueueDescriptor, (locator) => {
            let name = (typeof locator.getName === "function") ? locator.getName() : null;
            return new MemoryMessageQueue_1.MemoryMessageQueue(name);
        });
        this.registerAsType(DefaultMessagingFactory.MemoryQueueFactoryDescriptor, MessageQueueFactory_1.MessageQueueFactory);
    }
}
exports.DefaultMessagingFactory = DefaultMessagingFactory;
DefaultMessagingFactory.MemoryQueueDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "message-queue", "memory", "*", "1.0");
DefaultMessagingFactory.MemoryQueueFactoryDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "queue-factory", "memory", "*", "1.0");
//# sourceMappingURL=DefaultMessagingFactory.js.map