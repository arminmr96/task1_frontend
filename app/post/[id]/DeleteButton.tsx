'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

interface DeleteButtonProps {
  postId: string;
}

export default function DeleteButton({ postId }: DeleteButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    await fetch(`http://localhost:8000/post/${postId}/`, {
      method: 'DELETE',
    });
    router.push('/blog');
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white p-2 rounded"
    >
      Delete Post
    </button>
  );
}
