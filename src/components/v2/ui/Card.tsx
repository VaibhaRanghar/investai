import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gradient";
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = "default",
}) => {
  return (
    <div
      className={cn(
        "rounded-xl border shadow-sm transition-all hover:shadow-md",
        variant === "default"
          ? "bg-white border-gray-200"
          : "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div className={cn("p-6 pb-4", className)}>{children}</div>;
};

export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <h3 className={cn("text-lg font-semibold text-gray-900", className)}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>;
};
