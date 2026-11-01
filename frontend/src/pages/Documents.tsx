import { PagePlaceholder } from "../components/PagePlaceholder";
import { navItem } from "../config/navigation";

export default function Documents() {
  return <PagePlaceholder item={navItem("/documents")} />;
}
