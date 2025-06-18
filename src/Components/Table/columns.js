import { createColumnHelper } from '@tanstack/react-table';
import { TableCell } from './TableCell';
import { EditCell } from './EditCell';
import { EditPrices } from './EditPrices';

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor('variantCode', {
    header: 'Bar Code',
    cell: TableCell,
    meta: {
      type: 'text',
      required: true,
    },
  }),
  columnHelper.accessor('variantImage', {
    header: 'Variant Image',
    cell: TableCell,
    meta: {
      type: 'file',
      required: true
    },
  }),
  columnHelper.accessor('variantName', {
    header: 'Name',
    cell: TableCell,
    meta: {
      type: 'text',
      required: true,
    },
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: TableCell,
    meta: {
      type: 'textarea',
      required: true,
    },
  }),
  columnHelper.accessor('vol', {
    header: 'Vol.',
    cell: TableCell,
    meta: {
      type: 'text',
      required: false,
    },
  }),
  columnHelper.accessor('alcohol_percentage', {
    header: 'Alcohol Percentage',
    cell: TableCell,
    meta: {
      type: 'number',
      required: false,
    },
  }),
  // columnHelper.accessor('sellingPrice', {
  //   header: 'Selling Price',
  //   cell: TableCell,
  //   meta: {
  //     type: 'number',
  //     required: true,
  //   },
  // }),
  columnHelper.accessor('purchasePrice', {
    header: 'Purchase Price',
    cell: TableCell,
    meta: {
      type: 'number',
      required: true,
    },
  }),
  columnHelper.accessor('quantity', {
    header: 'Quantity',
    cell: TableCell,
    meta: {
      type: 'number',
      required: true,
    },
  }),

  // columnHelper.accessor('discount', {
  //   header: 'Discount',
  //   cell: TableCell,
  //   meta: {
  //     type: 'number',
  //     required: false,
  //   },
  // }),

  
  // columnHelper.accessor('finalSellingPrice', {
  //   header: 'Final Selling Price',
  //   cell: ({ row }) => {
  //     const purchasePrice = parseFloat(row.original.purchasePrice) || 0;
  //     const sellingPrice = parseFloat(row.original.sellingPrice) || 0;
  //     const discount = parseFloat(row.original.discount) || 0;
  //     const quantity = parseFloat(row.original.quantity) || 1;

  //     // Calculate the total cost based on the purchase price and quantity
  //     const totalCost = purchasePrice * quantity;

  //     // Calculate the total discount based on the discount and quantity
  //     const totalDiscount = discount
  //     //  * quantity;

  //     // Calculate the final selling price considering the selling price
  //     const finalSellingPrice = (sellingPrice) - totalDiscount;

  //     return <div>{!isNaN(finalSellingPrice) ? finalSellingPrice : 0}</div>;
  //   },
  //   // cell: TableCell,
  //   // meta: {
  //   //   type: 'number',
  //   // },
  // }),


  // columnHelper.accessor('profit', {
  //   header: 'Profit',
  //   cell: TableCell,
  //   meta: {
  //     type: 'number',
  //     required: false,
  //   },
  // }),
  columnHelper.display({
    header: 'Store Prices',
    id: 'edit',
    cell: EditPrices,
  }),
  columnHelper.accessor('label', {
    header: 'Label',
    cell: TableCell,
    meta: {
      type: 'select',
      options: [
        { value: "hot", label: "HOT" },
        { value: "bestseller", label: "BESTSELLER" },
        { value: "new", label: "NEW" },
        { value: "none", label: "NONE" },
      ],
      required: false
    },
  }),
  columnHelper.accessor('isTopSellingProduct', {
    header: 'Top Selling Product',
    cell: TableCell,
    meta: {
      type: 'checkbox',
      required: false,
    },
  }),
  columnHelper.accessor('status', {
    header: 'Active',
    cell: TableCell,
    meta: {
      type: 'checkbox',
      required: false,
    },
  }),

  // columnHelper.display({
  //   id: 'isTopSellingProduct',
  //   cell: props => <p>hello</p>,
  // }),
  columnHelper.display({
    header: 'Action',
    id: 'edit',
    cell: EditCell,
  }),
];

// export const priceColumns = [
//   columnHelper.accessor('sellingPrice', {
//     header: 'Selling Price',
//     cell: TableCell,
//     meta: {
//       type: 'number',
//       required: true,
//     },
//   }),
//   columnHelper.accessor('discount', {
//     header: 'Discount',
//     cell: TableCell,
//     meta: {
//       type: 'number',
//       required: false,
//     },
//   }),
//   columnHelper.accessor('finalSellingPrice', {
//     header: 'Final Selling Price',
//     cell: ({ row }) => {
//       const purchasePrice = parseFloat(row.original.purchasePrice) || 0;
//       const sellingPrice = parseFloat(row.original.sellingPrice) || 0;
//       const discount = parseFloat(row.original.discount) || 0;
//       const quantity = parseFloat(row.original.quantity) || 1;

//       // Calculate the total cost based on the purchase price and quantity
//       const totalCost = purchasePrice * quantity;

//       // Calculate the total discount based on the discount and quantity
//       const totalDiscount = discount
//       //  * quantity;

//       // Calculate the final selling price considering the selling price
//       const finalSellingPrice = (sellingPrice) - totalDiscount;

//       return <div>{!isNaN(finalSellingPrice) ? finalSellingPrice : 0}</div>;
//     },
//     // cell: TableCell,
//     // meta: {
//     //   type: 'number',
//     // },
//   }),
// ];
