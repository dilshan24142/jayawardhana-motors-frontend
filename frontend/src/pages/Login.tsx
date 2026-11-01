import { Link } from "react-router";

// JM-08 (Member 2): email + password form with Firebase sign-in, errors and loading state.
export default function Login() {
  return (
    <div className="login">
      <div className="card">
        <div className="page-header">
          <h1>Sign in</h1>
          <p>Jayawardhana Motors back office</p>
        </div>
        <p className="muted">
          <span className="tag">JM-08</span> The sign-in form is built by Member 2.
        </p>
        <Link to="/">Continue to the dashboard</Link>
      </div>
    </div>
  );
}
