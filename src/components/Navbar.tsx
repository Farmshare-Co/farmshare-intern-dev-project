import {
  Button,
} from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

interface NavbarProps {
  comparisonMode: boolean;
  setComparisonMode: (value: boolean) => void;
}

export default function Navbar({ comparisonMode, setComparisonMode }: NavbarProps) {
  return (
    <nav className="navbar">
      <a href="https://farmshare.co" target="_blank" rel="noopener noreferrer" className="navbar__brand">
        <img
          src="https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content//farmshare%20(1).svg"
          alt="Farmshare Logo"
          style={{ height: 28, width: "auto" }}
        />
      </a>
      {/* <span className="navbar__badge">Value Calculator</span> */}
      <div className="navbar__actions">
        <Button
          variant={comparisonMode ? "contained" : "outlined"}
          size="small"
          startIcon={<CompareArrowsIcon />}
          onClick={() => setComparisonMode(!comparisonMode)}
          sx={{
            fontSize: 12,
            borderColor: "rgba(255,255,255,0.35)",
            color: comparisonMode ? undefined : "#fff",
            "&:hover": { borderColor: "#fff" },
          }}
        >
          {comparisonMode ? "Exit Comparison" : "Compare Scenarios"}
        </Button>
      </div>
    </nav>
  );
}

