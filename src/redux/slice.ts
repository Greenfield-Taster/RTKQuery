import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface PostSchema {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/",
  }),
  endpoints: (builder) => ({
    getPosts: builder.query<PostSchema[], { start: number; limit: number }>({
      query: ({ start, limit }) => `/posts?_start=${start}&_limit=${limit}`,
    }),
    addPost: builder.mutation<PostSchema, Partial<PostSchema>>({
      query: (newPost) => ({
        url: "/posts",
        method: "POST",
        body: newPost,
      }),
    }),
    editPost: builder.mutation<
      PostSchema,
      { id: number; post: Partial<PostSchema> }
    >({
      query: ({ id, post }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        body: post,
      }),
    }),
    deletePost: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetPostsQuery,
  useAddPostMutation,
  useDeletePostMutation,
  useEditPostMutation,
} = postApi;
