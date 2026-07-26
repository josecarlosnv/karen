import { Card, CardContent } from "@/app/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Building2, MapPin, Award, Briefcase, User, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { Button } from "@/app/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/app/components/ui/command";

interface EmployeeInfoPanelProps {
  employee: Employee | null;
  employees?: Employee[];
  onEmployeeChange?: (employeeId: string, employee: Employee) => void;
}

export function EmployeeInfoPanel({ employee, employees, onEmployeeChange }: EmployeeInfoPanelProps) {
    const [isOpen, setIsOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    const filteredEmployees = (employees ?? []).filter((emp) => {
        const term = searchQuery.toLowerCase().trim();
        if (!term) return true;

        return (
            emp.fullName.toLowerCase().includes(term) ||
            emp.category.toLowerCase().includes(term) || // ✅ categoría
            emp.office.toLowerCase().includes(term)       // ✅ oficina
        );
    });
  
  // If no employee is selected, show empty state
  if (!employee) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card
          className="border-0 sticky top-6"
          style={{ boxShadow: "var(--shadow-lg)" }}
        >
          <CardContent className="p-6 space-y-6">
            {/* Empty State */}
            <div className="text-center space-y-4 py-8">
              <div className="mx-auto h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="h-10 w-10 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-muted-foreground">
                  No employee selected
                </h3>
                <p className="text-xs text-muted-foreground mt-2">
                  Select an employee to view their information
                </p>
              </div>
              
                        {/* Employee selector in empty state */}
                        {employees && employees.length > 0 && onEmployeeChange && (
                            <div className="pt-4">
                                <Popover open={isOpen} onOpenChange={setIsOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs"
                                            style={{ background: "var(--gradient-card)" }}
                                        >
                                            Select Emplo
                                            <ChevronDown className="h-3 w-3 ml-2" />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-72 p-0" align="center">
                                        <Command>
                                            <CommandInput
                                                placeholder="Search by name, category or office..."
                                                className="h-9"
                                                value={searchQuery}
                                                onValueChange={setSearchQuery}
                                            />

                                            <CommandList>
                                                <CommandEmpty>No employees found.</CommandEmpty>

                                                <CommandGroup>
                                                    {filteredEmployees.map((emp) => {
                                                        return (
                                                            <CommandItem
                                                                key={emp.id}
                                                                value={`${emp.id}|${emp.fullName} ${emp.category} ${emp.office}`}
                                                                onSelect={() => {
                                                                    onEmployeeChange(emp.id, emp);
                                                                    setIsOpen(false);
                                                                    setSearchQuery("");
                                                                }}
                                                                className={`
                      group
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left
                      transition-colors

                      /* estado normal */
                      bg-white text-foreground

                      /* hover / highlighted */
                      data-[highlighted]:bg-blue-600
                      data-[highlighted]:text-white
                    `}
                                                            >
                                                                <Avatar className="h-8 w-8 shrink-0">
                                                                    <AvatarFallback
                                                                        className={`
                          text-xs font-medium transition-colors

                          /* estado normal */
                          bg-gray-100 text-foreground

                          /* hover: iniciales negras */
                          group-data-[highlighted]:bg-white
                          group-data-[highlighted]:text-black
                        `}
                                                                    >
                                                                        {emp.fullName
                                                                            .split(" ")
                                                                            .map((n) => n[0])
                                                                            .join("")
                                                                            .toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>

                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-sm truncate">
                                                                        {emp.fullName}
                                                                    </p>
                                                                    <p className="text-xs truncate">
                                                                        {emp.category} • {emp.office}
                                                                    </p>
                                                                </div>
                                                            </CommandItem>
                                                        );
                                                    })}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )}
            </div>

            {/* Inactive Footer */}
            <div
              className="py-2 border-t border-border text-center opacity-50"
              style={{ background: "var(--gradient-card)" }}
            >
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5" />
                <span>Fiscal Year: 2026</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Employee is selected - show their data
  const initials = employee.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card
        className="border-0 sticky top-6"
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <Avatar className="h-20 w-20 mx-auto ring-4 ring-blue-50">
              <AvatarImage src="" alt={employee.fullName} />
              <AvatarFallback
                className="text-2xl font-bold text-white"
                style={{ background: "var(--gradient-primary)" }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center justify-center gap-2">
                <h3 className="font-bold text-lg" style={{ color: "var(--kpmg-blue)" }}>
                  {employee.fullName}
                </h3>
                {employees && employees.length > 0 && onEmployeeChange && (
                  <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-muted-foreground hover:text-[var(--kpmg-blue)]"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-0" align="center">
                      <Command>
                        <CommandInput placeholder="Search employees..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No employees found.</CommandEmpty>
                          <CommandGroup>
                            {employees.map((emp) => (
                              <CommandItem
                                key={emp.id}
                                value={emp.fullName}
                                onSelect={() => {
                                  onEmployeeChange(emp.id, emp);
                                  setIsOpen(false);
                                }}
                                className="cursor-pointer"
                              >
                                <div className="flex items-center gap-3 w-full">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs">
                                      {emp.fullName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{emp.fullName}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {emp.category} • {emp.office}
                                    </p>
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Employee Information</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-lg mt-0.5"
                style={{ background: "var(--gradient-card)" }}
              >
                <Building2 className="h-4 w-4" style={{ color: "var(--kpmg-blue)" }} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Business Unit
                </p>
                <p className="text-sm font-semibold mt-0.5">Audit Services</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-lg mt-0.5"
                style={{ background: "var(--gradient-card)" }}
              >
                <MapPin className="h-4 w-4" style={{ color: "var(--kpmg-blue)" }} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Office
                </p>
                <p className="text-sm font-semibold mt-0.5">{employee.office}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-lg mt-0.5"
                style={{ background: "var(--gradient-card)" }}
              >
                <Award className="h-4 w-4" style={{ color: "var(--kpmg-blue)" }} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Level
                </p>
                <p className="text-sm font-semibold mt-0.5">{employee.category}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="py-2 border-t border-border text-center"
            style={{ background: "var(--gradient-card)" }}
          >
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Fiscal Year: 2026</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}