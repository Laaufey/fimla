import Link from "next/link";
import { useSession } from "next-auth/react";

type AuthPromptBannerProps = {
  title: string;
  description?: string;
  primaryActionLabel: string;
  primaryActionHref?: string;
  onPrimaryAction?: () => void;
  secondaryText?: string;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  onSecondaryAction?: () => void;
  className?: string;
};

const primaryButtonClassName =
  "inline-flex h-11 w-fit items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-on-primary transition hover:opacity-90 active:opacity-80";
const secondaryActionClassName =
  "font-medium text-primary underline-offset-4 hover:underline";

/**
 * Signed-out account callout. Renders only while next-auth reports
 * `status === "unauthenticated"` — nothing while loading, nothing once
 * signed in — so callers don't need to duplicate that check themselves.
 */
const AuthPromptBanner = ({
  title,
  description,
  primaryActionLabel,
  primaryActionHref,
  onPrimaryAction,
  secondaryText,
  secondaryActionLabel,
  secondaryActionHref,
  onSecondaryAction,
  className = "",
}: AuthPromptBannerProps) => {
  const { status } = useSession();

  if (status !== "unauthenticated") return null;

  return (
    <section
      className={`flex w-full flex-col gap-6 rounded-3xl bg-aubergine p-6 text-warm-white sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-10 ${className}`}
    >
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl font-extrabold tracking-tight-brand sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="max-w-md text-sm text-warm-white/70 sm:text-base">
            {description}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 lg:shrink-0">
        {primaryActionHref ? (
          <Link href={primaryActionHref} className={primaryButtonClassName}>
            {primaryActionLabel}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onPrimaryAction}
            className={primaryButtonClassName}
          >
            {primaryActionLabel}
          </button>
        )}

        {(secondaryText || secondaryActionLabel) && (
          <div className="flex items-center gap-1.5 text-sm text-warm-white/60">
            {secondaryText && <span>{secondaryText}</span>}
            {secondaryActionLabel &&
              (secondaryActionHref ? (
                <Link
                  href={secondaryActionHref}
                  className={secondaryActionClassName}
                >
                  {secondaryActionLabel}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={onSecondaryAction}
                  className={secondaryActionClassName}
                >
                  {secondaryActionLabel}
                </button>
              ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AuthPromptBanner;
