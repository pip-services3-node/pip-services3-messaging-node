"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallbackMessageReceiver = void 0;
/**
 * Wraps message callback into IMessageReceiver
 */
class CallbackMessageReceiver {
    /**
     * Creates an instance of the CallbackMessageReceiver.
     * @param callback a callback function that shall be wrapped into IMessageReceiver
     */
    constructor(callback) {
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
    receiveMessage(envelope, queue, callback) {
        this._callback(envelope, queue, callback);
    }
}
exports.CallbackMessageReceiver = CallbackMessageReceiver;
//# sourceMappingURL=CallbackMessageReceiver.js.map