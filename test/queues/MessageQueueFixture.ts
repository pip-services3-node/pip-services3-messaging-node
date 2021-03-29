const assert = require('chai').assert;
const async = require('async');

import { IMessageQueue } from '../../src/queues/IMessageQueue';
import { MessageEnvelope } from '../../src/queues/MessageEnvelope';
import { RandomString, IdGenerator } from 'pip-services3-commons-node';
import { TestMessageReceiver } from '../../src/test/TestMessageReceiver';

export class MessageQueueFixture {
    private _queue: IMessageQueue;

    public constructor(queue: IMessageQueue) {
        this._queue = queue;
    }

    public testSendReceiveMessage(done) {
        let envelope1: MessageEnvelope = new MessageEnvelope("123", "Test", "Test message");
        let envelope2: MessageEnvelope;

        async.series([
            (callback) => {
                this._queue.send(null, envelope1, callback);
            },
            // (callback) => {
            //     var count = this._queue.readMessageCount((err, count) => {
            //         assert.isTrue(count > 0);
            //         callback(err);
            //     });
            // },
            (callback) => {
                this._queue.receive(null, 10000, (err, result) => {
                    envelope2 = result;

                    assert.isNotNull(envelope2);
                    assert.equal(envelope1.message_type, envelope2.message_type);
                    assert.equal(envelope1.message, envelope2.message);
                    assert.equal(envelope1.correlation_id, envelope2.correlation_id);

                    callback(err);
                });
            }
        ], done);
    }

    public testReceiveSendMessage(done) {
        let envelope1: MessageEnvelope = new MessageEnvelope("123", "Test", "Test message");
        let envelope2: MessageEnvelope;

        setTimeout(() => {
            this._queue.send(null, envelope1, () => { });
        }, 500);

        this._queue.receive(null, 10000, (err, result) => {
            envelope2 = result;

            assert.isNotNull(envelope2);
            assert.equal(envelope1.message_type, envelope2.message_type);
            assert.equal(envelope1.message, envelope2.message);
            assert.equal(envelope1.correlation_id, envelope2.correlation_id);

            done(err);
        });
    }

    public testReceiveCompleteMessage(done) {
        let envelope1: MessageEnvelope = new MessageEnvelope("123", "Test", "Test message");
        let envelope2: MessageEnvelope;

        async.series([
            (callback) => {
                this._queue.send(null, envelope1, callback);
            },
            (callback) => {
                var count = this._queue.readMessageCount((err, count) => {
                    assert.isTrue(count > 0);
                    callback(err);
                });
            },
            (callback) => {
                this._queue.receive(null, 10000, (err, result) => {
                    envelope2 = result;

                    assert.isNotNull(envelope2);
                    assert.equal(envelope1.message_type, envelope2.message_type);
                    assert.equal(envelope1.message, envelope2.message);
                    assert.equal(envelope1.correlation_id, envelope2.correlation_id);

                    callback(err);
                });
            },
            (callback) => {
                this._queue.complete(envelope2, (err) => {
                    assert.isNull(envelope2.getReference());
                    callback(err);
                });
            }
        ], done);
    }

    public testReceiveAbandonMessage(done) {
        let envelope1: MessageEnvelope = new MessageEnvelope("123", "Test", "Test message");
        let envelope2: MessageEnvelope;

        async.series([
            (callback) => {
                this._queue.send(null, envelope1, callback);
            },
            (callback) => {
                this._queue.receive(null, 10000, (err, result) => {
                    envelope2 = result;

                    assert.isNotNull(envelope2);
                    assert.equal(envelope1.message_type, envelope2.message_type);
                    assert.equal(envelope1.message, envelope2.message);
                    assert.equal(envelope1.correlation_id, envelope2.correlation_id);

                    callback(err);
                });
            },
            (callback) => {
                this._queue.abandon(envelope2, (err) => {
                    callback(err);
                });
            },
            (callback) => {
                this._queue.receive(null, 10000, (err, result) => {
                    envelope2 = result;

                    assert.isNotNull(envelope2);
                    assert.equal(envelope1.message_type, envelope2.message_type);
                    assert.equal(envelope1.message, envelope2.message);
                    assert.equal(envelope1.correlation_id, envelope2.correlation_id);

                    callback(err);
                });
            }
        ], done);
    }

    public testSendPeekMessage(done) {
        let envelope1: MessageEnvelope = new MessageEnvelope("123", "Test", "Test message");
        let envelope2: MessageEnvelope;

        async.series([
            (callback) => {
                this._queue.send(null, envelope1, callback);
            },
            (callback) => {
                this._queue.peek(null, (err, result) => {
                    envelope2 = result;

                    assert.isNotNull(envelope2);
                    assert.equal(envelope1.message_type, envelope2.message_type);
                    assert.equal(envelope1.message, envelope2.message);
                    assert.equal(envelope1.correlation_id, envelope2.correlation_id);

                    callback(err);
                });
            }
        ], done);
    }

