export default function Navbar() {
  return (
    <nav className="navbar">
      <a href="https://farmshare.co" target="_blank" rel="noopener noreferrer" className="navbar__brand">
        <img
          src="https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content//farmshare%20(1).svg"
          alt="Farmshare Logo"
          style={{ height: 28, width: "auto" }}
        />
      </a>
      <span className="navbar__badge">Value Calculator</span>
    </nav>
  );
}
