import { ApiStatus } from "../components/ApiStatus";
import { PagePlaceholder } from "../components/PagePlaceholder";
import { navItem } from "../config/navigation";

export default function Dashboard() {
  return (
    <>
      <PagePlaceholder item={navItem("/")} />
      <ApiStatus />
    </>
  );
}
