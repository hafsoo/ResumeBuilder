import axios from "axios";
import { server } from "../../server";

export const loadResumes = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadResumesRequest" });
    const { data } = await axios.get(`${server}/resume`, {
      withCredentials: true,
    });
    dispatch({ type: "LoadResumesSuccess", payload: data.resumes });
  } catch (error) {
    dispatch({
      type: "LoadResumesFail",
      payload: error.response?.data?.message,
    });
  }
};

export const loadSingleResume = (id) => async (dispatch) => {
  const { data } = await axios.get(`${server}/resume/${id}`, {
    withCredentials: true,
  });
  dispatch({ type: "LoadSingleResumeSuccess", payload: data.resume });
  return data.resume;
};

export const createResume = (resumeName) => async (dispatch) => {
  const { data } = await axios.post(
    `${server}/resume/create`,
    { resumeName },
    { withCredentials: true }
  );
  dispatch({ type: "CreateResumeSuccess", payload: data.resume });
  return data.resume; // caller navigates using data.resume._id
};

export const updateResume = (id, formData) => async (dispatch) => {
  const { data } = await axios.put(`${server}/resume/${id}`, formData, {
    withCredentials: true,
  });
  dispatch({ type: "UpdateResumeSuccess", payload: data.resume });
  return data.resume;
};

// NEW: upload/replace this resume's own photo
export const updateResumeAvatar = (id, avatarBase64) => async (dispatch) => {
  const { data } = await axios.put(
    `${server}/resume/${id}/update-avatar`,
    { avatar: avatarBase64 },
    { withCredentials: true }
  );
  dispatch({ type: "UpdateResumeSuccess", payload: data.resume });
  return data.resume;
};


export const deleteResume = (id) => async (dispatch) => {
  await axios.delete(`${server}/resume/${id}`, { withCredentials: true });
  dispatch({ type: "DeleteResumeSuccess", payload: id });
};