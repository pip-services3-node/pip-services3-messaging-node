import { ICleanable } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { IMessageReceiver } from './IMessageReceiver';
import { MessageQueue } from './MessageQueue';
import { MessagingCapabilities } from './MessagingCapabilities';
import { MessageEnvelope } from './MessageEnvelope';
/**
 * Message queue that caches received messages in memory to allow peek operations
 * that may not be supported by the undelying queue.
 *
 * This queue is users as a base implementation for other queues
 */
export declare abstract class CachedMessageQueue extends MessageQueue implements ICleanable {
    protected _autoSubscribe: boolean;
    protected _messages: MessageEnvelope[];
    protected _receiver: IMessageReceiver;
    /**
     * Creates a new instance of the persistence component.
     *
     * @param name  (optional) a queue name
     * @param capabilities (optional) a capabilities of this message queue
     */
    constructor(name?: string, capabilities?: MessagingCapabilities);
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Opens the component.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    open(correlationId: string, callback?: (err: any) => void): void;
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    close(correlationId: string, callback?: (err: any) => void): void;
    /**
     * Subscribes to the message broker.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    protected abstract subscribe(correlationId: string, callback: (err: any) => void): void;
    /**
     * Unsubscribes from the message broker.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    protected abstract unsubscribe(correlationId: string, callback: (err: any) => void): void;
    /**
     * Clears component state.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    clear(correlationId: string, callback: (err?: any) => void): void;
    /**
     * Reads the current number of messages in the queue to be delivered.
     *
     * @param callback      callback function that receives number of messages or error.
     */
    readMessageCount(callback: (err: any, count: number) => void): void;
    /**
     * Peeks a single incoming message from the queue without removing it.
     * If there are no messages available in the queue it returns null.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param callback          callback function that receives a message or error.
     */
    peek(correlationId: string, callback: (err: any, result: MessageEnvelope) => void): void;
    /**
     * Peeks multiple incoming messages from the queue without removing them.
     * If there are no messages available in the queue it returns an empty list.
     *
     * Important: This method is not supported by MQTT.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param messageCount      a maximum number of messages to peek.
     * @param callback          callback function that receives a list with messages or error.
     */
    peekBatch(correlationId: string, messageCount: number, callback: (err: any, result: MessageEnvelope[]) => void): void;
    /**
     * Receives an incoming message and removes it from the queue.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param waitTimeout       a timeout in milliseconds to wait for a message to come.
     * @param callback          callback function that receives a message or error.
     */
    receive(correlationId: string, waitTimeout: number, callback: (err: any, result: MessageEnvelope) => void): void;
    protected sendMessageToReceiver(receiver: IMessageReceiver, message: MessageEnvelope): void;
    /**
    * Listens for incoming messages and blocks the current thread until queue is closed.
    *
    * @param correlationId     (optional) transaction id to trace execution through call chain.
    * @param receiver          a receiver to receive incoming messages.
    *
    * @see [[IMessageReceiver]]
    * @see [[receive]]
    */
    listen(correlationId: string, receiver: IMessageReceiver): void;
    /**
     * Ends listening for incoming messages.
     * When this method is call [[listen]] unblocks the thread and execution continues.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     */
    endListen(correlationId: string): void;
}
