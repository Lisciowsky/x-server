import React from 'react';
import { useReactTable, ColumnDef, getCoreRowModel, flexRender } from '@tanstack/react-table';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { User } from '@/models/user';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '../ui/hover-card';

interface TableData extends User { }

const columns: ColumnDef<TableData>[] = [
  {
    id: 'rowIndex',
    header: () => '#',
    cell: (info) => info.row.index + 1,
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
  // {
  //   accessorKey: 'is_email_verified',
  //   header: 'Email Verified',
  //   cell: info => info.getValue() ? 'Yes' : 'No',
  // },
  // {
  //   accessorKey: 'password_changed_at',
  //   header: 'Password Changed At',
  // },
  // {
  //   accessorKey: 'created_at',
  //   header: 'Created At',
  // },
];

interface AllUsersComponentProps {
  allUsersInfo: User[];
  onSelectUser: (user: User) => void;
}

const AllUsersComponent: React.FC<AllUsersComponentProps> = ({ allUsersInfo, onSelectUser }) => {
  const table = useReactTable({
    data: allUsersInfo,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const renderHoverCardContent = (user: User) => (
    <div className='opacity-100'>
      <p>created_at: {user.created_at}</p>
    </div>
  );

  return (
    <div className="overflow-x-auto text-black">
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
        <TableBody className='cursor-pointer'>
          {table.getRowModel().rows.map(row => (
            <HoverCard key={row.original.username}>
              <HoverCardTrigger asChild>
                <TableRow className="hover:bg-cultured" onClick={() => onSelectUser(row.original)}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              </HoverCardTrigger>
              <HoverCardContent className='bg-black text-white rounded-2xl'>
                {renderHoverCardContent(row.original)}
              </HoverCardContent>
            </HoverCard>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default AllUsersComponent;
