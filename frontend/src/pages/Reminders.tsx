import { PagePlaceholder } from "../components/PagePlaceholder";
import { navItem } from "../config/navigation";

export default function Reminders() {
  return <PagePlaceholder item={navItem("/reminders")} />;
}
