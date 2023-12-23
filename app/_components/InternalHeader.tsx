"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { capitalizeFirstLetter, getInitials } from "@/lib/textHelper";
import { Lock, LogOut, Menu, Search } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import InternalNavbar from "./InternalNavbar";
import { getNavLinksFlat } from "@/types/navLinks";
import { fileUrl } from "@/types/const";
import { Input } from "@/components/ui/input";

function MobileMenu({ session }: { session: Session | null }) {
  return (
    <Sheet>
      <SheetTrigger>
        <Button
          size={"icon"}
          variant={"outline"}
          className="text-gray-600 hover:text-gray-700"
          asChild
        >
          <div>
            <Menu className="h-5 w-5" />
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="min-h-screen p-0 text-white">
        <InternalNavbar session={session} isMobile={true} />
      </SheetContent>
    </Sheet>
  );
}

function UserMenu({ session }: { session: Session | null }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex flex-row items-center lg:min-w-[200px] lg:max-w-[200px]">
          <Avatar>
            <AvatarImage
              src={
                session?.user?.profile ? fileUrl + session?.user?.profile : ""
              }
              alt={"@" + session?.user?.username}
            />
            <AvatarFallback>
              {getInitials(session?.user?.username)}
            </AvatarFallback>
          </Avatar>

          <p className="ms-2 hidden grow text-left text-xs sm:block">
            <strong className="block font-medium">
              {session?.user?.username}
            </strong>

            <span className="text-gray-500"> {session?.user?.role} </span>
          </p>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ms-4 hidden h-5 w-5 text-gray-500 transition group-hover:text-gray-700 sm:block"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              router.push("/changePassword");
            }}
          >
            <Lock className="mr-2 h-4 w-4" />
            <span>Change Password</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            signOut({
              callbackUrl: "/",
            });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function InternalHeader({ session }: { session: Session | null }) {
  const pathname = usePathname();
  let segments = pathname.split("/").filter((segment) => segment);
  segments = segments.length > 0 ? segments : [""];
  const sidebarLinks = getNavLinksFlat(session);

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-screen-xl p-4 sm:px-6 lg:p-8">
        <div className="flex flex-wrap items-center sm:justify-between sm:gap-4">
          <div className="flex w-full flex-row items-center gap-8">
            <div className="flex w-full flex-row flex-wrap items-center justify-between gap-5 lg:w-fit">
              <div className="relative w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-600" />
                <Input
                  className="pl-9 lg:min-w-[250px]"
                  placeholder="Search..."
                />
              </div>
              <div className="flex lg:hidden">
                <MobileMenu session={session} />
              </div>

              <div className="flex gap-5 lg:hidden">
                <UserMenu session={session} />
              </div>
            </div>
            <div className="hidden flex-1 items-center justify-between gap-8 sm:justify-end lg:flex">
              <UserMenu session={session} />
            </div>
          </div>
        </div>

        <div className="mt-10 lg:mt-4">
          <nav
            className="justify-between text-gray-700 sm:flex"
            aria-label="Breadcrumb"
          >
            <ol className="mb-3 inline-flex items-center space-x-1 sm:mb-0 md:space-x-3">
              {segments.map((segment, index) => (
                <li aria-current="page" key={index}>
                  <div className="flex items-center">
                    {index > 0 && (
                      <svg
                        className="mx-1 h-3 w-3 text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 9 4-4-4-4"
                        />
                      </svg>
                    )}

                    <Link
                      href={`/${segments.slice(0, index + 1).join("/")}`}
                      className={`${
                        index > 0 ? "ml-1 md:ml-2" : ""
                      } flex flex-row items-center gap-3 text-sm font-medium text-gray-700 hover:text-primary`}
                    >
                      {index === 0 &&
                        sidebarLinks.find((z) => z.route === "/" + segment)
                          ?.icon}
                      <span className="mt-1">
                        {sidebarLinks.find((z) => {
                          if (index > 0) {
                            const parentLinks = segments.slice(0, index);
                            return (
                              z.route ===
                              "/" + parentLinks.join("/") + "/" + segment
                            );
                          } else {
                            return z.route === "/" + segment;
                          }
                        })
                          ? sidebarLinks.find((z) => {
                              if (index > 0) {
                                const parentLinks = segments.slice(0, index);
                                return (
                                  z.route ===
                                  "/" + parentLinks.join("/") + "/" + segment
                                );
                              } else {
                                return z.route === "/" + segment;
                              }
                            })?.name
                          : capitalizeFirstLetter(decodeURIComponent(segment))}
                      </span>
                    </Link>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default InternalHeader;
