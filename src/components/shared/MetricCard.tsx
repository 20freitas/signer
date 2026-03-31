import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
}

export function MetricCard({ title, value, icon: Icon, description }: MetricCardProps) {
  return (
    <Card className="border-0 shadow-sm bg-white rounded-3xl p-1 overflow-hidden group hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          {description && (
            <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-40 leading-none">
              {description}
            </span>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-tight">{title}</h3>
          <div className="text-4xl font-black text-text-primary tracking-tight">{value}</div>
        </div>
      </CardContent>
    </Card>
  )
}
