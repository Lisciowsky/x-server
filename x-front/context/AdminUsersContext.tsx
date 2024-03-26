import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/models/user';
import { fetchAllUsersInfo, UserSearchRequest, searchUser } from '@/api/auth-endpoints';
import { useAlert } from '@/context/AlertContext';

interface AdminUsersContextType {
  allUsersInfo: User[];
  setAllUsersInfo: (users: User[]) => void;
  totalUsers: number;
  page: number;
  pageSize: number;
  totalPages: number;
  refreshUserData: () => Promise<void>;
  searchUsers: (searchField: string, searchQuery: string) => Promise<void>;
  loadMoreUsers: () => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  selectedUser: User | null;
}

const AdminUsersContext = createContext<AdminUsersContextType | undefined>(undefined);

export function AdminUsersProvider({ children }: { children: ReactNode }) {
  const [allUsersInfo, setAllUsersInfo] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const { showAlert } = useAlert();

  const refreshUserData = async () => {
    try {
      const allUsersData = await fetchAllUsersInfo(page, pageSize);
      setAllUsersInfo(allUsersData.users);
      setTotalUsers(allUsersData.total_users);
      setTotalPages(Math.ceil(allUsersData.total_users / pageSize));
    } catch (error) {
      showAlert(`Failed to fetch all users info: ${error.toString()}`, "", "warning");
    }
  };

  const searchUsers = async (searchField: string, searchQuery: string) => {
    try {
      const searchRequest: UserSearchRequest = { [searchField]: searchQuery };
      const result = await searchUser(searchRequest);
      setAllUsersInfo(result);
    } catch (error) {
      showAlert(error.message, "", "warning");
    }
  };

  const loadMoreUsers = async () => {
    try {
      const nextPage = page + 1;
      const allUsersData = await fetchAllUsersInfo(nextPage, pageSize);
      setAllUsersInfo(prevUsers => [...prevUsers, ...allUsersData.users]);
      setPage(nextPage);
    } catch (error) {
      showAlert(`Failed to fetch more users info: ${error.toString()}`, "", "warning");
    }
  };

  useEffect(() => {
    refreshUserData();
  }, [page, pageSize]);

  return (
    <AdminUsersContext.Provider value={{
      allUsersInfo,
      setAllUsersInfo,
      totalUsers,
      page,
      pageSize,
      totalPages,
      refreshUserData,
      searchUsers,
      loadMoreUsers,
      selectedUser,
      setSelectedUser,
    }}>
      {children}
    </AdminUsersContext.Provider>
  );
}

export function useAdminUsers() {
  const context = useContext(AdminUsersContext);
  if (context === undefined) {
    throw new Error('useAdminUsers must be used within an AdminUsersProvider');
  }
  return context;
}
