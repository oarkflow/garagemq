// import {lazy} from 'react';
import {Navigate, RouteObject} from 'react-router-dom';
import {AppLayout} from '@/views/layouts/AppLayout';
import {Main} from '@/views/main/main';
import {NotFound} from '@/views/notfound/notfound';

// const Main = lazy(() => import('@/views/main/main'));
// const NotFound = lazy(() => import('@/views/notfound/notfound'));

const routes: RouteObject[] = [
    {
        element: <AppLayout/>,
        children: [
            {
                path: '/',
                element: <Navigate to="/main"/>
            },
            {
                path: '/main',
                element: <Main/>
            },
            {
                path: '*',
                element: <NotFound/>
            }
        ]
    }
];

export default routes;
