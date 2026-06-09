import { Link } from "react-router-dom";

const BlogList = ({ blogs }) => {
  /* throw new Error('simulated error') */
  return (
    <div>
      <h1>Blogs</h1>
      <ul>
        {blogs
          .sort((firstBlog, secondBlog) => secondBlog.likes - firstBlog.likes)
          .map((blog) => (
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>
                {blog.title} {blog.author}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default BlogList;
