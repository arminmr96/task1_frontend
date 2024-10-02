'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const CreatePostForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<string | null>(null); 
  const [frontendError, setFrontendError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (content.length < 10) {
      setFrontendError('Content must be at least 10 characters long.');
      return;
    }
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      const res = await fetch('http://localhost:8000/blog/', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        setErrors(errorData);
      } else {
        setTitle('');
        setContent('');
        setImage(null);
        setErrors(null);
        setFrontendError(null);
        router.refresh();
      }
    } catch (error) {
      setErrors('An error occurred while submitting the post.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 mb-2 w-full"
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border p-2 mb-2 w-full"
        required
      />
      {frontendError && <p className="text-red-500 mb-2">{frontendError}</p>}

      <input
        type="file"
        onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
        className="mb-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Create Post
      </button>

      {errors && (
        <div className="mt-4 text-red-500">
          {typeof errors === 'string'
            ? <p>{errors}</p>
            : Object.entries(errors).map(([field, messages]) => (
                <p key={field}>{field}: {messages as string}</p>
              ))}
        </div>
      )}
    </form>
  );
};

export default CreatePostForm;
