import { useState } from "react";
import Dashboard from "./Dashboard";
import Marketplace from "./Marketplace";
import Profile from "./Profile";
import CreateListing from "./CreateListing";

type View = "overview" | "exchange" | "profile" | "create";

export default function DashboardLayout() {
  const [view, setView] = useState<View>("overview");

  const [userProfile, setUserProfile] = useState({
    name: "New Partner",
    role: "seller",
    wallet_balance: 0,
  });

  return (
    <div className="min-h-screen p-8">
      {view === "overview" && (
        <Dashboard
          onBrowse={() => setView("exchange")}
          onItemClick={() => setView("exchange")}
        />
      )}

      {view === "exchange" && (
        <Marketplace
          userProfile={userProfile}
          onPurchaseSuccess={() => setView("profile")}
        />
      )}

      {view === "profile" && (
        <Profile
          userProfile={userProfile}
          onUpdate={() => setView("overview")}
        />
      )}

      {view === "create" && (
        <CreateListing onSuccess={() => setView("overview")} />
      )}
    </div>
  );
}
