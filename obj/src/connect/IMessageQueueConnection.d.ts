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
