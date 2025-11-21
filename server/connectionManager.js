export const clients = new Map()

export const registerConnection = (clientId, socket) => {
    clients.set(clientId, socket)
}

export const removeConnection = clientId => {
    clients.delete(clientId)
}

export const sendToClientId = (clientId, message) => {
    const socket = clients.get(clientId)
    if (socket && socket.readyState === 1) {
        socket.send(JSON.stringify(message))
    }
}

export const broadcastToAll = message => {
    for (const socket of clients.values()) {
        if (socket.readyState === 1) {
            socket.send(JSON.stringify(message))
        }
    }
}
