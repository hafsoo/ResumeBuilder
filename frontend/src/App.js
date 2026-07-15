import "./App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SignupPage,
  LoginPage,
  HomePage,
  Profile,
  ResumeForm,
  ResumeDashboard,
  ResumePreview,
  AdminDashboard,
  EditorPage,
  ATSChecker,
} from "./routes/Routes";
import { useDispatch } from "react-redux";
import { loadUser } from "./redux/actions/user";

import { ResumeProvider } from "./context/ResumeContext";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  return (
    <ResumeProvider>
      <BrowserRouter>
        <Routes>
          {/**User Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/resume/:id/edit" element={<ResumeForm />} />
          <Route path="/dashboard" element={<ResumeDashboard />} />
          <Route path="/resume/:id/preview" element={<ResumePreview />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/editor/:templateId" element={<EditorPage />} />

          <Route path="/ats-checker" element={<ATSChecker/>} />
        </Routes>

        <ToastContainer
          //position="bottom-center"
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          //theme="dark"
        />
      </BrowserRouter>
    </ResumeProvider>
  );
}

export default App;
