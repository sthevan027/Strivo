interface BadgeProps {
  count: number
  variant?: 'default' | 'primary' | 'danger' | 'warning'
}

export default function Badge({ count, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-gray-600 text-white',
    primary: 'bg-primary text-black',
    danger: 'bg-red-600 text-white',
    warning: 'bg-yellow-600 text-black',
  }

  return (
    <span
      className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold ${variants[variant]}`}
    >
      {count}
    </span>
  )
}

