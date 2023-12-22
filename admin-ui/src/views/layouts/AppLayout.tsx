import {Outlet} from 'react-router-dom';
import {Suspense} from 'react';
import {Sidebar} from '@/components/Sidebar';
import {menuItems} from "@/data/menu";

export const AppLayout = () => {
    return (
        <div className="App flex flex-row min-h-screen bg-slate-50 text-gray-800 min-w-screen grid grid-cols-5">
            <Sidebar items={menuItems}/>

            <div className="p-4 min-h-screen w-full ">
                <div className="p-4">
                    <div className="col-span-4 overflow-hidden">
                        <Suspense fallback="Loading...">
                            <Outlet/>
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
};
