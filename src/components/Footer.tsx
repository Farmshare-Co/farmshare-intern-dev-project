import { Divider } from "@mui/material";

export default function Footer(){
    return (
      <footer className="footer">
        <Divider sx={{ mb: 2 }} />
        Powered by{" "}
        <a href="https://farmshare.co" target="_blank" rel="noopener noreferrer">
          Farmshare
        </a>{" "}
        — The Meat Supply Chain, Rebuilt.
      </footer>
    )
} 