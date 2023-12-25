import {useRoutes} from 'react-router-dom';
import routes from '@/router';
import useOnMount from "@/hooks/useOnMount";
import {useSocket} from "@/hooks/websocket";
import {useWorker} from "@/hooks/worker";

const App = () => {
    const {createSocket} = useSocket()
    const {updateOverview} = useWorker()
    useOnMount(() => {
        const serverPort = import.meta.env.VITE_SAME_ORIGIN_SOCKET_PORT
        const { protocol, hostname, port } = window.location
        const ws = protocol === "http:" ? "ws:" : "wss:"
        const url = import.meta.env.VITE_SOCKET_URL || `${ws}//${hostname}:${serverPort || port}`
        createSocket(url + '/socket', '', socket => {
            socket.on("overview:response", (data) => {
                updateOverview(data)
            })
        })
        // https://dribbble.com/shots/19531357-Zuum-Video-Conference-Dashboard
    });
    return useRoutes(routes)
}

export default App;
