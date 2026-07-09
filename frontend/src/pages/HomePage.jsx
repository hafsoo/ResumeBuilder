import React, { useState } from "react";
import Hero from "../components/Hero";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import CreateResumeModal from "../components/CreateResumeModal";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import GetHiredBanner from "../components/GetHiredBanner";
import Footer from "../components/Footer";

function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <Hero
        onCreateClick={() => setModalOpen(true)}
        onViewClick={() => navigate("/dashboard")}
      />
      <HowItWorks/>
      <Testimonials/>
      <GetHiredBanner/>
      <Footer/>
      <CreateResumeModal open={modalOpen} onClose={() => setModalOpen(false)} />
      
    </div>
  );
}

export default HomePage;
