type WSHandler = (payload: any) => void

class WSClient {
    private socket: WebSocket | null = null
    private listeners = new Map<string, WSHandler[]>()
    private queue: any[] = []
    private opened = false

    connect() {
        this.socket = new WebSocket('ws://localhost:8080')

        this.socket.onopen = () => {
            this.opened = true
            this.emit('open', null)

            for (const msg of this.queue) {
                this.socket!.send(JSON.stringify(msg))
            }

            this.queue = []
        }

        this.socket.onmessage = evt => {
            const msg = JSON.parse(evt.data)

            this.emit(msg.type, msg.payload)
        }

        this.socket.onclose = () => {
            this.opened = false

            setTimeout(() => this.connect(), 1000)
        }
    }

    send(payload: any) {
        if (this.opened) {
            this.socket!.send(JSON.stringify(payload))
        } else {
            this.queue.push(payload)
        }
    }

    on(type: string, handler: WSHandler) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, [])
        }

        this.listeners.get(type)!.push(handler)
    }

    private emit(type: string, payload: any) {
        const handlers = this.listeners.get(type)

        if (handlers) {
            for (const h of handlers) {
                h(payload)
            }
        }
    }
}

export const ws = new WSClient()
ws.connect()
