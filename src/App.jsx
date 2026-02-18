import { useEffect, useState } from "react";
import { message } from "antd";

function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState();
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [deleteUserLoading, setDeleteUserLoading] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      if (!res.ok) throw Error("Failed to fetch data");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      message.error("Failed to fetch data");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      if (!res.ok) throw Error("Failed to fetch posts");
      const posts = await res.json();
      setPosts(posts);
    } catch (err) {
      setError(err.message);
      message.error("Failed to fetch posts");
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/comments");
      if (!res.ok) throw Error("Failed to fetch comments");
      const comments = await res.json();
      setComments(comments);
    } catch (err) {
      setError(err.message);
      message.error("Failed to fetch comments");
    } finally {
      setLoadingComments(false);
    }
  };

  const addUser = async () => {
    setAddUserLoading(true);
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "John Deo",
          email: "john@example.com",
          phone: "+921234567890",
        }),
      });
      if (!res.ok) throw Error("Failed to fetch data");
      const newUser = await res.json();
      setUsers((prev) => [...prev, newUser]);
      message.success("User added successfully");
    } catch (err) {
      setError(err.message);
      message.error("Failed to add user");
    } finally {
      setAddUserLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setDeleteUserLoading(true);
    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) throw Error("Failed to delete user");
      setUsers((prev) => prev.filter((user) => user.id !== id));
      message.success("User deleted successfully");
    } catch (err) {
      setError(err.message);
      message.error("Failed to delete user");
    } finally {
      setDeleteUserLoading(false);
    }
  };

  const refreshUsers = async () => {
    await fetchUsers();
    message.success("Users refreshed successfully");
  }

  useEffect(() => {
    fetchUsers();
    fetchPosts();
    fetchComments();
  }, []);

  useEffect(() => {
  if (error) {
    const timer = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(timer);
  }
}, [error]);

  return (
    <div className="app-container">
      {error && <div className="error-message">{error}</div>}
      <div className="controls-section">
        <button className="btn btn-primary" onClick={addUser} disabled={addUserLoading}>
          {addUserLoading ? "Adding..." : "Add User"}
        </button>
        <button className="btn btn-secondary" onClick={refreshUsers} disabled={loadingUsers}>
          {loadingUsers ? "Loading..." : "Refresh Users"}
        </button>
      </div>
      {loadingUsers || addUserLoading || deleteUserLoading ? (
        <div className="loading">
          <span className="loading-spinner"></span>
          Loading...
        </div>
      ) : (
        users.map((user) => (
          <div className="card user-card" key={user.id}>
            <h3 className="card-title">{user.name}</h3>
            <p className="card-email">{user.email}</p>
            <p className="card-phone">{user.phone}</p>
            <p className="card-meta">Users: {users.length}</p>
            <button
              className="btn btn-danger"
              onClick={() => deleteUser(user.id)}
              disabled={deleteUserLoading}
            >
              {deleteUserLoading ? "Deleting..." : "Delete"}
            </button>
            <div className="divider"></div>
          </div>
        ))
      )}

      <h2 className="section-header">Posts</h2>
      {loadingPosts ? (
        <div className="loading">
          <span className="loading-spinner"></span>
          Loading...
        </div>
      ) : (
        posts.map((post) => (
          <div className="card post-card" key={post.id}>
            <h3 className="card-title">{post.title}</h3>
            <p className="card-text">{post.body}</p>
            <p className="card-meta">UserId: {post.userId}</p>
            <p className="card-meta">Posts: {posts.length}</p>
            <div className="divider"></div>
          </div>
        ))
      )}

      <h2 className="section-header">Comments</h2>
      {loadingComments ? (
        <div className="loading">
          <span className="loading-spinner"></span>
          Loading...
        </div>
      ) : (
        comments.map((comment) => (
          <div className="card comment-card" key={comment.id}>
            <h3 className="card-title">{comment.name}</h3>
            <p className="card-text">{comment.body}</p>
            <p className="card-email">{comment.email}</p>
            <p className="card-meta">Comments: {comments.length}</p>
            <div className="divider"></div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
