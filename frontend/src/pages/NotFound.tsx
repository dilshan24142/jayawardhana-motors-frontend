import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="page-header">
      <h1>Page not found</h1>
      <p>
        This address doesn't match any page. <Link to="/">Go to the dashboard</Link>.
      </p>
    </div>
  );
}
