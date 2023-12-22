import {Table} from "@/components/table";
import {ColumnDef} from "@tanstack/table-core";
import {effect} from "@preact/signals";
import {HttpClient} from "@/helpers/api";
import {useState} from "react";

export const Channels = () => {
    const [channels, setChannels] = useState([])
    const transformRate = (trackValue) => {
        if (!trackValue || !trackValue.value) {
            return '0/s'
        }

        return trackValue.value + '/s'
    };
    const columns: ColumnDef[] = [
        {
            accessorKey: "ConnID",
            header: "Connection ID",
        },
        {
            accessorKey: "ChannelID",
            header: "Channel ID",
        },
        {
            accessorKey: "channel",
            header: "Channel",
        },
        {
            accessorKey: "vhost",
            header: "Vhost",
        },
        {
            accessorKey: "user",
            header: "User",
        },
        {
            accessorKey: "qos",
            header: "Qos",
        },
        {
            accessorKey: "confirm",
            header: "Confirm",
        },
        {
            accessorFn: (row) => `${transformRate(row.counters.ack)}`,
            header: "Ack",
            accessorKey: "ack",
        },
        {
            accessorFn: (row) => `${transformRate(row.counters.confirm)}`,
            header: "Confirm",
            accessorKey: "confirm_count",
        },
        {
            accessorFn: (row) => `${transformRate(row.counters.deliver)}`,
            header: "Deliver",
            accessorKey: "deliver",
        },
        {
            accessorFn: (row) => `${transformRate(row.counters.publish)}`,
            header: "Publish",
            accessorKey: "publish",
        },
        {
            accessorFn: (row) => `${transformRate(row.counters.get)}`,
            header: "Get",
            accessorKey: "get",
        },
        {
            accessorFn: (row) => `${transformRate(row.counters.unacked)}`,
            header: "Unacked",
            accessorKey: "unacked",
        },
    ];
    effect(() => {
        HttpClient.get("/channels").then(response => {
            if(response.data.hasOwnProperty('items')) {
                setChannels(response.data.items)
            }
        })
    })
    return (
        <>
            <Table
                title="Channels"
                className="p-2 overflow-hidden bg-white border rounded-md"
                columns={columns}
                rows={channels}
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
