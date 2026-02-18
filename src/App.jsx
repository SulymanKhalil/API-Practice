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
    <div>
      {error && <p>{error}</p>}
      <button onClick={addUser} disabled={addUserLoading}>
        {addUserLoading ? "Adding..." : "Add User"}
      </button>
      <button onClick={refreshUsers} disabled={loadingUsers}>
        {loadingUsers ? "Loading..." : "Refresh Users"}
      </button>
      {loadingUsers || addUserLoading || deleteUserLoading ? (
        <p>Loading...</p>
      ) : (
        users.map((user) => (
          <div key={user.id}>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p>{user.phone}</p>
            <p>Users: {users.length}</p>
            <button
              onClick={() => deleteUser(user.id)}
              disabled={deleteUserLoading}
            >
              {deleteUserLoading ? "Deleting..." : "Delete"}
            </button>
            <hr />
          </div>
        ))
      )}

      <h2>Posts</h2>
      {loadingPosts ? (
        <p>Loading...</p>
      ) : (
        posts.map((post) => (
          <div key={post.id}>
            <p>{post.title}</p>
            <p>{post.body}</p>
            <p>UserId: {post.userId}</p>
            <p>Posts: {posts.length}</p>
            <hr />
          </div>
        ))
      )}

      <h2>Comments</h2>
      {loadingComments ? (
        <p>Loading...</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id}>
            <p>
              <strong>{comment.name}</strong>
            </p>
            <p>{comment.body}</p>
            <p>{comment.email}</p>
            <p>Comments: {comments.length}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default App;
