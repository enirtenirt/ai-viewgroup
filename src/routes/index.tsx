import { createFileRoute } from "@tanstack/react-router";
import adImage from "@/assets/view-group-ad.png";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <img src={adImage} alt="VIEW Group – En sannhet for hele konsernet" className="max-h-screen w-auto" />
    </div>
  );
}
