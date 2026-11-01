import { PagePlaceholder } from "../components/PagePlaceholder";
import { navItem } from "../config/navigation";

export default function Sales() {
  return <PagePlaceholder item={navItem("/sales")} />;
}
