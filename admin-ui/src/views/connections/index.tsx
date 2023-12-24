import {Table} from "@/components/table";
import {ColumnDef} from "@tanstack/table-core";
import {effect} from "@preact/signals";
import {HttpClient} from "@/helpers/api";
import {useEffect, useState} from "react";
import {useWorker} from "@/hooks/worker";

export const Connections = () => {
    const {connections, setConnections} = useWorker()
    const transformTraffic = (trackValue) => {
        let value = 0;
        if (trackValue) {
            value = trackValue.value;
        }
        if (value > 1024 * 1024) {
            value = Math.round(value * 100 / 1024 / 1024) / 100;
            return value + ' MB/s';
        } else if (value > 1024) {
            value = Math.round(value * 100 / 1024) / 100;
            return value + ' KB/s';
        } else {
            return value + ' B/s';
        }
    }
    const columns: ColumnDef[] = [
        {
            accessorKey: "id",
            header: "Connection ID",
        },
        {
            accessorKey: "vhost",
            header: "Vhost",
            id: "vhost",
        },
        {
            accessorKey: "channels_count",
            header: "Channels",
            id: "channels_count",
        },
        {
            accessorKey: "user",
            header: "User",
            id: "user",
        },
        {
            accessorKey: "protocol",
            header: "Protocol",
            id: "protocol",
        },
        {
            accessorFn: (row) => `${transformTraffic(row.from_client)}`,
            header: "From",
            accessorKey: "from",
        },
        {
            accessorFn: (row) => `${transformTraffic(row.to_client)}`,
            header: "To",
            accessorKey: "to",
        },
    ];
    useEffect(() => {
        HttpClient.get("/connections").then(response => {
            if(response.data.hasOwnProperty('items')) {
                setConnections(response.data.items || [])
            }
        })
    }, [])
    return (
        <>
            <Table
                title="Connections"
                className="p-2 overflow-hidden bg-white border rounded-md"
                columns={columns}
                rows={connections}
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
