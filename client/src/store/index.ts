import logger from "redux-logger";
import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "../slices/counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
  middleware: (getDefaultMiddleware) => {
    let middleware: any = getDefaultMiddleware();
    if (process.env.NODE_ENV === "development") {
      middleware = middleware.concat(logger);
    }
    return middleware;
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
