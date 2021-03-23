/** @module queues */
import { IMessageQueue } from './IMessageQueue';
import { MessageEnvelope } from './MessageEnvelope';
import { IMessageReceiver } from './IMessageReceiver'

/**
 * Wraps message callback into IMessageReceiver
 */
export class CallbackMessageReceiver implements IMessageReceiver {
    private _callback: (envelope: MessageEnvelope, queue: IMessageQueue, callback: (err: any) => void) => void;

    /**
     * Creates an instance of the CallbackMessageReceiver.
     * @param callback a callback function that shall be wrapped into IMessageReceiver
     */
    public constructor(callback: (envelope: MessageEnvelope, queue: IMessageQueue, callback: (err: any) => void) => void) {
        if (callback == null) {
            throw new Error("Callback cannot be null");
        }

        this._callback = callback;
    }

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
    public receiveMessage(envelope: MessageEnvelope, queue: IMessageQueue, callback: (err: any) => void): void {
        this._callback(envelope, queue, callback);
    }
}