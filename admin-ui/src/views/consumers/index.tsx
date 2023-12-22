import {Table} from "@/components/table";
import {ColumnDef} from "@tanstack/table-core";
import {effect} from "@preact/signals";
import {HttpClient} from "@/helpers/api";
import {useState} from "react";

export const Consumers = () => {
    const [consumers, setConsumers] = useState([])
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
    ];
    effect(() => {
        HttpClient.get("/consumers").then(response => {
            if(response.data.hasOwnProperty('items')) {
                setConsumers(response.data.items)
            }
        })
    })
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
