import React from "react"

// Simple Tailwind Button Component (NO CVA, NO CN)
// Variant + Size handled manually with plain objects

const VARIANT_STYLES = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  outline: "border border-gray-400 text-gray-800 hover:bg-gray-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "hover:bg-gray-100 text-gray-800",
  link: "text-blue-600 underline-offset-4 hover:underline bg-transparent",
}

const SIZE_STYLES = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-base",
  lg: "h-12 px-6 text-lg",
}

export default function Button({
  children,
  variant = "default",
  size = "md",
  fullWidth = false,
  className = "",
  icon: Icon,
  iconRight: IconRight,
  onClick = () => {},
  ...props
}) {
  const variantClass = VARIANT_STYLES[variant] || VARIANT_STYLES.default
  const sizeClass = SIZE_STYLES[size] || SIZE_STYLES.md
  const widthClass = fullWidth ? "w-full" : "w-auto"

  const finalClass = [
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500",
    variantClass,
    sizeClass,
    widthClass,
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <button className={finalClass} onClick={onClick} {...props}>
      {Icon && <Icon className="mr-2 h-5 w-5" />}
      {children}
      {IconRight && <IconRight className="ml-2 h-5 w-5" />}
    </button>
  )
}