import React, {useEffect} from "react";
import {
    useReactTable,
} from "@/components/table";
import {
    ColumnFiltersState,
    getCoreRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getGroupedRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    GroupingState,
} from "@tanstack/table-core";
import DebouncedInput from "../Inputs/DebouncedInput";
import ActionButtons from "./components/ActionButtons";
import CustomTable from "./components/CustomTable";
import Checkbox from "@/components/Checkbox";

const Buttons = ({
    table,
    rowSelection,
    canToggleColumns,
    canGlobalFilter,
    globalFilter,
    handleGlobalFilter,
    canPaginate,
    canChangeInterval,
}) => {
    return (
        <>
            <ActionButtons
                getSelectedRowModel={table.getSelectedRowModel}
                hasNextPage={table.getCanNextPage()}
                hasPreviousPage={table.getCanPreviousPage()}
                nextPage={table.nextPage}
                pageCount={table.getPageCount()}
                pageIndex={table.getState().pagination.pageIndex}
                pageSize={table.getState().pagination.pageSize}
                previousPage={table.previousPage}
                rowSelection={rowSelection}
                setPageIndex={table.setPageIndex}
                setPageSize={table.setPageSize}
                totalRows={table.getPrePaginationRowModel().rows.length}
                table={table}
                canToggleColumns={canToggleColumns}
                canPaginate={canPaginate}
                canChangeInterval={canChangeInterval}
            >
                {canGlobalFilter && (
                    <div>
                        <DebouncedInput
                            type="search"
                            value={globalFilter ?? ""}
                            onChange={handleGlobalFilter}
                            className="mx-1 p-2 text-sm border border-gray-200 rounded bg-white min-w-48"
                            placeholder="Search all columns..."
                        />
                    </div>
                )}
            </ActionButtons>
        </>
    );
};

