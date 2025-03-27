"use client";

import {
  BellIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
  BookOpenIcon,
  CalendarIcon,
  MessageCircleIcon,
  InfoIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth, SignInButton, SignOutButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import Link from "next/link";

function MobileNavbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isSignedIn } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex md:hidden items-center space-x-2">
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-4 mt-6">
            <Link href="/">
              <Button className="flex items-center gap-3 justify-start w-full text-gray-800 bg-[#FFD9C0] transition-all duration-300 hover:bg-[#F8CBA6]">
                <HomeIcon className="w-4 h-4" />
                Home
              </Button>
            </Link>

            <Link href="/biblioteca">
              <Button className="flex items-center gap-3 justify-start w-full text-gray-800 bg-[#C5DFF8] transition-all duration-300 hover:bg-[#AFCBE7]">
                <BookOpenIcon className="w-4 h-4" />
                Biblioteca
              </Button>
            </Link>

            <Link href="/quem-somos">
              <Button className="flex items-center gap-3 justify-start w-full text-gray-800 bg-[#EAD8F0] transition-all duration-300 hover:bg-[#D4BEE1]">
                <InfoIcon className="w-4 h-4" />
                Quem Somos
              </Button>
            </Link>

            <Link href="/agenda">
              <Button className="flex items-center gap-3 justify-start w-full text-gray-800 bg-[#FDF7C3] transition-all duration-300 hover:bg-[#F3EBAA]">
                <CalendarIcon className="w-4 h-4" />
                Agenda
              </Button>
            </Link>

            <Link href="/fale-conosco">
              <Button className="flex items-center gap-3 justify-start w-full text-gray-800 bg-[#B9E0DC] transition-all duration-300 hover:bg-[#A3D1CC]">
                <MessageCircleIcon className="w-4 h-4" />
                Fale Conosco
              </Button>
            </Link>

            {isSignedIn ? (
              <>
                <Link href="/notifications">
                  <Button className="flex items-center gap-3 justify-start w-full text-gray-800 bg-[#FFC3A0] transition-all duration-300 hover:bg-[#E6B093]">
                    <BellIcon className="w-4 h-4" />
                    Notificações
                  </Button>
                </Link>

                <Link href="/profile">
                  <Button className="flex items-center gap-3 justify-start w-full text-gray-800 bg-[#D4A5A5] transition-all duration-300 hover:bg-[#BF9696]">
                    <UserIcon className="w-4 h-4" />
                    Perfil
                  </Button>
                </Link>

                <SignOutButton>
                  <Button className="flex items-center gap-3 justify-start w-full text-gray-800 bg-[#F6D6D6] transition-all duration-300 hover:bg-[#E5C5C5]">
                    <LogOutIcon className="w-4 h-4" />
                    Logout
                  </Button>
                </SignOutButton>
              </>
            ) : (
              <SignInButton mode="modal">
                <Button className="w-full text-gray-800 bg-[#F6D6D6] transition-all duration-300 hover:bg-[#E5C5C5]">
                  Entrar
                </Button>
              </SignInButton>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;