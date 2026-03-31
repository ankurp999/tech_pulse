import { Link } from "react-router-dom";

const SectionTitle = ({ title, link, slug }) => {
  return (
    <div className="section-header" style={{ display: "flex", justifyContent: "space-between" }}>
      <h2>{title}</h2>

      {link && slug && (
        <Link to={`/category/${slug}`}>
          View all →
        </Link>
      )}
    </div>
  );
};

export default SectionTitle;
