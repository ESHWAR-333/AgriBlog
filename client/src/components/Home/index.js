import React, { useEffect, useState } from "react";
import Blog from "../Blog";

function Home() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("https://agriblog-backend.onrender.com/post").then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);
  return <>{posts.length > 0 && posts.map((each) => <Blog {...each} />)}</>;
}

export default Home;
