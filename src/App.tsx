// App.tsx
import React from "react";
import "./App.css";
import Home from "./pages/Home";
import Nav from "./component/navigation/Nav";
import Footer from "./component/navigation/Footer";

const App: React.FC = () => {
  return (
    <>
      <div className="App px-4 md:px-8 lg:px-16">
        <Nav />
        <Home />
        <Footer />
      </div>
    </>
  );
};

export default App;
