import { WebSocketServer } from 'ws'
import { randomUUID } from 'crypto'
import { registerConnection, removeConnection } from './connectionManager.js'
import { handleIncomingMessage, handleClientDisconnect } from './wsHandlers.js'

const wss = new WebSocketServer({ port: 8080 })

console.log('WS server running on ws://localhost:8080')

wss.on('connection', socket => {
    const clientId = randomUUID()

    socket._id = clientId

    registerConnection(clientId, socket)

    socket.on('message', raw => {
        try {
            const data = JSON.parse(raw)

            handleIncomingMessage(clientId, data)
        } catch (err) {
            console.error('WS message error:', err)
        }
    })

    socket.on('close', () => {
        removeConnection(clientId)
        handleClientDisconnect(clientId)
    })
})
