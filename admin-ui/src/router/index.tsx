// import {lazy} from 'react';
import {RouteObject} from 'react-router-dom';
import {AppLayout} from '@/views/layouts/AppLayout';
import {Home} from '@/views/Home';
import {Error404} from "@/views/errors/404";
import {Connections} from "@/views/connections";
import {Channels} from "@/views/channels";
import {Exchanges} from "@/views/exchanges";
import {Queues} from "@/views/queues";
import {Consumers} from "@/views/consumers";

// const Main = lazy(() => import('@/views/main/main'));
// const NotFound = lazy(() => import('@/views/notfound/notfound'));

const routes: RouteObject[] = [
    {
        element: <AppLayout/>,
        children: [
            {
                path: '/',
                element: <Home/>
            },
            {
                path: '/connections',
                element: <Connections/>
            },
            {
                path: '/channels',
                element: <Channels/>
            },
            {
                path: '/exchanges',
                element: <Exchanges/>
            },
            {
                path: '/queues',
                element: <Queues/>
            },
            {
                path: '/consumers',
                element: <Consumers/>
            },
            {
                path: '*',
                element: <Error404/>
            }
        ]
    }
];

export default routes;
