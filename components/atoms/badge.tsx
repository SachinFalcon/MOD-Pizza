interface BadgeProps {
  label: string;
  variant?: "dark" | "red" | "orange" | "custom";
  className?: string;
}

const variantStyles = {
  dark: "bg-slate-800",
  red: "bg-[#A61932]",
  orange: "bg-orange-500",
  custom: "",
};

export function Badge({ label, variant = "dark", className = "" }: BadgeProps) {
  return (
    <span className={`text-white text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wide ${variantStyles[variant]} ${className}`}>
      {label}
    </span>
  );
}
