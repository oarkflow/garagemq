import {RowData, RowModel} from '../'
import React, {useState} from 'react'
import {BsChevronLeft, BsChevronRight} from "react-icons/bs";
import {HiOutlineDotsVertical} from "react-icons/hi";

type Props<T extends RowData> = {
    getSelectedRowModel: () => RowModel<T>
    hasNextPage: boolean
    hasPreviousPage: boolean
    canToggleColumns?: boolean
    canPaginate?: boolean
    canChangeInterval?: boolean
    nextPage: () => void
    pageCount: number
    pageIndex: number
    pageSize: number
    previousPage: () => void
    rowSelection: Object
    setPageIndex: (index: number) => void
    setPageSize: (size: number) => void
    totalRows: number,
    table: any,
    children?: any,
}

export function ActionButtons<T extends RowData>({
                                                     getSelectedRowModel,
                                                     hasNextPage,
                                                     hasPreviousPage,
                                                     nextPage,
                                                     pageCount,
                                                     pageIndex,
                                                     pageSize,
                                                     previousPage,
                                                     rowSelection,
                                                     setPageIndex,
                                                     setPageSize,
                                                     totalRows,
                                                     table,
                                                     canToggleColumns = true,
                                                     canPaginate = true,
                                                     canChangeInterval = true,
                                                     children,
                                                 }: Props<T>) {
    const [isToggled, setIsToggled] = useState(false)
    return (
        <React.Fragment>
            <div className="flex items-center gap-2 whitespace-nowrap my-3 justify-between">
                <div className="flex align-middle items-center">
                    {canToggleColumns && (
                        <div className="relative">
                            <button onClick={() => setIsToggled(!isToggled)}
                                    className="rounded py-3 px-2 border hover:bg-white"
                            >
                                <HiOutlineDotsVertical/>
                            </button>
                            {isToggled && (
                                <div
                                    className="p-2 inline-block border border-gray-200 shadow rounded absolute z-100 bg-white top-0">
                                    <div className="px-1 border-b border-gray-200">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={table.getIsAllColumnsVisible()}
                                                onChange={table.getToggleAllColumnsVisibilityHandler()}
                                                className="mr-1"
                                            />
                                            Toggle All
                                        </label>
                                    </div>
                                    {table.getAllLeafColumns().map(column => {
                                        return (
                                            <div key={column.id} className="px-1">
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={column.getIsVisible()}
                                                        onChange={column.getToggleVisibilityHandler()}
                                                        className="mr-1"
                                                    />
                                                    {column.columnDef.header || column.id}
                                                </label>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                    {children}
                </div>
                <div className="flex w-full justify-end gap-1 text-sm">
                    {canPaginate && (
                        <>
                            {totalRows > 0 && (
                                <span className="flex items-center gap-1 whitespace-nowrap">
                                    <span>Records</span>
                                    <strong>
                                        {pageIndex * pageSize + 1} - {totalRows <= (pageIndex * pageSize + pageSize) ? totalRows : pageIndex * pageSize + pageSize}
                                    </strong>
                                    <span> of </span>
                                    <strong>{totalRows}</strong>
                                </span>
                            )}
                            {totalRows === 0 && (
                                <span className="flex items-center gap-1 whitespace-nowrap">
                                    <span>Records</span>
                                    <strong>
                                        ... - ...
                                    </strong>
                                    <span> of </span>
                                    <strong>...</strong>
                                </span>
                            )}
                            <button
                                className={`border rounded bg-white p-1 hover:bg-gray-100 ${!hasPreviousPage ? 'cursor-not-allowed' : ''}`}
                                onClick={() => previousPage()}
                                disabled={!hasPreviousPage}
                            >
                                <BsChevronLeft className="h-5 w-5 py-1"/>
                            </button>
                            <span className="flex items-center gap-1 whitespace-nowrap">
                                <input
                                    type="number"
                                    disabled={true}
                                    onChange={e => {
                                        const page = e.target.value ? Number(e.target.value) - 1 : 0
                                        setPageIndex(page)
                                    }}
                                    className="border p-1 rounded !w-16 text-center focus:outline-0"
                                    value={pageIndex + 1}
                                />
                            </span>
                            <button
                                className={`border rounded p-1 bg-white hover:bg-gray-100 ${!hasNextPage ? 'cursor-not-allowed' : ''}`}
                                onClick={() => nextPage()}
                                disabled={!hasNextPage}
                            >
                                <BsChevronRight className="h-5 w-5 py-1"/>
                            </button>
                        </>
                    )}
                    {canChangeInterval && (
                        <span className="flex items-center gap-1 whitespace-nowrap">
                            <select
                                className="border rounded min-w-16 bg-white"
                                value={pageSize}
                                onChange={e => {
                                    setPageSize(Number(e.target.value))
                                }}
                                disabled={!hasNextPage}
                            >
                                {[10, 20, 30, 40, 50, 100].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                        {pageSize}
                                    </option>
                                ))}
                            </select>
                        </span>
                    )}
                </div>
            </div>
        </React.Fragment>
    )
}

export default ActionButtons
