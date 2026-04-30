import { shadcn } from "@clerk/themes";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export const clerkAppearance = {
  baseTheme: shadcn,
  layout: {
    logoImageUrl:
      typeof window !== "undefined"
        ? `${window.location.origin}${basePath}/logo.svg`
        : undefined,
    logoPlacement: "inside",
    socialButtonsPlacement: "top",
    showOptionalFields: true,
  },
  variables: {
    fontFamily: "Inter, system-ui, sans-serif",
    colorPrimary: "hsl(348, 70%, 60%)",
    colorBackground: "hsl(40, 33%, 98%)",
    colorText: "hsl(30, 10%, 20%)",
    colorTextSecondary: "hsl(30, 10%, 40%)",
    colorInputBackground: "hsl(40, 33%, 99%)",
    colorInputText: "hsl(30, 10%, 20%)",
    colorDanger: "hsl(0, 84%, 60%)",
    colorSuccess: "hsl(150, 50%, 45%)",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full",
    cardBox:
      "bg-[hsl(40,33%,98%)] border border-[hsl(40,20%,88%)] shadow-[0_8px_30px_-12px_rgba(120,80,60,0.18)]",
    headerTitle: "font-serif text-[hsl(30,10%,20%)] text-2xl",
    headerSubtitle: "text-[hsl(30,10%,40%)]",
    socialButtonsBlockButton:
      "border-[hsl(40,20%,88%)] hover:bg-[hsl(40,20%,94%)] text-[hsl(30,10%,20%)]",
    formFieldLabel: "text-[hsl(30,10%,30%)] font-medium",
    formButtonPrimary:
      "bg-[hsl(348,70%,60%)] hover:bg-[hsl(348,70%,55%)] text-white font-medium shadow-sm",
    footerActionLink: "text-[hsl(230,60%,55%)] hover:text-[hsl(230,60%,45%)]",
    footer: "bg-transparent",
    userButtonPopoverCard:
      "bg-[hsl(40,33%,98%)] border border-[hsl(40,20%,88%)]",
    userButtonPopoverActionButton:
      "text-[hsl(30,10%,20%)] hover:bg-[hsl(40,20%,94%)]",
  },
};
