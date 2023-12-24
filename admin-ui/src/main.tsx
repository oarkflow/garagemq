import ReactDOM from 'react-dom/client';
import {HashRouter} from 'react-router-dom';
import 'normalize.css';
import '@unocss/reset/tailwind.css';
import 'uno.css';
import App from '@/App.tsx';
import {SocketProvider} from "@/hooks/websocket";
import {WorkerProvider} from "@/hooks/worker";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <HashRouter>
        <WorkerProvider>
            <SocketProvider>
                <App/>
            </SocketProvider>
        </WorkerProvider>
    </HashRouter>
);
