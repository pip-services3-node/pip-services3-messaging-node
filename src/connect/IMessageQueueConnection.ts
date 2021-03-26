/** @module connect */

/**
 * Defines an interface for message queue connections
 */
export interface IMessageQueueConnection {
    /**
     * Reads a list of registered queue names.
     * If connection doesn't support this function returnes an empty list.
     * @callback to receive a list with registered queue names or an error.
     */
    readQueueNames(callback: (err: any, names: string[]) => void): void;

    /**
     * Creates a message queue.
     * If connection doesn't support this function it exists without error.
     * @param name the name of the queue to be created.
     * @param callback notifies about completion with error or null for success.
     */
    createQueue(name: string, callback: (err: any) => void): void;

    /**
     * Deletes a message queue.
     * If connection doesn't support this function it exists without error.
     * @param name the name of the queue to be deleted.
     * @param callback notifies about completion with error or null for success.
     */
    deleteQueue(name: string, callback: (err: any) => void): void;
}