/**
 * [CRITÉRIO 4.1 — ECOSSISTEMA DE COMPONENTES]
 * Componente no estilo ShadCN/UI (estratégia "copy-paste"): o código fica NO nosso
 * projeto (não numa biblioteca), usando Tailwind + class-variance-authority (variantes).
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-yellow-500 text-slate-950 hover:bg-yellow-400",
        success: "bg-emerald-600 text-white hover:bg-emerald-500",
        secondary: "bg-slate-700 text-slate-200 hover:bg-slate-600",
        destructive: "bg-red-600/80 text-white hover:bg-red-500",
        ghost: "text-slate-300 hover:bg-slate-800",
      },
      size: { default: "px-4 py-2", sm: "px-3 py-1.5" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));
Button.displayName = "Button";
