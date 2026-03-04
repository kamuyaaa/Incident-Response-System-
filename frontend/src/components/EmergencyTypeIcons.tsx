import {
  Heart,
  Shield,
  Home,
  Car,
  Flame,
  Users,
  FileText,
  type LucideIcon,
} from 'lucide-react'

const iconSize = 14
const iconStroke = 2

const icons: Record<string, LucideIcon> = {
  medical: Heart,
  crime: Shield,
  natural: Home,
  road: Car,
  fire: Flame,
  public: Users,
  other: FileText,
}

export function EmergencyTypeIcon({ type }: { type: string }) {
  const Icon = icons[type] ?? FileText
  return (
    <Icon
      size={iconSize}
      strokeWidth={iconStroke}
      className="shrink-0 text-black"
      aria-hidden
    />
  )
}
