export class WebsocketCommunicator {
    constructor() {
        this.websocketConnectionString = "";
        this.socket = null;
        this.subscribedReceivers = [];
    }
    connect() {
        return new Promise((success, fail) => {
            let websocketProtocol = window.location.protocol == "https:" ? "wss:" : "ws:"
            let websocketPort = window.location.port != "" ? `:${window.location.port}` : ""
            this.websocketConnectionString = `${websocketProtocol}//${window.location.hostname}${websocketPort}/ws`
            this.socket = new WebSocket(this.websocketConnectionString)

            this.socket.onmessage = (event) => {
                this.handleServerMessage(event.data)
            }

            this.socket.onerror = (event) => {
                this.isConnected = false
                fail()
            }

            this.socket.onopen = (event) => {
                this.isConnected = true
                success(this.socket)
            }

            this.socket.onclose = (event) => {
                this.isConnected = false
                this.handleClose()
            }
        })

    }

    subscribe(websocketReceiver) {
        this.subscribedReceivers.push(websocketReceiver)
    }

    unsubscribe(websocketReceiver) {
        this.subscribedReceivers.splice(this.subscribedReceivers.indexOf(websocketReceiver), 1)
    }

    send(data) {
        var sendData = data;
        if (typeof data == "object") {
            sendData = JSON.stringify(data);
        }
        this.sendRaw(sendData)
    }

    sendRaw(data) {
        if (!this.isConnected || this.socket == null) {
            console.warn("trying to send message before socket is connected")
            return;
        }
        this.socket.send(data)
    }

    disconnect() {
        if (this.socket == null) {
            return;
        }
        this.socket.close();
        this.socket = null;
    }

    handleServerMessage(socketMessage) {
        for (let i = 0; i < this.subscribedReceivers.length; i++) {
            this.subscribedReceivers[i].handleMessage(socketMessage)
        }
    }

    handleClose() {
        for (let i = 0; i < this.subscribedReceivers.length; i++) {
            this.subscribedReceivers[i].handleClose()
        }
    }
}