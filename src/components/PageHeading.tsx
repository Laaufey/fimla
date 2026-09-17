type PageHeadingProps = {
  title: string;
  description?: string;
  className?: string;
};

/** Shared left-aligned page title, used at the top of every top-level page. */
const PageHeading = ({
  title,
  description,
  className = "mb-6",
}: PageHeadingProps) => (
  <div className={className}>
    <h1 className="heading-1">{title}</h1>
    {description && <p className="mt-1">{description}</p>}
  </div>
);

export default PageHeading;
