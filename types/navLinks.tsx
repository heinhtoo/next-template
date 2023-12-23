import { Session } from "next-auth";
import {
  BookText,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Lock,
  LogOut,
  MailQuestion,
  MessageSquareIcon,
  Settings2,
  Star,
  StickyNote,
  UserCircle,
  Users,
} from "lucide-react";
import { isSuperAdmin } from "@/lib/authHelper";

export function getNavLinks(session: Session | null) {
  return [
    {
      name: "Dashboard",
      route: "/",
      canAccess: true,
      icon: <LayoutDashboard className="h-[1rem] w-[1rem]" />,
    },
    {
      name: "Users",
      route: "/users",
      canAccess: true,
      icon: <Users className="h-[1rem] w-[1rem]" />,
    },
    {
      name: "Authors",
      route: "/authors",
      canAccess: true,
      icon: <GraduationCap className="h-[1rem] w-[1rem]" />,
    },
    {
      name: "Chapters",
      route: "/chapters",
      canAccess: true,
      icon: <BookText className="h-[1rem] w-[1rem]" />,
    },
    {
      name: "Messages",
      route: "/messages",
      canAccess: true,
      icon: <MessageSquareIcon className="h-[1rem] w-[1rem]" />,
    },
    {
      name: "Testimonial",
      route: "/testimonial",
      canAccess: true,
      icon: <Star className="h-[1rem] w-[1rem]" />,
    },
    {
      name: "Response",
      route: "/response",
      canAccess: true,
      icon: <MailQuestion className="h-[1rem] w-[1rem]" />,
    },

    { isSeparator: true, canAccess: true },
    {
      name: "Content",
      route: "/content",
      canAccess: true,
      icon: <StickyNote className="h-[1rem] w-[1rem]" />,
    },
    {
      name: "FAQs",
      route: "/FAQs",
      canAccess: true,
      icon: <HelpCircle className="h-[1rem] w-[1rem]" />,
    },
    {
      name: "Configurations",
      route: "/configurations",
      canAccess: isSuperAdmin(session),
      icon: <Settings2 className="h-[1rem] w-[1rem]" />,
    },
    {
      name: "Account",
      route: "/",
      canAccess: true,
      icon: <UserCircle className="h-[1rem] w-[1rem]" />,
      subLink: [
        {
          name: "Change Password",
          route: "/changePassword",
          icon: <Lock className="h-[1rem] w-[1rem]" />,
        },
        {
          name: "Sign Out",
          route: "/signOut",
          icon: <LogOut className="h-[1rem] w-[1rem]" />,
        },
      ],
    },
  ];
}

export function getNavLinksFlat(session: Session | null) {
  const navLinks = getNavLinks(session);
  const allLinks = navLinks.flatMap((item: any) => {
    if (item.subLink) {
      const children = item.subLink.map((child: any) => ({ ...child }));
      return [{ ...item }, ...children];
    }
    return [{ ...item }];
  });
  return allLinks;
}
