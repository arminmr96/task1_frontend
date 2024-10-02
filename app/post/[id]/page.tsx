import React from 'react';
import { Post } from '../../blog/types';
import PostActions from './PostActions';

async function getPost(id: string): Promise<Post> {
  const res = await fetch(`http://localhost:8000/post/${id}/`);
  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }
  return res.json();
}

interface Params {
  id: string;
}

interface PostPageProps {
  params: Params;
}

export const metadata = {
  title: "Post",
  description: "About the post",
  meta: [
    { httpEquiv: 'cache-control', content: 'no-cache' },
    { httpEquiv: 'expires', content: '0' },
    { httpEquiv: 'pragma', content: 'no-cache' },
  ],
};

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-6 rounded-lg shadow-lg mb-8">
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      </header>

      <div className="bg-white rounded-lg shadow-md p-6">
        {post.image && (
          <img
            src={`http://localhost:8000${post.image}`}
            alt={post.title}
            className="w-80 h-auto mb-6 rounded-md object-cover mx-auto"
          />
        )}

        <article className="prose lg:prose-xl mx-auto text-gray-800">
          <p>{post.content}</p>
        </article>
      </div>

      <footer className="mt-12 text-center">
        <PostActions
          postId={params.id}
          initialTitle={post.title}
          initialContent={post.content}
          imageUrl={`http://localhost:8000${post.image}`}
        />
      </footer>
    </div>
  );
}
