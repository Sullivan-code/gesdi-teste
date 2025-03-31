import Link from "next/link";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.action";

async function Navbar() {
  const user = await currentUser();
  if (user) await syncUser();

  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-24"> {/* Increased navbar height */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center font-bold  transition-opacity"
            >
              {/* Gesdi Logo - 4x larger */}
              <img 
                src="/images/Gesdii.png" 
                alt="Gesdi Logo"
                className="h-24 w-auto" // 4x larger than original h-8 (8x3=24)
              />
            </Link>
          </div>

          <DesktopNavbar />
          <MobileNavbar />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;   