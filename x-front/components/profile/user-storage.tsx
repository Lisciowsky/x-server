import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '../ui/breadcrumb';
import { FolderIcon, ArchiveIcon, DownloadIcon, UserRemoveIcon, FolderRemoveIcon } from '@heroicons/react/outline';
import { useDropzone, FileWithPath } from 'react-dropzone';
import { useAuth } from '@/context/AuthContext';
import { getUploadUrl, getDownloadUrl, deleteStorage } from '@/api/storage-endpoints';
import { fetchUserStorage } from '@/api/storage-endpoints';
import { useAlert } from '@/context/AlertContext';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import useEffectOnce from '@/common/hooks/use-effect-once';

const UserStorage = () => {
  const { userInfo } = useAuth();
  const { showAlert } = useAlert();

  const [storageStructure, setStorageStructure] = useState({});
  const [currentPath, setCurrentPath] = useState(`${userInfo.username}/`);
  const [uploading, setUploading] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showAddFolderInput, setShowAddFolderInput] = useState(false);

  useEffectOnce(() => {
    const fetchStorage = async () => {
      try {
        const userStorage = await fetchUserStorage(userInfo.username);
        setStorageStructure(userStorage.folders);
      } catch (error) {
        showAlert('Error', `Failed to fetch user storage: ${error.toString()}`, 'warning');
      }
    };

    if (userInfo && userInfo.username) {
      fetchStorage();
    }
  });

  const { folders, files } = useMemo(() => {
    const pathFolders = Object.keys(storageStructure).reduce((acc, path) => {
      if (path.startsWith(currentPath) && path !== currentPath) {
        const restOfPath = path.replace(currentPath, '');
        const isDirectSubfolder = !restOfPath.substring(0, restOfPath.length - 1).includes('/');
        if (isDirectSubfolder) {
          acc.push(path);
        }
      }
      return acc;
    }, []);

    const pathFiles = storageStructure[currentPath] || [];
    return { folders: pathFolders, files: pathFiles };
  }, [currentPath, storageStructure]);

  const breadcrumbParts = useMemo(() => {
    const parts = currentPath.split('/').filter(Boolean);
    return [...parts.map((part, index) => `${parts.slice(0, index + 1).join('/')}/`)];
  }, [currentPath]);

  const onDrop = async (acceptedFiles: FileWithPath[]) => {
    try {
      setUploading(true);
      await Promise.all(acceptedFiles.map((file: File) => handleFileUpload(file)));
      setUploading(false);
      showAlert('Success', 'All files uploaded successfully!', 'success');
      const userStorage = await fetchUserStorage(userInfo.username);
      setStorageStructure(userStorage.folders);
    } catch (error) {
      setUploading(false);
      showAlert('Error', 'Error uploading file.', 'warning');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileUpload = async (file) => {
    setUploading(true);
    const pathWithoutFirstElement = currentPath.split('/').slice(1).join('/');
    const filePath = `${pathWithoutFirstElement}${file.name}`;
    const { url } = await getUploadUrl(userInfo.username, filePath);
    await axios.put(url, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
    setUploading(false);
    setStorageStructure(prevStructure => {
      const updatedFiles = prevStructure[currentPath] ? [...prevStructure[currentPath], file.name] : [file.name];
      return { ...prevStructure, [currentPath]: updatedFiles };
    });
  };

  const handleFileDownload = async (filePath: string) => {
    const pathWithoutFirstElement = currentPath.split('/').slice(1).join('/');
    const fullFilePath = `${pathWithoutFirstElement}${filePath}`;
    try {
      const { url } = await getDownloadUrl(userInfo.username, fullFilePath);
      window.open(url, '_blank');
    } catch (error) {
      showAlert('Error', 'Failed to fetch download URL.', 'warning');
    }
  };

  const handleDelete = async (filePath: string) => {
    const filePathWithoutFirstElement = filePath.split('/').slice(1).join('/');
    setUploading(true);
    try {
      await deleteStorage(userInfo.username, filePathWithoutFirstElement);
      showAlert('Success', 'deleted successfully!', 'success');
      const userStorage = await fetchUserStorage(userInfo.username);
      setStorageStructure(userStorage.folders);
    } catch (error) {
      showAlert('Error', 'Error deleting item.', 'warning');
    } finally {
      setUploading(false);
    }
  };

  const handleAddFolder = () => {
    const trimmedFolderName = newFolderName.trim();
    if (!trimmedFolderName) {
      showAlert('Error', 'Folder name cannot be empty', 'warning');
      return;
    }
    const newPath = `${currentPath}${trimmedFolderName}/`;
    if (storageStructure.hasOwnProperty(newPath)) {
      showAlert('Warning', `Folder named "${trimmedFolderName}" already exists`, 'warning');
      return;
    }
    showAlert('Success', `Folder "${trimmedFolderName}" added. Please add files or the folder won't be preserved.`, 'success');
    setStorageStructure(prev => ({ ...prev, [newPath]: [] }));
    setShowAddFolderInput(false);
    setNewFolderName('');
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbParts.map((path, index) => {
            const isLast = index === breadcrumbParts.length - 1;
            return (
              <BreadcrumbItem key={path}>
                <BreadcrumbLink
                  href="#"
                  onClick={(e) => { e.preventDefault(); setCurrentPath(path); }}
                  className={`text-blue-500 hover:text-blue-600 ${isLast ? 'cursor-default' : 'cursor-pointer'}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {index === 0 ? userInfo.username : path.split('/').filter(Boolean).pop()}
                </BreadcrumbLink>
                {!isLast && <BreadcrumbSeparator />}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-4">
        {showAddFolderInput && (
          <div className="mb-4">
            <Input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="p-2 border border-gray-300 mr-2"
              placeholder="New Folder Name"
            />
            <Button onClick={handleAddFolder} className="p-2 bg-blue-500 text-white">
              Add Folder
            </Button>
          </div>
        )}
        <Button onClick={() => setShowAddFolderInput(!showAddFolderInput)} className="mb-4 p-2 bg-green-500 text-white">
          {showAddFolderInput ? 'Cancel' : 'New Folder'}
        </Button>
        {folders.map((folderPath) => (
          <div key={folderPath} className="flex justify-between items-center p-2">
            <Button
              key={folderPath}
              onClick={() => setCurrentPath(folderPath)}
              className="shadow-none flex items-center cursor-pointer p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            >
              <FolderIcon className="h-6 w-6 mr-2 text-yellow-500" />
              <span>{folderPath.split('/').filter(Boolean).pop()}</span>
            </Button>
            <Button onClick={() => handleDelete(folderPath, true)} className="p-1">
              <FolderRemoveIcon className="h-5 w-5 text-red-500" />
            </Button>
          </div>
        ))}
        {files.map((filePath) => (
          <div key={filePath} className="flex items-center p-2 text-md justify-between">
            <div className="flex items-center">
              <ArchiveIcon className="h-6 w-6 mr-2 text-green-500" />
              <span>{filePath}</span>
            </div>
            <div className='flex space-x-2'>
              <Button onClick={() => handleFileDownload(filePath)} className="flex items-center text-blue-500 hover:text-blue-600">
                <DownloadIcon className="h-5 w-5" />
              </Button>
              <Button onClick={() => handleDelete(`${currentPath}${filePath}`)} className="p-1">
                <UserRemoveIcon className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
        <div {...getRootProps()} className="p-6 border-dashed border-2 border-gray-300 text-center cursor-pointer mt-4">
          <Input {...getInputProps()} disabled={uploading} />
          {isDragActive ? (
            <p>Drop the files here to upload to {currentPath}</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files to upload to {currentPath}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserStorage;
