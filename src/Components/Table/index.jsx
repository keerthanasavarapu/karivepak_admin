import { useState } from 'react';
import './table.css';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { columns } from './columns';
import { FooterCell } from '../Table/FooterCell';
import { useProductVariantContext } from '../../context/hooks/useProductVariant';
import { imageURL } from '../../Services/api/baseURL';

export const Table = () => {

  const { data, originalData, editedRows, setData, setOriginalData, setEditedRows, updateRow, pageCount } = useProductVariantContext();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      pagination: pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,

    meta: {
      editedRows,
      setEditedRows,
      revertData: (rowIndex, revert) => {
        if (revert) {
          setData((old) =>
            old.map((row, index) =>
              index === rowIndex ? originalData[rowIndex] : row
            )
          );
        } else {
          setOriginalData((old) =>
            old.map((row, index) => (index === rowIndex ? data[rowIndex] : row))
          );
        }
      },
      // updateRow: (rowIndex) => {
      //   updateRow(data[rowIndex].id, data[rowIndex]);
      // },
      // updateData: (rowIndex, columnId, value) => {
      //   setData((old) =>
      //     old.map((row, index) => {
      //       if (index === rowIndex) {
      //         return {
      //           ...old[rowIndex],
      //           [columnId]: value,
      //         };
      //       }
      //       return row;
      //     })
      //   );
      // },
      updateRow: (rowIndex, updatedObject) => {
        const updatedData = [...data];
        updatedData[rowIndex] = { ...updatedObject };
        console.log(updatedData);
        setData(updatedData); 
        setOriginalData(updatedData);
      },
      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              const updatedRow = {
                ...row,
                [columnId]: value,
              };

              // const purchasePrice = parseFloat(updatedRow.purchasePrice) || 0;
              // const discount = parseFloat(updatedRow.discount) || 0;
              // const quantity = parseFloat(updatedRow.quantity) || 1;

              // const totalCost = purchasePrice * quantity;

              // const totalDiscount = discount * quantity;

              // updatedRow.finalSellingPrice = totalCost - totalDiscount;

              return updatedRow;
            }
            return row;
          })
        );
      },

      addRow: () => {
        const newRow = {
          variantCode: "",
          variantImage: null,
          variantName: "",
          sellingPrice: 0,
          purchasePrice: 0,
          quantity: 0,
          discount: 0,
          finalSellingPrice: 0,
          isTopSellingProduct: false,
          vol: "",
          alcohol_percentage: 0,
          isOfferApplied: false,
          offers: [],
          status : "active",
          label: "none",
          description : ""
        };
        const setFunc = (old) => [...old, newRow];
        setData(setFunc);
        setOriginalData(setFunc);
      },
      removeRow: (rowIndex) => {
        const setFilterFunc = (old) =>
          old.filter((_row, index) => index !== rowIndex);
        setData(setFilterFunc);
        setOriginalData(setFilterFunc);
      },
      removeSelectedRows: (selectedRows) => {
        const setFilterFunc = (old) =>
          old.filter((_row, index) => !selectedRows.includes(index));
        setData(setFilterFunc);
        setOriginalData(setFilterFunc);
      },
    },
  });

  return (
    <article className='add_product_table_container'>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <>
                  <td key={cell.id}>
                    {/* Check if the cell type is 'image' */}
                    {cell.column.columnDef.cell.type === 'image' ? (
                      // Render image
                      <img src={cell.row.original.variantImage ? imageURL + cell.row.original.variantImage : ""} alt="Image" />
                    ) : (
                      // Render other cell data
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                </>
                // <td key={cell.id}>
                //   {flexRender(cell.column.columnDef.cell, cell.getContext())}
                // </td>

              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={table.getCenterLeafColumns().length} align="right">
              <FooterCell table={table} />
            </th>
          </tr>
        </tfoot>
      </table>
    </article>
  );
};
