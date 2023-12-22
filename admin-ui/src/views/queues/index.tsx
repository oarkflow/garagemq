import {Table} from "@/components/table";
import {ColumnDef} from "@tanstack/table-core";
import {effect} from "@preact/signals";
import {HttpClient} from "@/helpers/api";
import {useState} from "react";

export const Queues = () => {
    const [queues, setQueues] = useState([])
    const transformRate = (trackValue) => {
        if (!trackValue || !trackValue.value) {
            return '0/s'
        }

        return trackValue.value + '/s'
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
    ];
    effect(() => {
        HttpClient.get("/queues").then(response => {
            if(response.data.hasOwnProperty('items')) {
                setQueues(response.data.items)
            }
        })
    })
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
