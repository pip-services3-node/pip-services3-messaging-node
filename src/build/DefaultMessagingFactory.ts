/** @module build */
import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { MemoryMessageQueue } from '../queues/MemoryMessageQueue';

/**
 * Creates [[MemoryMessageQueue]] components by their descriptors.
 * Name of created message queue is taken from its descriptor.
 * 
 * @see [[https://pip-services3-node.github.io/pip-services3-components-node/classes/build.factory.html Factory]]
 * @see [[MemoryMessageQueue]]
 */
export class DefaultMessagingFactory extends Factory {
	public static readonly Descriptor: Descriptor = new Descriptor("pip-services", "factory", "messaging", "default", "1.0");
    public static readonly MemoryQueueDescriptor: Descriptor = new Descriptor("pip-services", "message-queue", "memory", "*", "1.0");

    /**
	 * Create a new instance of the factory.
	 */
    public constructor() {
        super();
        this.register(DefaultMessagingFactory.MemoryQueueDescriptor, (locator: Descriptor) => {
            return new MemoryMessageQueue(locator.getName());
        });
    }
}
