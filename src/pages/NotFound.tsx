import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-page py-20">
      <EmptyState
        icon={Compass}
        title="That page isn't here."
        body="The link may be out of date. Start from the search page and you'll find your way back."
        action={
          <Link to="/search">
            <Button>Find a place</Button>
          </Link>
        }
      />
    </div>
  );
}
