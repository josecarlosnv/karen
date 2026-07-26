import { Link } from "react-router";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

interface NavigationCardProps {
  title: string;
  description: string;
  href: string;
  icon?: LucideIcon;
}

export default function NavigationCard({ title, description, href, icon: Icon }: NavigationCardProps) {
  return (
    <Link to={href}>
      <Card className="group cursor-pointer transition-all hover:shadow-lg hover:border-blue-400">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {Icon && <Icon className="h-5 w-5 md:h-6 md:w-6 text-blue-600 flex-shrink-0" />}
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">{title}</h3>
              </div>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            <ArrowRight className="h-5 w-5 md:h-6 md:w-6 text-blue-600 transition-transform group-hover:translate-x-1 flex-shrink-0" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}