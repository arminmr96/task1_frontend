'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PostActionsProps {
  postId: string;
  initialTitle: string;
  initialContent: string;
  imageUrl: string | null;
}

async function deletePost(id: string) {
  const res = await fetch(`http://localhost:8000/post/${id}/`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error('Failed to delete post');
  }
}

async function updatePost(id: string, updatedData: { title: string; content: string; image?: File | null }) {
  const formData = new FormData();
  formData.append('title', updatedData.title);
  formData.append('content', updatedData.content);
  if (updatedData.image) formData.append('image', updatedData.image);

  const res = await fetch(`http://localhost:8000/post/${id}/`, {
    method: 'PUT',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw errorData;
  }
}

const PostActions: React.FC<PostActionsProps> = ({ postId, initialTitle, initialContent, imageUrl }) => {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<string | null>(null);
  const [frontendError, setFrontendError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      await deletePost(postId);
      router.push('/blog');
    } catch (error) {
      setErrors('An error occurred while deleting the post.');
    }
  };

  const handleUpdate = async () => {
    if (content.length < 10) {
      setFrontendError('Content must be at least 10 characters long.');
      return;
    }

    try {
      await updatePost(postId, { title, content, image: selectedImage });
      setIsEditing(false);
      setErrors(null); 
      setFrontendError(null);
      window.location.href = window.location.href;
    } catch (error) {
      setErrors('An error occurred while updating the post.');
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="file"
            onChange={(e) => setSelectedImage(e.target.files ? e.target.files[0] : null)}
            className="mb-2"
          />
          <button onClick={handleUpdate} className="bg-blue-500 text-white p-2 rounded">
            Update Post
          </button>

          {frontendError && <p className="text-red-500 mb-2">{frontendError}</p>}

          {errors && <p className="text-red-500 mb-2">{errors}</p>}
        </div>
      ) : (
        <>
          <button onClick={() => setIsEditing(!isEditing)} className="bg-green-500 text-white p-2 rounded">
            {isEditing ? 'Cancel' : 'Edit Post'}
          </button>
          <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded">
            Delete Post
          </button>

          {errors && <p className="text-red-500 mb-2">{errors}</p>}
        </>
      )}
    </div>
  );
};

export default PostActions;
