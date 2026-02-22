import { Checkbox } from "@/components/ui/checkbox";
import type { CustomizationOption } from "@/data/menu";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  options: CustomizationOption[];
  selected: CustomizationOption[];
  toggle: (option: CustomizationOption) => void;
}

export function CustomizationGroup({ title, options, selected, toggle }: Props) {
  if (options.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
      {options.map((option) => {
        const checked = !!selected.find((selectedOption) => selectedOption.id === option.id);
        return (
          <label
            key={option.id}
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-lg border border-border px-3 py-2.5 transition-colors",
              checked ? "border-primary bg-primary/10" : "hover:bg-secondary"
            )}
          >
            <div className="flex items-center gap-3">
              <Checkbox checked={checked} onCheckedChange={() => toggle(option)} />
              <span className="text-sm font-medium">{option.label}</span>
            </div>
            {option.price > 0 && (
              <span className="text-sm font-semibold text-primary">+${option.price.toFixed(2)}</span>
            )}
          </label>
        );
      })}
    </div>
  );
}
