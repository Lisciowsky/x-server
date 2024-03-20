import React from 'react';
import { useReactTable, ColumnDef, getCoreRowModel, flexRender } from '@tanstack/react-table';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'; // Adjust the import path as needed
import { AllUsers } from '@/models/user';

// Define the structure of your data for TypeScript
interface TableData extends AllUsers {}

// Define your columns
const columns: ColumnDef<TableData>[] = [
  {
    id: 'rowIndex', // Custom ID for the index column
    header: () => '#', // Header label
    cell: (info) => info.row.index + 1, // Display row index starting from 1
  },
  {
    accessorKey: 'username',
    header: 'Username',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'full_name',
    header: 'Full Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'is_email_verified',
    header: 'Email Verified',
    cell: info => info.getValue() ? 'Yes' : 'No',
  },
  {
    accessorKey: 'password_changed_at',
    header: 'Password Changed At',
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
  },
];

interface AllUsersComponentProps {
  allUsersInfo: AllUsers[];
  onSelectUser: (user: AllUsers) => void;
}
// The component
const AllUsersComponent: React.FC<AllUsersComponentProps> = ({ allUsersInfo, onSelectUser}) => {
  const table = useReactTable({
    data: allUsersInfo,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto text-black cursor-pointer">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow className="hover:bg-cultured" key={row.original.username} onClick={() => onSelectUser(row.original)}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllUsersComponent;
