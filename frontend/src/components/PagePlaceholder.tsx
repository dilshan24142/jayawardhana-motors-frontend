import type { NavItem } from "../config/navigation";

/** Shown on pages that haven't been built yet. Delete it from a page when you build that page. */
export function PagePlaceholder({ item }: { item: NavItem }) {
  return (
    <>
      <div className="page-header">
        <h1>{item.label}</h1>
        <p>{item.description}</p>
      </div>
      <div className="card">
        <span>
          <span className="tag">{item.task}</span> Built by {item.owner}.
        </span>
        <span className="muted">See the task card on the project board for the steps.</span>
      </div>
    </>
  );
}
