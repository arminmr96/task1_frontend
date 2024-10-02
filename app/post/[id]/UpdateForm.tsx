'use client';

import React, { useState } from 'react';

interface Post {
  id: number;
  title: string;
  content: string;
}

interface UpdateFormProps {
  post: Post;
}

export default function UpdateForm({ post }: UpdateFormProps) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async () => {
    await fetch(`http://localhost:8000/post/${post.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    });
    setIsEditing(false);
  };

  return (
    <>
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
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Update Post
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="bg-green-500 text-white p-2 rounded"
        >
          Edit Post
        </button>
      )}
    </>
  );
}
