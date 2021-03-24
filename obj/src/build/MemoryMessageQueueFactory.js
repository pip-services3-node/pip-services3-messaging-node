"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryMessageQueueFactory = void 0;
/** @module build */
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const MemoryMessageQueue_1 = require("../queues/MemoryMessageQueue");
/**
 * Creates [[MemoryMessageQueue]] components by their descriptors.
 * Name of created message queue is taken from its descriptor.
 *
 * @see [[https://pip-services3-node.github.io/pip-services3-components-node/classes/build.factory.html Factory]]
 * @see [[MemoryMessageQueue]]
 */
class MemoryMessageQueueFactory extends pip_services3_components_node_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.register(MemoryMessageQueueFactory.MemoryQueueDescriptor, (locator) => {
            let name = (typeof locator.getName === "function") ? locator.getName() : null;
            let queue = new MemoryMessageQueue_1.MemoryMessageQueue(name);
            if (this._config != null) {
                queue.configure(this._config);
            }
            if (this._references != null) {
                queue.setReferences(this._references);
            }
            return queue;
        });
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._config = config;
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._references = references;
    }
}
exports.MemoryMessageQueueFactory = MemoryMessageQueueFactory;
MemoryMessageQueueFactory.MemoryQueueDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "message-queue", "memory", "*", "1.0");
//# sourceMappingURL=MemoryMessageQueueFactory.js.map