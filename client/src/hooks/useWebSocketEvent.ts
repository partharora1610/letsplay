// "use client"
// import { useEffect, useCallback } from "react"
// import { useWebSocket } from "@/context/SocketContext"

// type EventHandler = (data: any) => void

// const useWebSocketEvents = () => {
//   const socket = useWebSocket()

//   const eventHandlers: { [key: string]: EventHandler[] } = {}

//   const addEventListener = useCallback(
//     (eventType: string, handler: EventHandler) => {
//       if (!eventHandlers[eventType]) {
//         eventHandlers[eventType] = []
//       }
//       eventHandlers[eventType].push(handler)
//       console.log("add Event Handler")
//       console.log(eventHandlers)
//     },
//     []
//   )

//   const removeEventListener = useCallback(
//     (eventType: string, handler: EventHandler) => {
//       if (eventHandlers[eventType]) {
//         eventHandlers[eventType] = eventHandlers[eventType].filter(
//           (h) => h !== handler
//         )
//       }
//     },
//     []
//   )

//   useEffect(() => {
//     if (!socket) return

//     const handleMessage = (event: MessageEvent) => {
//       const message = JSON.parse(event.data)
//       console.log(message)
//       console.log(eventHandlers)

//       if (eventHandlers[message.type]) {
//         eventHandlers[message.type].forEach((handler) => handler(message))
//       }
//     }

//     socket.addEventListener("message", handleMessage)

//     return () => {
//       socket.removeEventListener("message", handleMessage)
//     }
//   }, [socket])

//   const sendMessage = useCallback(
//     (type: string, data?: any) => {
//       if (socket) {
//         socket.send(JSON.stringify({ type, ...data }))
//       }
//     },
//     [socket]
//   )

//   return { addEventListener, removeEventListener, sendMessage }
// }

// export default useWebSocketEvents
