import type { ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";
import geckoMark from "../../gecko.svg";
import "./tokens.css";

type ActionLinkProps = LinkProps & {
  variant?: "primary" | "secondary";
};

export function ActionLink({
  variant = "primary",
  className = "",
  ...props
}: ActionLinkProps) {
  return (
    <Link
      {...props}
      className={`ra-action ra-action--${variant} ${className}`.trim()}
    />
  );
}

type BrandMarkProps = {
  compact?: boolean;
  className?: string;
};

export function BrandMark({ compact = false, className = "" }: BrandMarkProps) {
  return (
    <span className={`ra-brand ${className}`.trim()}>
      <img
        src={geckoMark}
        alt={compact ? "ReptileApp" : ""}
        width={40}
        height={40}
      />
      {!compact && <span>ReptileApp</span>}
    </span>
  );
}

type SectionHeadingProps = {
  id?: string;
  children: ReactNode;
  className?: string;
};

export function SectionHeading({
  id,
  children,
  className = "",
}: SectionHeadingProps) {
  return (
    <h2 id={id} className={`ra-section-heading ${className}`.trim()}>
      {children}
    </h2>
  );
}
