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
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold font-mono tracking-wider bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500 bg-clip-text text-transparent hover:from-purple-500 hover:via-green-500 hover:to-red-500 transition-all duration-500 relative group"
            >
              GESDI
              {/* LGBT Flag Effect */}
              <span className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,_red_20%,_orange_20%_40%,_yellow_40%_60%,_green_60%_80%,_blue_80%_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
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