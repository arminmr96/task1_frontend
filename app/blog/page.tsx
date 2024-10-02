import { Post } from './types';
import CreatePostForm from './CreatePostForm';
import Link from 'next/link';
import Head from 'next/head';

async function getPosts(): Promise<Post[]> {
  const res = await fetch('http://localhost:8000/blog/', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  return res.json();
}

export const metadata = {
  title: "Blog",
  description: "About my blog",
  meta: [
    { httpEquiv: 'cache-control', content: 'no-cache' },
    { httpEquiv: 'expires', content: '0' },
    { httpEquiv: 'pragma', content: 'no-cache' },
  ],
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-center py-6 rounded-lg shadow-lg mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to the Blog</h1>
        <p className="text-xl opacity-75">Discover amazing posts from various authors</p>
      </header>

      <div className="mb-12">
        <CreatePostForm />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h2>
              
              {post.image && (
                <img
                  src={`http://localhost:8000${post.image}?t=${new Date().getTime()}`}
                  alt={post.title}
                  className="w-full object-cover mb-4 rounded-md"
                />
              )}
              
              <Link href={`/post/${post.id}`} className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                View Post
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
