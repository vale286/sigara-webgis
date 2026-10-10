import React from "react";
import { CountUpNumber } from "@/components/UI/CountUpNumber";

interface KPICardProps {
  title: string;
  value: number | null | undefined;
  unit?: string;
  subtitle?: string;
  isCurrency?: boolean;
  decimals?: number;
  icon?: React.ElementType;
  provenance?: string;
  accentColor?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  subtitle,
  isCurrency = false,
  decimals = 0,
  icon: Icon,
}) => {
  return (
    <div className="bg-white border border-brand-border rounded-xl p-4 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-xs font-medium text-brand-text-secondary block leading-snug">
            {title}
          </span>
          <div className="mt-1 flex items-baseline gap-1.5 flex-wrap">
            <CountUpNumber
              value={value}
              isCurrency={isCurrency}
              decimals={decimals}
              className="text-xl sm:text-2xl font-bold text-brand-dark tracking-tight"
            />
            {unit && <span className="text-xs text-brand-text-secondary font-medium">{unit}</span>}
          </div>
        </div>

        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-brand-soft text-brand-primary flex items-center justify-center shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-colors">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {subtitle && <p className="text-[11px] text-brand-text-secondary mt-2 leading-tight">{subtitle}</p>}
    </div>
  );
};

