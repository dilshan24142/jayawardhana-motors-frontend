import { PagePlaceholder } from "../components/PagePlaceholder";
import { navItem } from "../config/navigation";

export default function Expenses() {
  return <PagePlaceholder item={navItem("/expenses")} />;
}
