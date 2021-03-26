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
     * Reads a list of registered queue names.
     * If connection doesn't support this function returnes an empty list.
     * @callback to receive a list with registered queue names or an error.
     */
    readQueueNames(callback: (err: any, queueNames: string[]) => void): void;
}