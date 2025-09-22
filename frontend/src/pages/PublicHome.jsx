"use client";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/authSlice"; // Clear auth state on visit
import "./PublicHome.css";
import { BookOpen, Code, Cpu, Layers, Wrench, Sparkles, Play, Globe, Terminal } from "lucide-react";

const PublicHome = () => {
  const [typingIndex, setTypingIndex] = useState(0);
  const [typingText, setTypingText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Clear auth state on mount
  useEffect(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const typingTexts = ["JavaScript", "Python", "C++", "React", "Node.js"];
  const typingSpeed = isDeleting ? 50 : 100;
  const pauseTime = 1500;

  // Floating skills
  const floatingSkills = [
    { name: "JavaScript", icon: Code, top: "10%", left: "10%" },
    { name: "Python", icon: Cpu, top: "20%", right: "10%" },
    { name: "C++", icon: Terminal, bottom: "20%", left: "20%" },
    { name: "React", icon: Layers, bottom: "10%", right: "20%" }
  ];

  // Skill cards
  const skillCards = [
    {
      title: "Python Development",
      img: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
      description: "Learn Python programming, data manipulation, and automation.",
      level: "Beginner",
      projects: "8 Projects",
      icon: Cpu
    },
    {
      title: "Java Development",
      img: "https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg",
      description: "Build robust Java applications and object-oriented projects.",
      level: "Intermediate",
      projects: "6 Projects",
      icon: Code
    },
    {
      title: "C++ Programming",
      img: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg",
      description: "Master C++ for problem solving, DSA, and system-level programming.",
      level: "Intermediate",
      projects: "7 Projects",
      icon: Terminal
    },
    {
      title: "Full-Stack Development",
      img: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
      description: "Work with frontend (React, Bootstrap) and backend (Node.js, Express, MongoDB).",
      level: "Advanced",
      projects: "10 Projects",
      icon: Layers
    }
  ];

  // Typing effect
  useEffect(() => {
    const handleTyping = () => {
      const current = typingIndex % typingTexts.length;
      const fullText = typingTexts[current];

      if (isDeleting) setTypingText(fullText.substring(0, typingText.length - 1));
      else setTypingText(fullText.substring(0, typingText.length + 1));

      if (!isDeleting && typingText === fullText) setTimeout(() => setIsDeleting(true), pauseTime);
      else if (isDeleting && typingText === "") {
        setIsDeleting(false);
        setTypingIndex(prev => prev + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [typingText, isDeleting, typingIndex]);

  // Auto-scroll carousel
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let scrollPos = 0;
    const speed = 1;
    const animate = () => {
      scrollPos += speed;
      if (scrollPos >= carousel.scrollWidth - carousel.clientWidth) scrollPos = 0;
      carousel.scrollLeft = scrollPos;
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div className="public-home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo"><BookOpen /> CodeQuest</div>
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">Courses</a>
          <a href="#">Resources</a>
          <a href="#">About</a>
          <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
          <button className="get-started-btn" onClick={() => navigate("/register")}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-left">
          <div className="hero-badge"><Sparkles /> Beginner Friendly</div>
          <h1 className="hero-title">
            Master <span className="hero-title-gradient">Programming</span><br />
            <span className="hero-title-gradient">{typingText}</span><span className="cursor">|</span>
          </h1>
          <div className="code-display">
            <pre>{`function helloWorld() {\n  console.log("Hello, World!");\n}`}</pre>
          </div>
          <div className="hero-buttons">
            <button className="start-learning-btn" onClick={() => navigate("/login")}><Play /> Start Learning</button>
            <button className="browse-courses-btn" onClick={() => navigate("/register")}><Globe /> Browse Courses</button>
          </div>
        </div>

        <div className="hero-right">
          <div className="floating-skill-wrapper">
            {floatingSkills.map((skill, idx) => (
              <div key={idx} className="floating-skill-card"
                style={{ top: skill.top, left: skill.left, right: skill.right, bottom: skill.bottom }}>
                <skill.icon size={40} color="#2563eb" />
                <span style={{ marginTop: "0.5rem", color: "#1f2937" }}>{skill.name}</span>
              </div>
            ))}
            <div className="central-icon">
              <Code className="central-icon-inner" />
            </div>
          </div>
        </div>
      </section>

      {/* Skills Carousel */}
      <section className="skills-section">
        <div className="skills-header" style={{ marginTop: "2rem" }}>
          <h2 className="skills-title">Build Real Skills</h2>
          <p className="skills-subtitle">From fundamentals to advanced coding with hands-on projects</p>
        </div>

        <div className="carousel-container" ref={carouselRef}>
          <div className="skills-carousel">
            {skillCards.map((skill, index) => (
              <div key={index} className="skill-card" style={{ minWidth: "300px", marginLeft: index === 0 ? "1rem" : "0" }}>
                <img src={skill.img} alt={skill.title} />
                <div className="skill-card-header">
                  <h3 className="skill-card-title">{skill.title}</h3>
                  <Wrench size={24} color="#2563eb" />
                </div>
                <p className="skill-card-description">{skill.description}</p>
                <div className="skill-badges">
                  <span>{skill.level}</span>
                  <span>{skill.projects}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo"><BookOpen /> CodeQuest</div>
        <p className="footer-description">Learn coding step by step with structured lessons and real-world projects.</p>
      </footer>
    </div>
  );
};

export default PublicHome;
