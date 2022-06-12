import logger from "redux-logger";
import ThunkMiddleware from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";

import documentReducer from "../slices/documentSlice";
import storeReducer from "../slices/storeSlice";
import userReducer from "../slices/userSlice";

export const store = configureStore({
  reducer: {
    document: documentReducer,
    store: storeReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => {
    let middleware = getDefaultMiddleware();
    middleware.concat(ThunkMiddleware);
    if (process.env.NODE_ENV === "development") {
      middleware.concat(logger);
    }
    return middleware;
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
