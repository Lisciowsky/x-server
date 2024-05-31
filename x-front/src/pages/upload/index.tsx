import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAlert } from '@/context/alert-context';
import useMediaUpload from '@/features/upload/hooks/use-upload';

const Upload = () => {
    const { showAlert } = useAlert();
    const { upload } = useMediaUpload();
    const [fileStatuses, setFileStatuses] = useState([]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setFileStatuses(acceptedFiles.map(file => ({ name: file.name, status: 'Uploading' })));

        const uploadPromises = acceptedFiles.map((file, index) => {
            return upload(file.name, file).then(result => {
                setFileStatuses(prevStatuses => {
                    const newStatuses = [...prevStatuses];
                    newStatuses[index] = { name: file.name, status: result ? 'Completed' : 'Failed' };
                    return newStatuses;
                });
                return result;
            });
        });

        await Promise.all(uploadPromises);

    }, [upload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <>
            <div className="container mx-auto flex justify-center mt-80 max-sm:mt-40">
                <div className="flex flex-col items-center justify-center p-6 border-dashed border-2 border-gray-300 rounded-lg">
                    <div {...getRootProps()} className="w-full flex flex-col items-center justify-center p-12 cursor-pointer">
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                                <p className="text-gray-500">Drop the video files here ...</p> :
                                <p className="text-gray-500">Drag 'n' drop some video files here, or click to select videos</p>
                        }
                    </div>
                    <div className="mt-4 w-full">
                        {fileStatuses.map(file => (
                            <div key={file.name} className="text-sm text-gray-600 flex justify-between items-center">
                                <span>{file.name}</span>
                                <span>{file.status === 'Uploading' ? '🔄' : file.status === 'Completed' ? '✅' : '❌'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Upload;
