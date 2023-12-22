import {Table} from "@/components/table";
import {makeData} from "@/data/makeData";
import {ColumnDef} from "@tanstack/table-core";

export const Queues = () => {
    const columns: ColumnDef[] = [
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            accessorKey: "first_name",
            header: "First Name",
            id: "first_name",
        },
        {
            accessorKey: "last_name",
            header: "Last Name",
            id: "last_name",
        },

        {
            accessorFn: (row) => `${row.first_name} ${row.last_name}`,
            header: "Full Name",
            accessorKey: "full_name",
        },
        {
            accessorKey: "dob",
            header: "Date of Birth",
        },
        {
            accessorKey: "age",
            header: "Age",
        },
        {
            accessorKey: "visits",
            header: "Visits",
        },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            accessorKey: "progress",
            header: "Profile Progress",
            // className: 'freeze-data-right',
            // headerClassName: 'freeze-header-right !font-bold'
        }
    ];
    return (
        <Table
            title="Connections"
            className="p-2 overflow-hidden bg-white border rounded-md"
            columns={columns}
            rows={makeData(500)}
            canGlobalFilter={true}
            canToggleColumns={false}
            canColumnFilter={false}
            controlPosition="top"
            selectableWithCheckbox={false}
            canPaginate={true}
            canChangeInterval={true}
            canResizeColumn={false}
        />
    )
}
