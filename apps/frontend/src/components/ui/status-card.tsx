import type { ReactNode } from 'react';

interface StatusCardProps {
    iconBg: string;
    iconColor: string;
    icon: ReactNode;
    title: string;
    description: string;
    children?: ReactNode;
}

export default function StatusCard({
    iconBg,
    iconColor,
    icon,
    title,
    description,
    children,
}: StatusCardProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: iconBg }}
                    aria-hidden="true"
                >
                    <span style={{ color: iconColor }}>{icon}</span>
                </div>

                <div>
                    <h1
                        className="text-2xl font-semibold text-ink tracking-tight"
                        style={{
                            fontFamily: 'var(--font-fraunces), Georgia, serif',
                        }}
                    >
                        {title}
                    </h1>

                    <p className="text-sm text-ink-muted mt-2 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>

            {children}
        </div>
    );
}