interface FormHeadingProps {
    title: string;
    subtitle?: string;
}

export default function FormHeading({
    title,
    subtitle,
}: FormHeadingProps) {
    return (
        <div>
            <h1
                className="text-[1.875rem] font-semibold text-ink tracking-tight leading-tight"
                style={{
                    fontFamily: 'var(--font-fraunces), Georgia, serif',
                }}
            >
                {title}
            </h1>

            {subtitle && (
                <p className="text-sm text-ink-muted mt-2 leading-relaxed">
                    {subtitle}
                </p>
            )}
        </div>
    );
}