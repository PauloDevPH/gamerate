import * as React from "react";
import { cn } from "@/lib/utils";

const base = "w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-xs text-white placeholder-slate-500 focus:border-yellow-500 focus:outline-none";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(base, className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(base, "h-20 resize-none", className)} {...props} />
));
Textarea.displayName = "Textarea";
