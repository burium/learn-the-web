import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Logo } from "@/lib/icons";
import {
  BookA,
  PanelsTopLeft,
  Server,
  GraduationCap,
  Album,
} from "lucide-react";
import Image from "next/image";
import banner from "@/public/og-image.png";

export const baseOptions: BaseLayoutProps = {
  githubUrl: "https://github.com/r4ultv/learn-the-web",
  nav: {
    title: (
      <>
        <Logo className="size-5" />
        <span className="font-medium [header_&]:text-[15px]">
          Learn The Web
        </span>
      </>
    ),
    transparentMode: "top",
  },
  links: [
    {
      type: "menu",
      text: "Courses",
      url: "/docs/fundamentals",
      items: [
        {
          menu: {
            banner: (
              <div className="-mx-3 -mt-3">
                <Image
                  src={banner}
                  alt="Banner Image"
                  className="rounded-t-lg object-cover"
                  style={{
                    maskImage:
                      "linear-gradient(to bottom,white 60%,transparent)",
                  }}
                />
              </div>
            ),
            className: "md:row-span-2",
          },
          icon: <Album />,
          text: "Getting Started",
          description: "Your Journey into Web Development Begins.",
          url: "/docs/fundamentals",
        },
        {
          icon: <BookA />,
          text: "I. Foundational Concepts",
          description: "Start with the basics of the web.",
          url: "/docs/fundamentals/",
          active: "nested-url",
          menu: {
            className: "lg:col-start-2",
          },
        },
        {
          icon: <PanelsTopLeft />,
          text: "II. Front-End Development",
          description: "Developing the user interface.",
          url: "/docs/front-end",
          active: "nested-url",
          menu: {
            className: "lg:col-start-2 opacity-50 pointer-events-none",
          },
        },
        {
          icon: <Server />,
          text: "III. Back-End Development",
          description: "Developing the server-side logic.",
          url: "/docs/back-end",
          active: "nested-url",
          menu: {
            className:
              "lg:col-start-3 lg:row-start-1 opacity-50 pointer-events-none",
          },
        },
        {
          icon: <GraduationCap />,
          text: "IV. Advanced Concepts",
          description: "Advanced skills for production environments.",
          url: "/docs/advanced",
          active: "nested-url",
          menu: {
            className: "lg:col-start-3 opacity-50 pointer-events-none",
          },
        },
      ],
    },
    {
      text: "Highlights",
      url: "/#highlights",
      active: "nested-url",
    },
    {
      text: "Sponsor",
      url: "https://github.com/sponsors/R4ULtv/",
      active: "url",
    },
  ],
};
