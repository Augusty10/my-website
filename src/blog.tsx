import { useEffect, useState } from "react";

interface Blog {
  title: string;
  link: string;
  pubDate: string;
  thumbnail?: string;
  description: string;
}

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadBlogs() {
    try {
      const response = await fetch(
        "https://api.rss2json.com/v1/api.json?rss_url=https://blog.dhanrajsahu.com/rss.xml"
      );

      const data = await response.json();

      console.log("Response:", response.status);
      console.log("RSS Data:", data);

      if (data.status !== "ok") {
        throw new Error(data.message);
      }

      setBlogs(data.items?.slice(0, 6) || []);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }

  loadBlogs();
}, []);

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
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-lg">Loading blogs...</p>
      )}

      {/* Empty State */}
      {!loading && blogs.length === 0 && (
        <p>No blogs found.</p>
      )}

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
            {blog.thumbnail && (
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-52 object-cover"
              />
            )}

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
              <p
                className="text-gray-600 text-sm line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: blog.description,
                }}
              />

              <span className="inline-block mt-5 text-sm uppercase tracking-widest text-rust">
                Read Article →
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
