/** @module test */
import { ICleanable } from 'pip-services3-commons-node';
import { IMessageReceiver } from '../queues/IMessageReceiver';
import { IMessageQueue } from '../queues/IMessageQueue';
import { MessageEnvelope } from '../queues/MessageEnvelope';
export declare class TestMessageReceiver implements IMessageReceiver, ICleanable {
    private _messages;
    constructor();
    /**
     * Gets the list of received messages.
     */
    get messages(): MessageEnvelope[];
    /**
     * Gets the received message count.
     */
    get messageCount(): number;
    /**
     * Receives incoming message from the queue.
     *
     * @param envelope  an incoming message
     * @param queue     a queue where the message comes from
     * @param callback  callback function that receives error or null for success.
     *
     * @see [[MessageEnvelope]]
     * @see [[IMessageQueue]]
     */
    receiveMessage(envelope: MessageEnvelope, queue: IMessageQueue, callback: (err: any) => void): void;
    /**
     * Clears all received messagers.
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param callback callback function that receives error or null for success.
     */
    clear(correlationId: string, callback?: (err: any) => void): void;
}
