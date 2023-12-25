import { createContext, useContext, useState } from "react";
import {Socket} from "@/components/socket";

export const SocketContext = createContext({});

export const SocketProvider = ({ children, defaultSocket }) => {
	const [socket, setSocket] = useState(defaultSocket);
	const [isOpened, setIsOpened] = useState(false)
	const value = {
		socket,
		setSocket,
		createSocket: (url: string, userID: string, callback ?: any) => {
			const ws = new Socket(url, userID)
            ws.callbackOnOpen = callback
			return ws.connect().then(connected => {
                if (callback) {
                    callback(ws)
                }
				setIsOpened(connected)
				setSocket(ws)
				return ws
			})
		},
		closeSocket: () => {
			if (socket) {
				socket.close()
				setSocket(null)
			}
		},
		isOpened,
		setIsOpened
	}
	return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
};

export const useSocket = () => useContext(SocketContext)
