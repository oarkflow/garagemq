import {Outlet} from 'react-router-dom'
import {Suspense} from "react";
import {Sidebar} from "@/components/Sidebar";

export const AppLayout = () => {
    return (
        <div className="App flex flex-row min-h-screen bg-slate-50 text-gray-800 min-w-screen grid grid-cols-5">
            <Sidebar/>

            <div className="p-4 sm:ml-70 min-h-screen w-full ">
                <div className="p-4">
                    <div className="col-span-4 overflow-hidden">
                        <Suspense fallback="Loading...">
                            <Outlet/>
                        </Suspense>
                    </div>
                </div>
            </div>


        </div>
    )
}
