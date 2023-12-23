import {Table} from "@/components/table";
import {ColumnDef} from "@tanstack/table-core";
import {effect} from "@preact/signals";
import {HttpClient} from "@/helpers/api";
import {useEffect, useState} from "react";

export const Exchanges = () => {
    const [exchanges, setExchanges] = useState([])
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
            accessorKey: "type",
            header: "Type",
        },
        {
            accessorKey: "durable",
            header: "Durable",
        },
        {
            accessorKey: "internal",
            header: "Internal",
        },
        {
            accessorFn: (row) => `${transformRate(row.msg_rate_in)}`,
            header: "Message Rate IN",
            accessorKey: "msg_rate_in",
        },
        {
            accessorFn: (row) => `${transformRate(row.msg_rate_out)}`,
            header: "Message Rate OUT",
            accessorKey: "msg_rate_out",
        },
    ];
    useEffect(() => {
        HttpClient.get("/exchanges").then(response => {
            if(response.data.hasOwnProperty('items')) {
                setExchanges(response.data.items)
            }
        })
    }, [])
    return (
        <>
            <Table
                title="Exchanges"
                className="p-2 overflow-hidden bg-white border rounded-md"
                columns={columns}
                rows={exchanges}
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
