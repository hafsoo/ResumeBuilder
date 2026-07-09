import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user";
import { resumeReducer } from "./reducers/resume";

const Store = configureStore({
  reducer: {
    user: userReducer,
     resume: resumeReducer,
   

  },
});
export default Store;
