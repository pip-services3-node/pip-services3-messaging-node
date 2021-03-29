"use strict";
/** @module test */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestMessageReceiver = void 0;
class TestMessageReceiver {
    constructor() {
        this._messages = [];
    }
    /**
     * Gets the list of received messages.
     */
    get messages() {
        return this._messages;
    }
    /**
     * Gets the received message count.
     */
    get messageCount() {
        return this._messages.length;
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
        this._messages.push(envelope);
    }
    /**
     * Clears all received messagers.
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param callback callback function that receives error or null for success.
     */
    clear(correlationId, callback) {
        this._messages = [];
        if (callback)
            callback(null);
    }
}
exports.TestMessageReceiver = TestMessageReceiver;
//# sourceMappingURL=TestMessageReceiver.js.map