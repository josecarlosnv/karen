import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  href?: string;
  color?: string;
  gradient?: string;
}

export function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  href,
  color = "var(--kpmg-blue)",
  gradient = "var(--gradient-primary)",
}: KPICardProps) {
  const CardWrapper = motion.div;
  
  const content = (
    <CardWrapper
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      className="h-full"
    >
      <Card 
        className="h-full border-0 overflow-hidden group cursor-pointer transition-all duration-300"
        style={{ 
          boxShadow: 'var(--shadow-md)',
          background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(248, 250, 252, 0.5) 100%)'
        }}
      >
        <CardContent className="p-6 relative">
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'var(--gradient-card)' }}
          />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2 font-medium">{title}</p>
              <p className="text-4xl font-bold" style={{ color: '#00338D' }}>
                {value}
              </p>
              {trend && (
                <div className="flex items-center gap-1.5 mt-3">
                  <div className={`p-1 rounded-full ${
                    trend.direction === "up" ? "bg-green-100" : "bg-red-100"
                  }`}>
                    {trend.direction === "up" ? (
                      <ArrowUpIcon className="h-3 w-3 text-green-600" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 text-red-600" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      trend.direction === "up"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {Math.abs(trend.value)}%
                  </span>
                  <span className="text-xs text-muted-foreground">vs last period</span>
                </div>
              )}
            </div>
            <div className="relative">
              {/* Glow effect */}
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
                style={{ background: gradient }}
              />
              <div
                className="relative flex h-16 w-16 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: gradient, boxShadow: 'var(--shadow-md)' }}
              >
                <Icon className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
            style={{ background: gradient }}
          />
        </CardContent>
      </Card>
    </CardWrapper>
  );

  if (href) {
    return <Link to={href} className="block">{content}</Link>;
  }

  return content;
}