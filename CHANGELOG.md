# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200"> <br/> Asynchronous Messaging for Pip.Services in Node.js Changelog

## <a name="3.3.0"></a> 3.3.0 (2021-04-09)

### Features
* **queues** Added CachedMessageQueue

## <a name="3.2.0"></a> 3.2.0 (2021-03-23)

### Features
* **queues** Added JSON serialization for MessageEnvelop
* **build** Added IMessageQueueFactory interface
* **test** Added TestMessageReceiver class to simplify testing of asynchronous messaging

## <a name="3.1.0"></a> 3.1.0 (2021-03-23)

Improved message queuues

### Features
* **queues** Added CallbackMessageReceiver to wrap callbacks into IMessageReceiver interface
* **queues** Addded IMessageConnection interface
* **build** Set config params and references to created queues in MessageQueueFactory
* **queues** Added checkOpen method to MessageQueue

## <a name="3.0.0"></a> 3.0.0 (2018-11-03)

Initial public release

### Features
* **build** - default factory
* **queues** - module for manage message queues

### Bug Fixes
No fixes in this version

