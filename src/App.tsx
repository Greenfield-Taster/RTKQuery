import React, { useState, useEffect } from "react";
import "./App.css";
import {
  useGetPostsQuery,
  useAddPostMutation,
  useDeletePostMutation,
  useEditPostMutation,
  PostSchema,
} from "./redux/slice";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
} from "@mui/material";
import { useInView } from "react-intersection-observer";

function App() {
  const [start, setStart] = useState(0);
  const [allPosts, setAllPosts] = useState<PostSchema[]>([]);
  const { data, error, isLoading, isFetching } = useGetPostsQuery({
    start,
    limit: 5,
  });

  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostBody, setNewPostBody] = useState("");

  const [addPost] = useAddPostMutation();
  const [editPost] = useEditPostMutation();
  const [deletePost] = useDeletePostMutation();

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (data) {
      setAllPosts((prevPosts) => [...prevPosts, ...data]);
    }
  }, [data]);

  useEffect(() => {
    if (inView && !isFetching) {
      setStart((prevStart) => prevStart + 5);
    }
  }, [inView, isFetching]);

  const handleAddPost = async () => {
    try {
      const newPost = await addPost({
        userId: 1,
        title: newPostTitle,
        body: newPostBody,
      }).unwrap();

      setAllPosts((prevPosts) => [newPost, ...prevPosts]);
      setNewPostTitle("");
      setNewPostBody("");
    } catch (err) {
      console.error("Failed to add post", err);
    }
  };

  const handleEditPost = async (id: number) => {
    try {
      await editPost({
        id,
        post: { title: "Updated Title", body: "Updated body content" },
      }).unwrap();
    } catch (err) {
      console.error("Failed to edit post", err);
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      await deletePost(id).unwrap();
      setAllPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <div>
        <Container>
          <TextField
            name="title"
            label="Title"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            name="body"
            label="Body"
            multiline
            rows={4}
            value={newPostBody}
            onChange={(e) => setNewPostBody(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button onClick={handleAddPost} variant="contained" color="primary">
            Add Post
          </Button>
        </Container>
      </div>

      {allPosts.map((post, index) => (
        <Container sx={{ border: 1, mt: 2 }} key={post.id}>
          <Typography variant="h1">
            <Box
              sx={{
                pt: 4,
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <Paper elevation={3}>
                <>
                  <Typography variant="h2">{post.title}</Typography>
                  <Typography sx={{ mt: 2 }} variant="h3">
                    {post.body}
                  </Typography>
                </>
              </Paper>
            </Box>
            <Button onClick={() => handleEditPost(post.id)} variant="text">
              Edit
            </Button>
            <Button
              onClick={() => handleDeletePost(post.id)}
              variant="text"
              color="secondary"
            >
              Delete
            </Button>
          </Typography>
          {index === allPosts.length - 1 && <div ref={ref} />}
        </Container>
      ))}
      {isFetching && <div>Loading more posts...</div>}
    </div>
  );
}

export default App;
