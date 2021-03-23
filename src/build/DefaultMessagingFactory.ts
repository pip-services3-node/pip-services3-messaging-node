/** @module build */
import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { MemoryMessageQueue } from '../queues/MemoryMessageQueue';
import { MessageQueueFactory } from './MessageQueueFactory';

/**
 * Creates [[MemoryMessageQueue]] components by their descriptors.
 * Name of created message queue is taken from its descriptor.
 * 
 * @see [[https://pip-services3-node.github.io/pip-services3-components-node/classes/build.factory.html Factory]]
 * @see [[MemoryMessageQueue]]
 */
export class DefaultMessagingFactory extends Factory {
    private static readonly MemoryQueueDescriptor: Descriptor = new Descriptor("pip-services", "message-queue", "memory", "*", "1.0");
    private static readonly MemoryQueueFactoryDescriptor: Descriptor = new Descriptor("pip-services", "queue-factory", "memory", "*", "1.0");

    /**
	 * Create a new instance of the factory.
	 */
    public constructor() {
        super();
        this.register(DefaultMessagingFactory.MemoryQueueDescriptor, (locator: Descriptor) => {
            let name = (typeof locator.getName === "function") ? locator.getName() : null; 
            return new MemoryMessageQueue(name);
        });
        this.registerAsType(DefaultMessagingFactory.MemoryQueueFactoryDescriptor, MessageQueueFactory);
    }
}
