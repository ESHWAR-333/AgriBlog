import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import "./index.css";
import Editor from "../Editor";

function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setDirect] = useState("");

  useEffect(() => {
    fetch("https://agriblog-backend.onrender.com/post/" + id).then(
      (response) => {
        response.json().then((postInfo) => {
          console.log(postInfo);
          setTitle(postInfo.title);
          setContent(postInfo.content);
          setSummary(postInfo.summary);
        });
      }
    );
  }, []);

  const updatePost = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);
    if (files?.[0]) {
      data.set("file", files?.[0]);
    }
    const response = await fetch("https://agriblog-backend.onrender.com/post", {
      method: "PUT",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setDirect(true);
    }
  };

  if (redirect) {
    return <Navigate to={"/post/" + id} />;
  }
  return (
    <form onSubmit={updatePost}>
      <input
        type="title"
        placeholder={"Title"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="summary"
        placeholder={"Summary"}
        onChange={(e) => setSummary(e.target.value)}
        value={summary}
      />
      <input type="file" onChange={(e) => setFiles(e.target.files)} />
      <Editor onChange={setContent} value={content} />
      <button>Update Post</button>
    </form>
  );
}

export default EditPost;
