/** @module build */
import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';
/**
 * Creates [[MemoryMessageQueue]] components by their descriptors.
 * Name of created message queue is taken from its descriptor.
 *
 * @see [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/classes/build.factory.html Factory]]
 * @see [[MemoryMessageQueue]]
 */
export declare class DefaultMessagingFactory extends Factory {
    static readonly Descriptor: Descriptor;
    static readonly MemoryQueueDescriptor: Descriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
