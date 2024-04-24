import { ref, type Ref } from 'vue'
import { io, Socket } from 'socket.io-client'

export interface WebSocketOptions<D> {
  eventName: string
  onConnect?: () => void
  onConnectError?: (error: Error) => void
  onDisconnect?: () => void
  onMessage?: (data: D) => void
  url: string
}

export interface UseWebSocketOutput {
  connect: () => void
  connected: Ref<boolean>
  disconnect: () => void
  send: (data: unknown) => void
}

export function useWebSocket<D>(
  options: WebSocketOptions<D>,
): UseWebSocketOutput {
  const connected = ref(false)
  let socket: Socket | null = null

  const connect = () => {
    socket = io(options.url)

    socket.on('connect', () => {
      connected.value = true
      if (options.onConnect) {
        options.onConnect()
      }
    })

    socket.on('connect_error', (error) => {
      if (!socket || !socket.active) {
        connected.value = false
        if (options.onConnectError) {
          options.onConnectError(error)
        }
      }
    })

    socket.on('disconnect', () => {
      if (!socket || !socket.active) {
        connected.value = false
        if (options.onDisconnect) {
          options.onDisconnect()
        }
      }
    })

    socket.on(options.eventName, (event: D) => {
      if (options.onMessage) {
        options.onMessage(event)
      }
    })
  }

  const send = (data: unknown) => {
    if (socket) {
      socket.send(data as any)
    }
  }

  const disconnect = () => {
    if (socket) {
      socket.close()
    }
  }

  return {
    connect,
    connected,
    disconnect,
    send,
  }
}
