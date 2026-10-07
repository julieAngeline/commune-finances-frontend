import './PageBanner.css';

export default function PageBanner({ title, subtitle, children }) {
  return (
    <header className="banner">
      <span className="banner-circle banner-circle-1" />
      <span className="banner-circle banner-circle-2" />
      <div className="banner-text">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children && <div className="banner-tools">{children}</div>}
    </header>
  );
}