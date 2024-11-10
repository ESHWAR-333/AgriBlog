import "./App.css";
import Home from "./components/Home";
import Layout from "./Layout";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Registration from "./components/Registration";
import CreatePost from "./components/CreatePost";
import Post from "./components/PostPage";
import EditPost from "./components/EditPost";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/edit/:id" element={<EditPost />} />
      </Route>
    </Routes>
  );
}

export default App;
