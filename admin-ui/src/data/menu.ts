import {MdHome} from "react-icons/md";
import {LuNetwork} from "react-icons/lu";
import {GrNetwork, GrUserWorker} from "react-icons/gr";
import {CgGhost} from "react-icons/cg";

export const menuItems = [
    {
        title: "Overview",
        icon: MdHome,
        path: "/",
    },
    {
        title: "Connections",
        icon: LuNetwork,
        path: "/connections",
    },
    {
        title: "Channels",
        icon: CgGhost,
        path: "/channels",
    },
    {
        title: "Exchanges",
        icon: GrNetwork,
        path: "/channels",
    },
    {
        title: "Consumers",
        icon: GrUserWorker,
        path: "/consumers",
    }
];



