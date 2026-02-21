export default function Navbar() {
  return (
    <nav className="navbar">
      <a
        href="https://farmshare.co"
        className="navbar__brand"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="navbar__logo-mark">F</div>
        <span className="navbar__name">Farmshare</span>
      </a>
      <span className="navbar__badge">Value Calculator</span>
    </nav>
  );
}
