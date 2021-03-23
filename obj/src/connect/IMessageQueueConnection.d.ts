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
