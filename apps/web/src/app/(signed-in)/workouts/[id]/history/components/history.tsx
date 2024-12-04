"use client";

import { DateTime } from "@/components/date-time";
import { IconButton } from "@/components/icon-button";
import { Grow } from "@/components/layout/grow";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { useState } from "react";

interface Props {
  className?: string;
  date: string;
  children: React.ReactNode;
}

export function History({ className, date, children }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={className}>
      <div className="flex items-center mb-2">
        <DateTime iso={date} />
        <Grow />
        <IconButton variant="bordered" onClick={() => setIsExpanded((e) => !e)}>
          {isExpanded ? (
            <ChevronUpIcon size={16} />
          ) : (
            <ChevronDownIcon size={16} />
          )}
        </IconButton>
      </div>
      {isExpanded && children}
    </div>
  );
}
