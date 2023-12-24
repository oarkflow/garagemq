import {Table} from "@/components/table";
import {CellContext, ColumnDef} from "@tanstack/table-core";
import {effect} from "@preact/signals";
import {HttpClient} from "@/helpers/api";
import {useEffect, useState} from "react";
import {useWorker} from "@/hooks/worker";
import {useParams} from "react-router";
import {NavLink} from "react-router-dom";
import {FiEye} from "react-icons/fi";
import {FaCirclePause, FaCirclePlay, FaCircleStop} from "react-icons/fa6";

export const Queues = ({data}) => {
    const {queues, setQueues} = useWorker()
    const transformRate = (trackValue) => {
        if (!trackValue || !trackValue.value) {
            return '0/s'
        }

        return trackValue.value + '/s'
    }
    const stopQueue = (queue) => {
        HttpClient.post("/queue/stop", {name: queue}).then((response) => {
            console.log(response.data)
        })
    }
    const pauseQueue = (queue) => {
        HttpClient.post("/queue/pause", {name: queue}).then((response) => {
            console.log(response.data)
        })
    }
    const startQueue = (queue) => {
        HttpClient.post("/queue/start", {name: queue}).then((response) => {
            console.log(response.data)
        })
    }
    const columns: ColumnDef[] = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "vhost",
            header: "Vhost",
        },
        {
            accessorKey: "durable",
            header: "Durable",
        },
        {
            accessorKey: "auto_delete",
            header: "Auto Delete",
        },
        {
            accessorKey: "exclusive",
            header: "Exclusive",
        },
        {
            accessorFn: (row) => `${row.counters.ready.value?row.counters.ready.value:0}`,
            header: "Ready",
            accessorKey: "ready",
        },
        {
            accessorFn: (row) => `${row.counters.unacked.value?row.counters.unacked.value:0}`,
            header: "Unacked",
            accessorKey: "unacked",
        },
        {
            accessorFn: (row) => `${row.counters.total.value?row.counters.total.value:0}`,
            header: "Total",
            accessorKey: "total",
        },
        {
            accessorFn: (row) => `${transformRate(row.counters.incoming)}`,
            header: "Incoming",
            accessorKey: "incoming",
        },
        {
            accessorFn: (row) => `${transformRate(row.counters.deliver)}`,
            header: "Deliver",
            accessorKey: "deliver",
        },
        {
            accessorFn: (row) => `${transformRate(row.counters.get)}`,
            header: "Get",
            accessorKey: "get",
        },
        {
            accessorFn: (row) => `${transformRate(row.counters.ack)}`,
            header: "Ack",
            accessorKey: "ack",
        },
        {
            header: "Consumers",
            accessorKey: "consumers",
            cell: (ctx: CellContext<any, any>) => {
                const row = ctx.row.original
                return (
                    <NavLink className="text-blue-400 hover:text-blue-500 flex items-center gap-2" to={`/queues/${row.name}/consumers`}>
                        <span>{row.consumers}</span>
                        <FiEye className="w-3 h-3"/>
                    </NavLink>
                )
            },
        },
        {
            size: 80,
            id: "action",
            header: "Action",
            cell: (ctx: CellContext<any, any>) => {
                const row = ctx.row.original
                return (
                    <>
                        {row.active && (
                            <span className="flex gap-1">
                                <FaCirclePause onClick={() => pauseQueue(row.name)} className="w-5 h-5 text-yellow-600 hover:text-yellow-700 cursor-pointer"/>
                                <FaCircleStop onClick={() => stopQueue(row.name)} className="w-5 h-5 text-red-600 hover:text-red-700 cursor-pointer"/>
                            </span>
                        )}
                        {!row.active && <FaCirclePlay onClick={() => startQueue(row.name)} className="w-5 h-5 text-green-600 hover:text-green-700 cursor-pointer"/>}
                    </>
                )
            },
            className: "freeze-data-right",
            headerClassName: "freeze-header-right !font-bold",
            enableSorting: false,
        },
    ];
    useEffect(() => {
        if (!data) {
            HttpClient.get("/queues").then(response => {
                if(response.data.hasOwnProperty('items')) {
                    setQueues(response.data.items || [])
                }
            })
        }
    }, [])
    useEffect(() => {
        if (data) {
            setQueues(data)
        }
    }, [data])
    return (
        <>
            <Table
                title="Queues"
                className="p-2 overflow-hidden bg-white border rounded-md"
                columns={columns}
                rows={queues}
                canGlobalFilter={true}
                canToggleColumns={false}
                canColumnFilter={false}
                controlPosition="top"
                selectableWithCheckbox={false}
                canPaginate={true}
                canChangeInterval={true}
                canResizeColumn={false}
            />
        </>
    )
}
