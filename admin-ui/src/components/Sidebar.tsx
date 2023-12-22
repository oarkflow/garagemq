import React, {useState, useEffect} from "react";
import {HiMenuAlt3, HiOutlineLogout} from "react-icons/hi";
import {MdOutlineDashboard} from "react-icons/md";
import {NavLink} from "react-router-dom";
import {BiChevronRight, BiCog} from "react-icons/bi";
import Avatar from "@/icons/Avatar";
import {isCurrentRoute} from "@/hooks/useRouter";

// @ts-ignore
const MenuLink = ({menu, child, sidebarOpen}) => {
    menu.icon = menu.icon || MdOutlineDashboard
    return (
        <NavLink to={menu?.path}
              className={`group flex items-center text-sm gap-3.5 font-medium p-2 hover:text-gray-100 ${(child && isCurrentRoute(menu?.path)) ? 'bg-indigo-dye text-gray-100':''} ${(!child && isCurrentRoute(menu?.path)) ? 'bg-prussian-blue text-gray-100':''} my-1 ${child ? 'hover:bg-indigo-dye' : 'hover:bg-prussian-blue'} rounded-md`}>
            {menu.icon &&
                <div className={`${child ? 'text-gray-200' : ''}`}>{React.createElement(menu.icon, {size: "20"})}</div>}
            {sidebarOpen && (
                <span className={`select-none whitespace-pre duration-500`}>
						{menu?.title}
				</span>
            )}
            {!sidebarOpen && (
                <span
                    className={`absolute bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit z-20`}>
						{menu?.title}
				</span>
            )
            }
        </NavLink>
    )
}

// @ts-ignore
const LogoutMenu = ({menu, child, sidebarOpen}) => {
    menu.icon = HiOutlineLogout
    return (
        <div
             className={`cursor-pointer group flex items-center text-sm gap-3.5 font-medium hover:text-gray-100 p-2 ${child ? 'hover:bg-indigo-dye' : 'hover:bg-prussian-blue'} rounded-md`}>
            {menu.icon &&
                <div className={`${child ? 'text-gray-200' : ''}`}>{React.createElement(menu.icon, {size: "20"})}</div>}
            {sidebarOpen && (
                <span className={`select-none whitespace-pre duration-500`}>
						Logout
				</span>
            )}
            {!sidebarOpen && (
                <span
                    className={`absolute bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit z-20`}>
						Logout
				</span>
            )
            }
        </div>
    )
}
// @ts-ignore
export const MenuItem = ({menu, sidebarOpen}) => {
    const [open, setOpen] = useState(false);
    if (menu.children && menu.children.length > 0) {
        return (
            <div
                className={`${open && 'bg-prussian-blue text-gray-100'} text-sm font-medium hover:bg-prussian-blue rounded-md hover:text-gray-100 my-1`}>
                <div onClick={() => setOpen(!open)}
                     className="cursor-pointer flex justify-between items-center gap-3.5 font-medium p-2 w-full">
                    {menu.icon && <div>{React.createElement(menu.icon, {size: "20"})}</div>}
                    {sidebarOpen && (
                        <>
							<span
                                className={`select-none flex-grow whitespace-pre duration-500 ${!sidebarOpen && "overflow-hidden"}`}>
									{menu?.title}
							</span>
                            <BiChevronRight
                                className={`transition h-5 w-5 hover:text-white ${open ? "rotate-90" : ''}`}/>
                        </>
                    )}
                </div>
                {open && (
                    <div className={`pb-1 ${sidebarOpen ? 'px-1' : ''}`}>
                        {menu.children.map((m, i) => <MenuLink key={i} child={true} menu={m}
                                                               sidebarOpen={sidebarOpen}/>)}
                    </div>
                )}
            </div>
        )
    }
    return (
        <MenuLink menu={menu} sidebarOpen={sidebarOpen}/>
    )
}

// @ts-ignore
export const Brand = ({open, setOpen, className}) => {
    return (
        <>
            <div className={`flex items-center justify-between ${className}`}>
                {open && (
                    <p className="text-2xl px-2 py-3 object-cover whitespace-nowrap">Service Worker</p>
                )}
                <div className="py-6 flex justify-end">
                    <HiMenuAlt3
                        size={26}
                        className="cursor-pointer"
                        onClick={() => setOpen(!open)}
                    />
                </div>
            </div>
        </>
    )
}

export const Profile = ({open, setOpen, className}) => {
    return (
        <>
            <div>
                <div className={`flex items-center w-full justify-between ${className}`}>
                    <div className="flex text-left justify-start">
                        {open && <Avatar className="w-7 mx-2 cursor-pointer"/>}
                        {!open && <Avatar className="w-7 mx-1 mt-3 cursor-pointer"/>}
                        <div className="py-3">
                            {open &&
                                <p className="text-sm">Sujit Baniya</p>}
                        </div>
                    </div>
                    <div className="flex text-right justify-end">
                        {open && (
                            <>
                                <BiCog className="w-5 cursor-pointer hover:text-green-500"
                                       title="Manage profile settings"/>
                                <HiOutlineLogout className="w-5 cursor-pointer hover:text-green-500"
                                                 title="Logout"/>
                            </>
                        )}
                    </div>
                </div>
                {open && (
                    <div
                        className={`max-w-full transition-spacing duration-200 ease-in px-2 mt-2 ${open ? 'visible' : 'invisible'}`}>

                        <div className="relative h-1 overflow-hidden rounded-full">
                            <div className="absolute w-full h-full bg-gray-300"></div>
                            <div className="absolute h-full bg-[#10b981] w-full"></div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

// @ts-ignore
export const Sidebar = ({items}) => {
    let menus = items || []
    let sidebarMenu = {
        isOpen: true
    }
    const strgSidebar = JSON.parse(localStorage.getItem("sidebar-open"))
    if (strgSidebar !== null) {
        sidebarMenu = strgSidebar
    }
    const [open, setOpen] = useState(sidebarMenu.isOpen);
    useEffect(() => {
        sidebarMenu = {
            isOpen: open
        }
        localStorage.setItem("sidebar-open", JSON.stringify(sidebarMenu))
    }, [open]);

    return (
        <section className="flex gap-6 border-r">
            <div className={`flex-1 bg-white min-h-screen ${open ? "w-72" : "w-17"} duration-250 text-dark px-4`}>
                <Brand open={open} setOpen={setOpen}/>
                <Profile open={open} setOpen={setOpen}/>
                <div className="mt-4 flex-1 gap-1 relative">
                    {menus?.map((menu, i) => <MenuItem sidebarOpen={open} menu={menu} key={i}/>)}
                    {!open && <LogoutMenu menu={{}} sidebarOpen={open}/>}
                </div>
            </div>
        </section>
    );
};
