import { siteConfig } from "@/config/site";

type SocialName = (typeof siteConfig.socialLinks)[number]["name"];

function SocialIcon({ name }: { name: SocialName }) {
  const commonProps = {
    "aria-hidden": true,
    className: "h-4 w-4",
    fill: "currentColor",
    focusable: false,
    viewBox: "0 0 24 24",
  } as const;

  switch (name) {
    case "Instagram":
      return (
        <svg {...commonProps}>
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            cx="12"
            cy="12"
            r="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="17.4" cy="6.7" r="1.2" />
        </svg>
      );
    case "Facebook":
      return (
        <svg {...commonProps}>
          <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
        </svg>
      );
    case "YouTube":
      return (
        <svg {...commonProps}>
          <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
        </svg>
      );
    case "TikTok":
      return (
        <svg {...commonProps}>
          <path d="M16.6 5.82a5.85 5.85 0 0 0 3.42 1.09V3.48a2.42 2.42 0 0 1-.72-.11v2.7a5.88 5.88 0 0 1-3.42-1.09v7a6.35 6.35 0 1 1-5.47-6.29c.3-.04.6-.06.91-.04v3.5a2.93 2.93 0 1 0 2.04 2.8V0h3.24c0 .29.03.58.08.86a5.86 5.86 0 0 0 2.62 3.85v2.7a5.87 5.87 0 0 1-2.7-1.59Z" />
        </svg>
      );
  }
}

type SocialLinksProps = {
  className?: string;
};

export function SocialLinks({ className = "" }: SocialLinksProps) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {siteConfig.socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visitar ${social.name} de Tecnorete Toledo`}
          title={`Tecnorete Toledo en ${social.name}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-brand-blue/10 hover:text-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        >
          <SocialIcon name={social.name} />
        </a>
      ))}
    </div>
  );
}