export const Table = ({
    canGlobalFilter = true,
    canResizeColumn = false,
    canMoveColumn = false,
    canPinColumn = false,
    sortable = true,
    canGroupColumn = false,
    canColumnFilter = true,
    canToggleColumns = true,
    controlPosition = "both",
    rows = [],
    columns = [],
    selectable = {},
    className = "",
    isPending = false,
    title = "Data Collection",
    canPaginate = true,
    canChangeInterval = true,
    disableAutocomplete = false,
    selectOnClick = true,
    adjustHeight = true,
    pagination = {
        pageSize: 20,
        pageIndex: 0,
    },
    overflow = false,
    setSelectedRows = React.Dispatch<React.SetStateAction<{} | null>>,
    selectedRows = [],
    showModal = function (value: { key: string, type: string }, id: number, action: 'view' | 'edit') { }
}) => {

    const tableRef = React.useRef(null);
    setSelectedRows = setSelectedRows || null
    pagination.pageIndex = pagination.pageIndex || 0;
    if (canPaginate) {
        pagination.pageSize = pagination.pageSize || 20;
    } else {
        pagination.pageSize = -1;
    }
    const [data, setData] = React.useState(rows);


    useEffect(() => {
        setData(rows);
    }, [rows]);

    let checkboxCol = {
        size: 80,
        id: "idx_table",
        header: ({ table }) => {
            return (
                <div className="px-2 flex flex-col justify-center items-center">
                    <span className="inline-block pl-3">{selectable?.label ?? '#'}</span>
                    <Checkbox
                        className="ml-3"
                        checked={table.getIsAllRowsSelected()}
                        indeterminate={table.getIsSomeRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                </div>
            );
        },
        cell: ({ row }) => (
            <div className="px-4">
                <Checkbox
                    checked={row.getIsSelected()}
                    indeterminate={row.getIsSomeSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            </div>
        ),
        enableSorting: false,
    }
    if (selectable?.enable) {
        if (selectable?.freeze) {
            checkboxCol = {
                ...checkboxCol,
                className: "freeze-data-right",
                headerClassName: "freeze-header-right !font-bold",
            }
        }
        if (selectable?.position === 'start') {
            columns = [
                // @ts-ignore
                checkboxCol,
                ...columns,
            ];
        } else {
            columns = [
                // @ts-ignore
                ...columns,
                // @ts-ignore
                checkboxCol
            ];
        }
    }


    let hiddenColumns = {};
    columns
        .filter((col: any) => col.show === false)
        .forEach((col) => {
            hiddenColumns[col.accessorKey || col.id] = false;
        });
    const [columnVisibility, setColumnVisibility] = React.useState(hiddenColumns);
    const [grouping, setGrouping] = React.useState<GroupingState>([]);
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnPinning, setColumnPinning] = React.useState({});
    const [tableHeight, setTableHeight] = React.useState("");
    const [tableMaxHeight, setTableMaxHeight] = React.useState("");
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [globalFilter, setGlobalFilter] = React.useState("");


    let options = {
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        enableColumnResizing: true,
        columnResizeMode: "onChange",
        onColumnVisibilityChange: setColumnVisibility,
        onGroupingChange: setGrouping,
        onColumnPinningChange: setColumnPinning,
        onRowSelectionChange: setRowSelection,
        isPending: isPending,
        state: {
            grouping,
            columnFilters,
            globalFilter,
            columnVisibility,
            columnPinning,
            rowSelection,
        },
        debugTable: false,
        debugHeaders: false,
        debugColumns: false,
        filterFns: undefined,
        initialState: {
        },
        meta: {
            triggerModal: (value: { key: string, type: string }, id: number, action: 'view' | 'edit') => {
                showModal(value, id, action)
            }
        }



    };

    useEffect(() => {
        if (setSelectedRows && rowSelection) {
            setSelectedRows(rowSelection)
        }
    }, [rowSelection, setSelectedRows])

    if (pagination.pageSize !== -1) {
        options.initialState.pagination = pagination;
    }
    const table = useReactTable(options);
    const handleGlobalFilter = (value) => {
        setGlobalFilter(String(value));
    };
    React.useEffect(() => {
        if (tableRef && tableRef.current && adjustHeight) {
            const offset = tableRef.current.getBoundingClientRect().top - 200
            if (offset > 0) {
                setTableHeight(`calc(90svh - ${offset}px)`);
            } else {
                setTableHeight(`calc(90svh + ${offset}px)`);
            }
            console.log(offset)
            setTableMaxHeight(`calc(90svh + ${offset}px)`);
        }
    }, [tableRef]);
    return (
        <div className={`${className}`}>
            <h1 className="font-semibold ml-2">{title}</h1>
            {(controlPosition === "both" || controlPosition === "top") && (
                <Buttons
                    table={table}
                    rowSelection={rowSelection}
                    canToggleColumns={canToggleColumns}
                    canGlobalFilter={canGlobalFilter}
                    canPaginate={canPaginate}
                    canChangeInterval={canChangeInterval}
                    globalFilter={globalFilter}
                    handleGlobalFilter={handleGlobalFilter}
                />
            )}
            <div
                ref={tableRef}
                style={{ height: tableHeight, maxHeight: tableMaxHeight }}
                className={`w-full  ${overflow ? '' : 'overflow-auto'} slim-scrollbar`}
            >
                <CustomTable
                    table={table}
                    canResizeColumn={canResizeColumn}
                    canMoveColumn={canMoveColumn}
                    selectedRows={selectedRows}
                    canPinColumn={canPinColumn}
                    sortable={sortable}
                    canGroupColumn={canGroupColumn}
                    canColumnFilter={canColumnFilter}
                    selectOnClick={selectOnClick}
                    disableAutocomplete={disableAutocomplete}
                    className="w-100"
                />
            </div>
            {(controlPosition === "both" || controlPosition === "bottom") && (
                <Buttons
                    table={table}
                    rowSelection={rowSelection}
                    canToggleColumns={canToggleColumns}
                    canGlobalFilter={canGlobalFilter}
                    canPaginate={canPaginate}
                    canChangeInterval={canChangeInterval}
                    globalFilter={globalFilter}
                    handleGlobalFilter={handleGlobalFilter}
                />
            )}
        </div>
    );
};

export default Table;
