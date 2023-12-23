"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getInitials } from "@/lib/textHelper";
import { useNavStore } from "@/store/NavStore";
import { fileUrl } from "@/types/const";
import { getNavLinks } from "@/types/navLinks";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function NavLink({
  link,
  isActive,
  isParent,
  isMobile,
}: {
  link: any;
  isActive: boolean;
  isParent?: boolean;
  isMobile?: boolean;
}) {
  const [isOpen] = useNavStore((state) => [state.isOpen]);

  if (isOpen === false && isMobile !== true) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger>
            {isParent === true ? (
              <p
                className={`flex flex-row items-center gap-3 ${
                  isActive
                    ? "rounded-md bg-primary/50 p-3 text-white"
                    : "p-3 text-gray-200"
                }`}
              >
                {link.icon}
              </p>
            ) : link.route === "/signOut" ? (
              <Button
                className={`flex w-full flex-row items-center justify-start gap-3 ${
                  isActive
                    ? "rounded-md bg-primary/50 p-3 text-white"
                    : "p-3 text-gray-200"
                } hover:bg-primary/40 hover:text-white`}
                variant={"ghost"}
                onClick={async () => {
                  signOut({
                    callbackUrl: "/",
                  });
                }}
              >
                {link.icon}
              </Button>
            ) : (
              <Link
                href={link.route}
                className={`flex flex-row items-center gap-3 ${
                  isActive
                    ? "rounded-md bg-primary/50 p-3 text-white"
                    : "p-3 text-gray-200"
                }`}
              >
                {link.icon}
              </Link>
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p className={`${isActive ? "font-semibold" : ""} text-sm`}>
              {link.name}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (isParent === true) {
    return (
      <p
        className={`flex flex-row items-center gap-3 ${
          isActive
            ? "rounded-md bg-primary/50 p-3 text-white"
            : "p-3 text-gray-200"
        }`}
      >
        {link.icon}
        <span className={`${isActive ? "font-semibold" : ""} text-sm`}>
          {link.name}
        </span>
      </p>
    );
  }

  if (link.route === "/signOut") {
    return (
      <Button
        className={`flex w-full flex-row items-center justify-start gap-3 ${
          isActive
            ? "rounded-md bg-primary/50 p-3 text-white"
            : "p-3 text-gray-200"
        } hover:bg-primary/40 hover:text-white`}
        variant={"ghost"}
        onClick={async () => {
          signOut({
            callbackUrl: "/",
          });
        }}
      >
        {link.icon}
        <p className={`${isActive ? "font-semibold" : ""} text-sm`}>
          {link.name}
        </p>
      </Button>
    );
  }
  return (
    <Link
      href={link.route}
      className={`flex flex-row items-center gap-3 ${
        isActive
          ? "rounded-md bg-primary/50 p-3 text-white"
          : "rounded-md p-3 text-gray-200 hover:bg-primary/40"
      }`}
    >
      {link.icon}
      <p className={`${isActive ? "font-semibold" : ""} text-sm`}>
        {link.name}
      </p>
    </Link>
  );
}

function NavLogo({ isMobile }: { isMobile?: boolean }) {
  const [isOpen, toggleOpen] = useNavStore((state) => [
    state.isOpen,
    state.toggleOpen,
  ]);
  return (
    <div
      className={`relative ${
        isOpen === true ? "mt-5 p-3" : "px-3 pt-3"
      } flex flex-row items-center justify-between gap-5`}
    >
      {(isOpen === true || isMobile === true) && (
        <div className="rounded-full bg-primary/50 p-2">
          <Image
            width={40}
            height={40}
            src={"/assets/logo.png"}
            alt="moe ma kha"
            className="h-10 w-10 rounded-full"
          />
        </div>
      )}
      {(isOpen === true || isMobile === true) && (
        <div className="grow text-lg font-semibold text-white">
          Digital Twin
        </div>
      )}
      {isMobile !== true && (
        <Button
          type="button"
          size={"icon"}
          className="bg-transparent bg-none"
          onClick={() => {
            toggleOpen(!isOpen);
          }}
        >
          {isOpen === true ? (
            <ChevronsLeft className="h-4 w-4" />
          ) : (
            <ChevronsRight className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}

function InternalNavbar({
  session,
  isMobile,
}: {
  session: Session | null;
  isMobile?: boolean;
}) {
  const pathname = usePathname();
  const pathNameWithoutLocale = pathname.substring(3);
  const sidebarLinks = getNavLinks(session);

  const [isOpen] = useNavStore((state) => [state.isOpen]);

  return (
    <div
      className={`${isOpen ? "lg:min-w-[250px]" : ""} ${
        isMobile === true ? "flex min-h-screen w-full" : "hidden"
      } max-h-screen flex-col bg-[#1d3e70] lg:flex`}
    >
      <NavLogo isMobile={isMobile} />
      <ScrollArea
        className={`${
          isMobile === true
            ? "mb-10 flex max-h-[calc(100vh-130px)]"
            : `hidden ${
                isOpen === true
                  ? "max-h-[calc(100vh-170px)]"
                  : "max-h-[calc(100vh-10px)]"
              }`
        }  bg-[#1d3e70] lg:flex`}
      >
        <div
          className={`mt-5 flex grow flex-col gap-1.5 px-3 ${
            isMobile === true ? " max-h-[calc(100vh-170px)]" : ""
          }`}
        >
          {sidebarLinks
            .filter((z) => z.canAccess === true)
            .map((link, index) => {
              const isActive =
                (link.route &&
                  pathNameWithoutLocale?.includes(link.route) &&
                  link.route !== "/" &&
                  link.route.length > 0) ||
                (pathNameWithoutLocale &&
                  pathNameWithoutLocale === link.route) ||
                (!pathNameWithoutLocale && link.route === "/");

              if (link.subLink && isOpen) {
                return (
                  <Accordion
                    type="single"
                    collapsible
                    key={index}
                    defaultValue={isActive ? link.route : ""}
                  >
                    <AccordionItem
                      value={link.route}
                      className="rounded-lg border-b-0 pr-3 hover:bg-primary/30"
                    >
                      <AccordionTrigger className="p-0 text-white hover:no-underline">
                        <NavLink
                          isActive={isActive && !link.subLink}
                          link={link}
                          isParent={true}
                          isMobile={isMobile}
                        />
                      </AccordionTrigger>
                      <AccordionContent>
                        {link.subLink.map((subLink, index) => {
                          const isSubActive =
                            (pathNameWithoutLocale?.includes(subLink.route) &&
                              subLink.route !== link.route &&
                              subLink.route.length > 0) ||
                            (pathNameWithoutLocale &&
                              pathNameWithoutLocale === subLink.route) ||
                            (!pathNameWithoutLocale && subLink.route === "/");
                          return (
                            <div
                              key={index}
                              className={isOpen === true ? "pl-5" : ""}
                            >
                              <NavLink
                                isActive={isSubActive}
                                link={subLink}
                                isMobile={isMobile}
                              />
                            </div>
                          );
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              }
              if (link.subLink && isOpen === false) {
                return link.subLink.map((subLink, index) => {
                  const isSubActive =
                    (pathNameWithoutLocale?.includes(subLink.route) &&
                      subLink.route !== link.route &&
                      subLink.route.length > 0) ||
                    (pathNameWithoutLocale &&
                      pathNameWithoutLocale === subLink.route) ||
                    (!pathNameWithoutLocale && subLink.route === "/");
                  return (
                    <NavLink
                      isActive={isSubActive}
                      link={subLink}
                      key={index}
                      isMobile={isMobile}
                    />
                  );
                });
              }
              if (link.route) {
                return (
                  <NavLink
                    isActive={isActive}
                    link={link}
                    key={index}
                    isMobile={isMobile}
                  />
                );
              }
              if (link.isSeparator) {
                return <Separator key={index} />;
              }
              return <></>;
            })}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>

      <div
        className={`${
          isOpen ? "flex" : "hidden"
        } absolute inset-x-0 bottom-0 flex w-full flex-col bg-[#112543]`}
      >
        <div className="flex items-center gap-2 p-4 text-primary">
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

          <p className="ms-2 grow text-left text-xs text-white">
            <strong className="block font-medium">
              {session?.user?.username}
            </strong>

            <span className="text-gray-400"> {session?.user?.role} </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default InternalNavbar;
