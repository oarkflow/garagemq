import {Outlet} from 'react-router-dom';
import {Suspense} from 'react';
import {Sidebar} from '@/components/Sidebar';
import {menuItems} from "@/data/menu";

export const AppLayout = () => {
    return (
        <div className="App flex flex-row min-h-screen bg-slate-50 text-gray-800 grid grid-cols-5">
            <Sidebar items={menuItems}/>

            <div className="p-4 min-h-screen w-full overflow-auto">
                <div className="p-4">
                    <div className="col-span-4">
                        <Suspense fallback="Loading...">
                            <Outlet/>
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
};