    public testPeekNoMessage(done) {
        this._queue.peek(null, (err, result) => {
            assert.isNull(result);
            done();
        });
    }

    public testMoveToDeadMessage(done) {
        let envelope1: MessageEnvelope = new MessageEnvelope("123", "Test", "Test message");
        let envelope2: MessageEnvelope;

        async.series([
            (callback) => {
                this._queue.send(null, envelope1, callback);
            },
            (callback) => {
                this._queue.receive(null, 10000, (err, result) => {
                    envelope2 = result;

                    assert.isNotNull(envelope2);
                    assert.equal(envelope1.message_type, envelope2.message_type);
                    assert.equal(envelope1.message, envelope2.message);
                    assert.equal(envelope1.correlation_id, envelope2.correlation_id);

                    callback(err);
                });
            },
            (callback) => {
                this._queue.moveToDeadLetter(envelope2, callback);
            }
        ], done);
    }

    public testOnMessage(done) {
        let envelope1: MessageEnvelope = new MessageEnvelope("123", "Test", "Test message");
        let envelope2: MessageEnvelope = null;

        this._queue.beginListen(null, {
            receiveMessage: (envelop: MessageEnvelope, queue: IMessageQueue, callback: (err: any) => void): void => {
                envelope2 = envelop;
                callback(null);
            }
        });

        async.series([
            (callback) => {
                setTimeout(() => {
                    callback();
                }, 1000);
            },
            (callback) => {
                this._queue.send(null, envelope1, callback);
            },
            (callback) => {
                setTimeout(() => {
                    callback();
                }, 1000);
            },
            (callback) => {
                assert.isNotNull(envelope2);
                assert.equal(envelope1.message_type, envelope2.message_type);
                assert.equal(envelope1.message, envelope2.message);
                assert.equal(envelope1.correlation_id, envelope2.correlation_id);

                callback();
            }
        ], (err) => {
            this._queue.endListen(null);
            done();
        });
    }

    public testSendAsObject(done) {
        let messageReceiver = new TestMessageReceiver();
        let testObj = {
            id: IdGenerator.nextLong(),
            name: RandomString.nextString(20, 50)
        };

        this._queue.beginListen(null, messageReceiver);

        async.series([
            (callback) => {
                setTimeout(() => {
                    callback();
                }, 1000);
            },
            //  send array of strings 
            (callback) => {
                this._queue.sendAsObject('123', 'messagetype', ['string1', 'string2'], callback);
            },
            (callback) => {
                setTimeout(() => {
                    callback();
                }, 1000);
            },
            (callback) => {
                assert.equal(1, messageReceiver.messageCount);

                let envelope = messageReceiver.messages[0];
                assert.isNotNull(envelope);
                assert.equal('messagetype', envelope.message_type);
                assert.equal('123', envelope.correlation_id);

                let message = envelope.getMessageAsJson() as string[];
                assert.isArray(message);
                assert.includeMembers(message, ['string1', 'string2']);

                callback();
            },
            // send string
            (callback) => {
                messageReceiver.clear(null);
                this._queue.sendAsObject('123', 'messagetype', 'string2', callback);
            },
            (callback) => {
                setTimeout(() => {
                    callback();
                }, 1000);
            },
            (callback) => {
                assert.equal(1, messageReceiver.messageCount);

                let envelope = messageReceiver.messages[0];
                assert.isNotNull(envelope);
                assert.equal('messagetype', envelope.message_type);
                assert.equal('123', envelope.correlation_id);

                let message = envelope.getMessageAsString();
                assert.equal('string2', message);
                callback();
            },
            // send object
            (callback) => {
                messageReceiver.clear(null);
                this._queue.sendAsObject('123', 'messagetype', testObj, callback);
            },
            (callback) => {
                setTimeout(() => {
                    callback();
                }, 1000);
            },
            (callback) => {
                assert.equal(1, messageReceiver.messageCount);

                let envelope = messageReceiver.messages[0];
                assert.isNotNull(envelope);
                assert.equal('messagetype', envelope.message_type);
                assert.equal('123', envelope.correlation_id);

                var message = envelope.getMessageAsJson();
                assert.isNotNull(message);
                assert.equal(testObj.id, message.id);
                assert.equal(testObj.name, message.name);

                callback();
            },
        ], (err) => {
            this._queue.endListen(null);
            done();
        });
    }

}
