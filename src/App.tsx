import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Calculator from "./pages/Calculator";
import Comparisons from "./pages/Comparisons";
import Charts from "./pages/Charts";
import "./App.css";

function App() {
  // Use GitHub Pages base path only for GitHub Pages, not Vercel
  const basename =
    import.meta.env.MODE === "production" && !import.meta.env.VITE_VERCEL
      ? "/farmshare-intern-dev-project"
      : "";

  return (
    <BrowserRouter basename={basename}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/comparisons" element={<Comparisons />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
