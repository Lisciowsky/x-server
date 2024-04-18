import React, { FormEvent } from 'react';
import { useReactTable, ColumnDef, getCoreRowModel, flexRender } from '@tanstack/react-table';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/common/components/ui/table';

import { User } from '@/models/user';
import { UpdateUserResponse } from '@/models/admin-responses';

import useEffectOnce from '@/common/hooks/use-effect-once';

import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/common/components/ui/hover-card';
import { Sheet, SheetTrigger, SheetContent } from '@/common/components/ui/sheet';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';

import { useAlert } from '@/context/alert-context';
import { useAdminUsers } from '@/features/profile/context/admin-users-context';

import EditRoleComponent from '@/features/profile/components/edit-admin';

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
  }
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
    <div className="overflow-x-auto text-black rounded-md p-2">
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

const AdminAllUsers = () => {
  const { showAlert } = useAlert();

  const searchFields = [
    { label: "Username", value: "username" },
    { label: "Email", value: "email" },
    { label: "Fullname", value: "fullname" },
    { label: "Role", value: "role" },
  ];

  const [showSheet, setShowSheet] = React.useState(false);
  const [searchField, setSearchField] = React.useState(searchFields[0].value);
  const [searchQuery, setSearchQuery] = React.useState("");

  const {
    allUsersInfo,
    refreshUserData,
    setAllUsersInfo,
    selectedUser,
    setSelectedUser,
    searchUsers,
    loadMoreUsers,
    totalUsers
  } = useAdminUsers();

  useEffectOnce(() => {
    refreshUserData()
  })


  const onUpdateRoleHandler = (updatedUserResponse: UpdateUserResponse) => {
    const userIndex = allUsersInfo.findIndex(user => user.username === updatedUserResponse.username);
    if (userIndex !== -1) {
      const updatedUser = {
        ...allUsersInfo[userIndex],
        role: updatedUserResponse.role,
      };

      const updatedUsersInfo = [
        ...allUsersInfo.slice(0, userIndex),
        updatedUser,
        ...allUsersInfo.slice(userIndex + 1),
      ];

      setAllUsersInfo(updatedUsersInfo);
    }
  };

  const handleSearchChange = (e) => {
    console.log(e.target.value)
    e.preventDefault()
    setSearchQuery(e.target.value)
  }

  const handleSearchSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await searchUsers(searchField, searchQuery);
    } catch (error) {
      showAlert(error.message, "", "warning");
    }
  };

  const handleResetClicked = (e) => {
    e.preventDefault();
    try {
      refreshUserData()
    } catch (error) {
      showAlert(error.message, "", "warning");
    }
  };

  return <>
    <div className="flex flex-col gap-4 mb-4">
      <div className=''>
        <form onSubmit={handleSearchSubmit} className="flex gap-4">
          <select
            className="rounded-md border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            {searchFields.map((field) => (
              <option key={field.value} value={field.value}>{field.label}</option>
            ))}
          </select>
          <Input
            className="p-2 border-none"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
          />
          <div className='max-sm:grid max-sm:grid-flow-row md:flex'>
          <Button className="shadow-sm hover:shadow-md" type="submit">Search</Button>
          <Button className="shadow-sm hover:shadow-md" type="button" onClick={handleResetClicked}>Reset</Button>
          </div>
        </form>
      </div>
      <AllUsersComponent allUsersInfo={allUsersInfo} onSelectUser={(user) => { setSelectedUser(user); setShowSheet(true); }} />
      {allUsersInfo.length < totalUsers && !searchQuery.length && (
        <Button onClick={loadMoreUsers} className="container mx-auto mt-5">Load More</Button>
      )}
    </div>
    {
      showSheet && selectedUser && (
        <Sheet open={showSheet} onOpenChange={setShowSheet}>
          <SheetTrigger asChild>
            <Button>Edit Role and Password</Button>
          </SheetTrigger>
          <SheetContent>
            <EditRoleComponent user={selectedUser} onCancel={() => setShowSheet(false)} onRoleUpdate={onUpdateRoleHandler} />
          </SheetContent>
        </Sheet>
      )
    }
  </>
}

export default AdminAllUsers