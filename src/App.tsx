// App.tsx
import React from "react";
import "./App.css";
import Home from "./pages/Home";
import Nav from "./component/navigation/Nav";
import Footer from "./component/navigation/Footer";
import { motion } from "framer-motion";

const App: React.FC = () => {
  return (
    <div className="App">
      <Nav />

      <Home />
      <Footer />
    </div>
  );
};

export default App;
