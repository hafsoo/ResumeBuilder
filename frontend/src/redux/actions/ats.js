import axios from "axios";
import { server } from "../../server";

export const analyzeResumePdf = (resumeFileBase64) => async () => {
  const { data } = await axios.post(
    `${server}/ats/analyze`,
    { resumeFile: resumeFileBase64 },
    { withCredentials: true }
  );
  return data;
};