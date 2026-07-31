import TextFormatStyle from "./TextFormatStyle";

export default function SectionTag({ label, title, light = false, id, labelFormat, titleFormat }) {
  const labelId = id ? `${id}-eyebrow` : null;
  const titleId = id ? `${id}-titulo` : null;
  return (
    <div className="mb-6">
      {labelId && <TextFormatStyle id={labelId} format={labelFormat} mode="flex" sizeCategory="heading-sm" />}
      <p
        className={`font-heading text-sm md:text-base font-bold uppercase tracking-[0.25em] mb-4 flex items-center gap-3 ${labelId ? `tf-${labelId}` : ""} ${
          light ? "text-accent" : "text-tertiary"
        }`}
      >
        <span className="w-6 h-0.5 bg-current inline-block shrink-0" />
        {label}
      </p>
      {title && (
        <>
          {titleId && <TextFormatStyle id={titleId} format={titleFormat} sizeCategory="heading-5xl" />}
          <h2
            className={`font-heading text-4xl md:text-5xl font-extrabold uppercase leading-[0.95] tracking-tight ${titleId ? `tf-${titleId}` : ""} ${
              light ? "text-white" : "text-primary"
            }`}
          >
            {title}
          </h2>
        </>
      )}
    </div>
  );
}
