import axios from "axios";
import { server } from "../../server";

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadUserRequest" });

    const { data } = await axios.get(`${server}/user/getuser`, {
      withCredentials: true,
    });

    dispatch({ type: "LoadUserSuccess", payload: data.user });
  } catch (error) {
    dispatch({
      type: "LoadUserFail",
      payload: error.response?.data?.message,
    });
  }
};

export const logoutUser = () => async (dispatch) => {
  await axios.get(`${server}/user/logout`, { withCredentials: true });
  dispatch({ type: "LogoutSuccess" });
};