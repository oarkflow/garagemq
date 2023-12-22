import {MdHome} from "react-icons/md";
import {LuNetwork} from "react-icons/lu";
import {GrNetwork, GrUserWorker} from "react-icons/gr";
import {CgGhost} from "react-icons/cg";
import {PiQueue} from "react-icons/pi";

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
        title: "Queues",
        icon: PiQueue,
        path: "/queues",
    },
    {
        title: "Exchanges",
        icon: GrNetwork,
        path: "/exchanges",
    },
    {
        title: "Consumers",
        icon: GrUserWorker,
        path: "/consumers",
    }
];



