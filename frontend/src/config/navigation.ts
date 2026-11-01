/** Sidebar entries. `task` and `owner` say who builds the page (see the task board). */
export interface NavItem {
  path: string;
  label: string;
  description: string;
  task: string;
  owner: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    path: "/",
    label: "Dashboard",
    description: "Stock, margins, collections and outstanding balances at a glance.",
    task: "JM-36",
    owner: "Member 7",
  },
  {
    path: "/vehicles",
    label: "Vehicles",
    description: "Search stock and see each bike's identifiers and purchase history.",
    task: "JM-18",
    owner: "Member 3",
  },
  {
    path: "/acquisitions",
    label: "Purchases",
    description: "Record a purchase: seller, date and price, as a new acquisition cycle.",
    task: "JM-18",
    owner: "Member 3",
  },
  {
    path: "/expenses",
    label: "Refurbishment",
    description: "Parts, labour and repair costs, direct cost per bike, and ready-for-sale status.",
    task: "JM-21",
    owner: "Member 4",
  },
  {
    path: "/sales",
    label: "Sales",
    description: "Sell a ready bike to a buyer, with full payment or installments.",
    task: "JM-30",
    owner: "Member 5",
  },
  {
    path: "/payments",
    label: "Installments",
    description: "Payment agreements, installment schedules, payments and receipts.",
    task: "JM-35",
    owner: "Member 6",
  },
  {
    path: "/documents",
    label: "Documents",
    description: "Buyer ID copies and vehicle papers, opened through secure links.",
    task: "JM-23",
    owner: "Member 2",
  },
  {
    path: "/reminders",
    label: "Reminders",
    description: "Installment due dates and licence or insurance expiry.",
    task: "JM-37",
    owner: "Member 7",
  },
  {
    path: "/reports",
    label: "Reports",
    description: "Stock, margins, receivables and refurbishment expense reports.",
    task: "JM-40",
    owner: "Member 4 / Member 7",
  },
];

export const navItem = (path: string) => NAV_ITEMS.find((item) => item.path === path)!;
