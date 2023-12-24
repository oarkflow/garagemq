import Filter from "./Filter";
import TablePins from "./TablePins";
import { AiOutlineGroup, AiOutlineUngroup, } from "react-icons/ai";
import { FaSort, FaSortDown, FaSortUp, } from "react-icons/fa";
import { LuFilterX } from "react-icons/lu";
import { Loading } from "@/components/Loading";
import {HeaderGroup, Row, RowData} from "@tanstack/table-core";
import Table from "@/components/table/Table";
import {flexRender} from "@/components/table";

type TableGroup = "center" | "left" | "right";

function getTableHeaderGroups<T extends RowData>(
    table: Table<T>,
    tg?: TableGroup
): [HeaderGroup<T>[], HeaderGroup<T>[]] {
    if (tg === "left") {
        return [table.getLeftHeaderGroups(), table.getLeftFooterGroups()];
    }

    if (tg === "right") {
        return [table.getRightHeaderGroups(), table.getRightFooterGroups()];
    }

    if (tg === "center") {
        return [table.getCenterHeaderGroups(), table.getCenterFooterGroups()];
    }

    return [table.getHeaderGroups(), table.getFooterGroups()];
}

function getRowGroup<T extends RowData>(row: Row<T>, tg?: TableGroup) {
    if (tg === "left") return row.getLeftVisibleCells();
    if (tg === "right") return row.getRightVisibleCells();
    if (tg === "center") return row.getCenterVisibleCells();
    return row.getVisibleCells();
}

type Props<T extends RowData> = {
    table: Table<T>;
    tableGroup?: TableGroup;
    canResizeColumn?: boolean;
    canMoveColumn?: boolean;
    canPinColumn?: boolean;
    canGroupColumn?: boolean;
    sortable?: boolean;
    canColumnFilter?: boolean;
    disableAutocomplete: boolean;
    className: string;
    selectOnClick?: boolean;
    selectedRows?: Array<Number | String>;
};

export function CustomTable<T extends RowData>({
    table,
    tableGroup,
    canResizeColumn,
    canMoveColumn,
    canPinColumn,
    sortable = true,
    canGroupColumn,
    canColumnFilter = true,
    className,
    disableAutocomplete,
    selectOnClick = true,
    selectedRows = []
}: Props<T>) {
    const [headerGroups, footerGroup] = getTableHeaderGroups(table, tableGroup);
    return (
        <table className={`w-full whitespace-nowrap ${className}`}>
            <thead className="divide-y divide-gray-200 dark:divide-gray-700">
                {headerGroups.map((headerGroup) => (
                    <tr key={headerGroup.id} className="bg-gray-100">
                        {headerGroup.headers.map((header) => (
                            <th
                                className={`bg-white sticky py-2 -top-0.5 font-light whitespace-nowrap select-none align-middle text-left ${header.column.columnDef.headerClassName
                                    ? header.column.columnDef.headerClassName
                                    : ""
                                    }`}
                                key={header.id}
                                style={{
                                    width: header.getSize(),
                                }}
                                colSpan={header.colSpan}
                            >
                                {header.isPlaceholder ? null : (
                                    <>
                                        <div
                                            className={`flex justify-between w-full px-2 gap-3 ${header.id === "action" && "text-center"
                                                }`}
                                        >
                                            <div className="w-full">
                                                <div>
                                                    {canGroupColumn && header.column.getCanGroup() ? (
                                                        // If the header can be grouped, let's add a toggle
                                                        <button
                                                            onClick={header.column.getToggleGroupingHandler()}
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            {header.column.getIsGrouped() ? (
                                                                <AiOutlineGroup
                                                                    className="h-4 w-4"
                                                                    title="Group by"
                                                                />
                                                            ) : (
                                                                <AiOutlineUngroup
                                                                    className="h-4 w-4"
                                                                    title="Ungroup by"
                                                                />
                                                            )}
                                                        </button>
                                                    ) : null}{" "}
                                                    <span className="text-sm">
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}{" "}
                                                    </span>
                                                </div>
                                                {canColumnFilter && header.column.getCanFilter() ? (
                                                    <div>
                                                        <Filter
                                                            column={header.column}
                                                            table={table}
                                                            disableAutocomplete={disableAutocomplete}
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>

                                            {sortable && (
                                                <button
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    className={
                                                        header.column.getCanSort()
                                                            ? "cursor-pointer select-none"
                                                            : ""
                                                    }
                                                >
                                                    {{
                                                        asc: <FaSortUp className="h-4 w-4 text-gray-700" />,
                                                        desc: (
                                                            <FaSortDown className="h-4 w-4 text-gray-700" />
                                                        ),
                                                    }[header.column.getIsSorted() as string] ??
                                                        (header.column.getCanSort() ? (
                                                            <FaSort className="h-4 w-4 text-gray-300" />
                                                        ) : null)}
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                                {canResizeColumn && (
                                    <div
                                        className="absolute right-0 top-0 h-full w-1 bg-blue-300 select-none touch-none hover:bg-blue-500 cursor-col-resize"
                                        onMouseDown={header.getResizeHandler()}
                                        onTouchStart={header.getResizeHandler()}
                                    />
                                )}
                                {canMoveColumn &&
                                    !header.isPlaceholder &&
                                    header.column.getCanPin() && (
                                        <TablePins
                                            isPinned={header.column.getIsPinned()}
                                            pin={header.column.pin}
                                        />
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {table.getRowModel().rows.map((row) => {
                    return (
                        <tr
                            key={row.id}
                            className={`border-b transition duration-300 ease-in-out ${(row.getIsSelected() || selectedRows.includes(row.id)) ? '!bg-yellow-100': 'even:bg-slate-50 odd:bg-slate-100'}`}
                            onClick={() => {
                                if(selectOnClick) {
                                    row.toggleSelected()
                                }
                            }}
                        >
                            {getRowGroup(row, tableGroup).map((cell) => (
                                <td
                                    className={`py-1 px-2 text-sm  font-semibold ${cell.column.columnDef.className
                                        ? cell.column.columnDef.className
                                        : ""
                                    }`}
                                    key={cell.id}
                                    style={{
                                        width: cell.column.getSize(),
                                    }}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    )
                })}
                {table.getRowModel().rows && table.getRowModel().rows.length === 0 && (
                    <tr className="relative h-100 no-records-row">
                        <td colSpan={table.getAllColumns().length} className="py-4 relative">
                            {table.options.isPending && <Loading />}
                            {!table.options.isPending && (
                                <span className="grid place-items-center">
                                    <span><LuFilterX className="w-10 h-10 text-gray-300"></LuFilterX></span>
                                    <span className="text-gray-500 block py-2">No records found</span>
                                    <p className="text-gray-400 text-sm">If using filters, try adjusting the filters.</p>
                                    <p className="text-gray-400 text-sm">Otherwise, create some data!</p>
                                </span>
                            )}
                        </td>
                    </tr>
                )}
            </tbody>
            <tfoot>
                {footerGroup.map((footerGroup) => (
                    <tr key={footerGroup.id}>
                        {footerGroup.headers.map((header) => (
                            <th key={header.id} colSpan={header.colSpan}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.footer,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
            </tfoot>
        </table>
    );
}

export default CustomTable;
