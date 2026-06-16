import { useEffect, useState } from "react";
export default function Blog() {
  const blogs = [
    {
      title: "JWT Authentication: Access Token and Refresh Token",
      link: "https://blog.dhanrajsahu.com/jwt-authentication-access-token-and-refresh-token-flow-explained?utm_source=hashnode&utm_medium=feed",
      pubDate: "2026-05-16",
      description:
        "In today's interconnected digital landscape, secure and seamless user authentication is paramount. Behind every successful login and persistent session lies a sophisticated interplay of cryptographic tokens.",
      thumbnail:
        "/thumbnail.png",
    },
   
  ];

  return (
    <section
      id="blog"
      className="px-6 md:px-14 py-24 bg-cream"
    >
      {/* Heading */}
      <div className="mb-14">
        <div className="text-[0.65rem] tracking-[0.2em] uppercase text-rust mb-3">
          03
        </div>

        <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-none tracking-tight">
          Latest <em className="italic text-rust">Blogs</em>
        </h2>

        <p className="mt-4 max-w-2xl text-gray-600">
          I share my journey in Full Stack Development, JavaScript, React,
          project building, and continuous learning.
        </p>
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog, index) => (
          <a
            key={index}
            href={blog.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white border border-black/10 overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
          >
            {/* Thumbnail */}
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-52 object-cover"
            />

            <div className="p-6">
              {/* Date */}
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
                {new Date(blog.pubDate).toLocaleDateString()}
              </p>

              {/* Title */}
              <h3 className="font-serif text-2xl font-bold mb-4 group-hover:text-rust transition-colors">
                {blog.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm line-clamp-3">
                {blog.description}
              </p>

              <span className="inline-block mt-5 text-sm uppercase tracking-widest text-rust">
                Read Article →
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* View All Blogs Button */}
      <div className="mt-12 text-center">
        <a
          href="https://blog.dhanrajsahu.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-8 py-3 border-2 border-black font-medium hover:bg-black hover:text-white transition-all duration-300"
        >
          View All Blogs
        </a>
      </div>
    </section>
  );
}