/** @module connect */
import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';

import { MemoryMessageQueue } from '../queues/MemoryMessageQueue';

/**
 * Defines an interface for message queue connections
 */
export interface IMessageQueueConnection {
    /**
     * Gets a list of registered queue names.
     * If connection doesn't support this function returnes an empty list.
     * @returns a list with registered queue names.
     */
    getQueueNames(): string[];
}