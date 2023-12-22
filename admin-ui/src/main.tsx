import ReactDOM from 'react-dom/client';
import {HashRouter} from 'react-router-dom';
import 'normalize.css';
import '@unocss/reset/tailwind.css';
import 'uno.css';
import App from '@/App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <HashRouter>
        <App/>
    </HashRouter>
);
