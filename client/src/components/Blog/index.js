import React from "react";
import "./index.css";
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

function Blog({ _id, title, summary, content, cover, createdAt, author }) {
  return (
    <div className="post">
      <div className="image-container">
        <Link to={`/post/${_id}`}>
          <img src={`https://agriblog-backend.onrender.com/${cover}`} alt="" />
        </Link>
      </div>

      <div className="content-text-container">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>

        <p className="info">
          <a className="author" href="/">
            {author.username}
          </a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}

export default Blog;
