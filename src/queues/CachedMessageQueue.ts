/** @module queues */
/** @hidden */
const async = require('async');

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
export abstract class CachedMessageQueue extends MessageQueue implements ICleanable {
    protected _autoSubscribe: boolean;
    protected _messages: MessageEnvelope[] = [];
    protected _receiver: IMessageReceiver;

    /**
     * Creates a new instance of the persistence component.
     * 
     * @param name  (optional) a queue name
     * @param capabilities (optional) a capabilities of this message queue
     */
     public constructor(name?: string, capabilities?: MessagingCapabilities) {
        super(name, capabilities);
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        super.configure(config);

        this._autoSubscribe = config.getAsBooleanWithDefault("options.autosubscribe", this._autoSubscribe);
    }

    /**
	 * Opens the component.
	 * 
	 * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    public open(correlationId: string, callback?: (err: any) => void): void {
    	if (this.isOpen()) {
            callback(null);
            return;
        }

        if (this._autoSubscribe) {
            this.subscribe(correlationId, (err) => {
                if (err != null) {
                    this.close(correlationId, callback);
                    return;
                }

                this._logger.debug(correlationId, "Opened queue " + this.getName());
                if (callback) callback(null);
            });
        } else {
            if (callback) callback(null);
        }
    }

    /**
	 * Closes component and frees used resources.
	 * 
	 * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    public close(correlationId: string, callback?: (err: any) => void): void {
    	if (!this.isOpen()) {
            if (callback) callback(null);
            return;
        }

        // Unsubscribe from the broker
        this.unsubscribe(correlationId, (err) => {
            this._messages = [];
            this._receiver = null;

            if (callback) callback(err);
        });
    }

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
     public clear(correlationId: string, callback: (err?: any) => void): void {
        this._messages = [];
        callback();
    }

    /**
     * Reads the current number of messages in the queue to be delivered.
     * 
     * @param callback      callback function that receives number of messages or error.
     */
     public readMessageCount(callback: (err: any, count: number) => void): void {
        callback(null, this._messages.length);
    }

    /**
     * Peeks a single incoming message from the queue without removing it.
     * If there are no messages available in the queue it returns null.
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param callback          callback function that receives a message or error.
     */
     public peek(correlationId: string, callback: (err: any, result: MessageEnvelope) => void): void {
        let err = this.checkOpen(correlationId);
        if (err != null) {
            callback(err, null);
            return;
        }

        // Subscribe to topic if needed
        this.subscribe(correlationId, (err) => {
            if (err != null) {
                callback(err, null);
                return;
            } 

            // Peek a message from the top
            let message: MessageEnvelope = null;
            if (this._messages.length > 0) {
                message = this._messages[0];
            }
    
            if (message != null) {
                this._logger.trace(message.correlation_id, "Peeked message %s on %s", message, this.getName());
            }
    
            callback(null, message);
        });
    }

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
    public peekBatch(correlationId: string, messageCount: number, callback: (err: any, result: MessageEnvelope[]) => void): void {
        let err = this.checkOpen(correlationId);
        if (err != null) {
            callback(err, null);
            return;
        }

        // Subscribe to topic if needed
        this.subscribe(correlationId, (err) => {
            if (err != null) {
                callback(err, null);
                return;
            } 

            // Peek a batch of messages
            let messages = this._messages.slice(0, messageCount);

            this._logger.trace(correlationId, "Peeked %d messages on %s", messages.length, this.getName());
    
            callback(null, messages);
        });
    }

    /**
     * Receives an incoming message and removes it from the queue.
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param waitTimeout       a timeout in milliseconds to wait for a message to come.
     * @param callback          callback function that receives a message or error.
     */
    public receive(correlationId: string, waitTimeout: number, callback: (err: any, result: MessageEnvelope) => void): void {
        let err = this.checkOpen(correlationId);
        if (err != null) {
            callback(err, null);
            return;
        }

        // Subscribe to topic if needed
        this.subscribe(correlationId, (err) => {
            if (err != null) {
                callback(err, null);
                return;
            } 

            let message: MessageEnvelope = null;

            // Return message immediately if it exist
            if (this._messages.length > 0) {
                message = this._messages.shift();
                callback(null, message);
                return;
            }
    
            // Otherwise wait and return
            let checkInterval = 100;
            let elapsedTime = 0;
            async.whilst(
                (callback) => {
                    let test = this.isOpen() && elapsedTime < waitTimeout && message == null;
                    if (typeof callback === "function") {
                        callback(null, test);
                    } else {
                        return test;
                    }
                },
                (whilstCallback) => {
                    elapsedTime += checkInterval;
    
                    setTimeout(() => {
                        message = this._messages.shift();
                        whilstCallback();
                    }, checkInterval);
                },
                (err) => {
                    callback(err, message);
                }
            );
        });
    }

    protected sendMessageToReceiver(receiver: IMessageReceiver, message: MessageEnvelope): void {
        let correlationId = message != null ? message.correlation_id : null;
        if (message == null || receiver == null) {
            this._logger.warn(correlationId, "Message was skipped.");
            return;
        }

        try {
            this._receiver.receiveMessage(message, this, (err) => {
                if (err != null) {
                    this._logger.error(correlationId, err, "Failed to process the message");
                }
            });
        } catch (err) {
            this._logger.error(correlationId, err, "Failed to process the message");
        }
    }

     /**
     * Listens for incoming messages and blocks the current thread until queue is closed.
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param receiver          a receiver to receive incoming messages.
     * 
     * @see [[IMessageReceiver]]
     * @see [[receive]]
     */
      public listen(correlationId: string, receiver: IMessageReceiver): void {
        let err = this.checkOpen(correlationId);
        if (err != null) {
            return;
        }

        // Subscribe to topic if needed
        this.subscribe(correlationId, (err) => {
            if (err != null) {
                return;
            } 

            this._logger.trace(null, "Started listening messages at %s", this.getName());

            // Resend collected messages to receiver
            async.whilst(
                (callback) => {
                    let test = this.isOpen() && this._messages.length > 0;
                    if (typeof callback === "function") {
                        callback(null, test);
                    } else {
                        return test;
                    }
                },
                (whilstCallback) => {
                    let message = this._messages.shift();
                    if (message != null) {
                        this.sendMessageToReceiver(receiver, message);
                    }
                    whilstCallback();
                },
                (err) => {
                    // Set the receiver
                    if (this.isOpen()) {
                        this._receiver = receiver;
                    }
                }
            );
        });
    }

    /**
     * Ends listening for incoming messages.
     * When this method is call [[listen]] unblocks the thread and execution continues.
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     */
    public endListen(correlationId: string): void {
        this._receiver = null;
    }   
}