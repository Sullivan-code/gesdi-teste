"use client";

import { 
  BellIcon, 
  HomeIcon, 
  UserIcon, 
  BookOpenIcon, 
  CalendarIcon, 
  MessageCircleIcon, 
  InfoIcon 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

function DesktopNavbar() {
  const { isSignedIn, user } = useUser(); // ✅ Correct client-side auth hook

  return (
    <div className="hidden md:flex items-center space-x-4">
      <Link href="/">
        <Button className="flex items-center gap-2 text-gray-800 bg-[#FFD9C0] transition-all duration-300 hover:bg-[#F8CBA6]">
          <HomeIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Home</span>
        </Button>
      </Link>

      <Link href="/biblioteca">
        <Button className="flex items-center gap-2 text-gray-800 bg-[#C5DFF8] transition-all duration-300 hover:bg-[#AFCBE7]">
          <BookOpenIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Biblioteca</span>
        </Button>
      </Link>

      <Link href="/quem-somos">
        <Button className="flex items-center gap-2 text-gray-800 bg-[#EAD8F0] transition-all duration-300 hover:bg-[#D4BEE1]">
          <InfoIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Quem Somos</span>
        </Button>
      </Link>

      <Link href="/agenda">
        <Button className="flex items-center gap-2 text-gray-800 bg-[#FDF7C3] transition-all duration-300 hover:bg-[#F3EBAA]">
          <CalendarIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Agenda</span>
        </Button>
      </Link>

      <Link href="/fale-conosco">
        <Button className="flex items-center gap-2 text-gray-800 bg-[#B9E0DC] transition-all duration-300 hover:bg-[#A3D1CC]">
          <MessageCircleIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Fale Conosco</span>
        </Button>
      </Link>

      {isSignedIn ? ( // ✅ Use `isSignedIn` to check auth state
        <>
          <Link href="/notifications">
            <Button className="flex items-center gap-2 text-gray-800 bg-[#FFC3A0] transition-all duration-300 hover:bg-[#E6B093]">
              <BellIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Notificações</span>
            </Button>
          </Link>

          <Link href={`/profile/${user?.username ?? user?.emailAddresses[0]?.emailAddress.split("@")[0]}`}>
            <Button className="flex items-center gap-2 text-gray-800 bg-[#D4A5A5] transition-all duration-300 hover:bg-[#BF9696]">
              <UserIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Perfil</span>
            </Button>
          </Link>

          <UserButton /> {/* ✅ Now it will render correctly */}
        </>
      ) : (
        <SignInButton mode="modal">
          <Button className="text-gray-800 bg-[#F6D6D6] transition-all duration-300 hover:bg-[#E5C5C5]">
            Entrar
          </Button>
        </SignInButton>
      )}
    </div>
  );
}

export default DesktopNavbar;
