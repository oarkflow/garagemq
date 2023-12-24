import {Table} from "@/components/table";
import {CellContext, ColumnDef} from "@tanstack/table-core";
import {effect} from "@preact/signals";
import {HttpClient} from "@/helpers/api";
import {useEffect, useState} from "react";
import {useWorker} from "@/hooks/worker";
import {FaCirclePause, FaCirclePlay, FaCircleStop} from "react-icons/fa6";
import {FaTrash} from "react-icons/fa";

export const Consumers = () => {
    const {consumers, setConsumers} = useWorker()
    const stopConsumer = (consumer) => {
        HttpClient.post("/consumer/stop", {tag: consumer}).then((response) => {
            console.log(response.data)
        })
    }
    const pauseConsumer = (consumer) => {
        HttpClient.post("/consumer/pause", {tag: consumer}).then((response) => {
            console.log(response.data)
        })
    }
    const startConsumer = (consumer) => {
        HttpClient.post("/consumer/start", {tag: consumer}).then((response) => {
            console.log(response.data)
        })
    }
    const cancelConsumer = (consumer) => {
        HttpClient.post("/consumer/cancel", {tag: consumer}).then((response) => {
            console.log(response.data)
        })
    }
    const columns: ColumnDef[] = [
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            accessorKey: "channel_id",
            header: "Channel ID",
        },
        {
            accessorKey: "channel",
            header: "Channel",
        },
        {
            accessorKey: "tag",
            header: "Tag",
        },
        {
            accessorKey: "queue",
            header: "Queue",
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
                            <span className="flex gap-1 items-center">
                                <FaCirclePause onClick={() => pauseConsumer(row.tag)} className="w-5 h-5 text-yellow-600 hover:text-yellow-700 cursor-pointer"/>
                                <FaCircleStop onClick={() => stopConsumer(row.tag)} className="w-5 h-5 text-red-600 hover:text-red-700 cursor-pointer"/>
                                <FaTrash onClick={() => cancelConsumer(row.tag)} className="w-4 h-4 text-red-600 hover:text-red-700 cursor-pointer"/>
                            </span>
                        )}
                        {!row.active && <FaCirclePlay onClick={() => startConsumer(row.tag)} className="w-5 h-5 text-green-600 hover:text-green-700 cursor-pointer"/>}
                    </>
                )
            },
            className: "freeze-data-right",
            headerClassName: "freeze-header-right !font-bold",
            enableSorting: false,
        },
    ];
    useEffect(() => {
        HttpClient.get("/consumers").then(response => {
            if(response.data.hasOwnProperty('items')) {
                setConsumers(response.data.items || [])
            }
        })
    }, [])
    return (
        <>
            <Table
                title="Consumers"
                className="p-2 overflow-hidden bg-white border rounded-md"
                columns={columns}
                rows={consumers}
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
