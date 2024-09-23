import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/ui/DesignKit/Select";

export interface Option {
  value: string;
  label: string;
}

const OptionSelect = ({
  options,
  selected,
  setSelected,
  menuLabel
}: {
  options: Option[];
  selected: Option;
  setSelected: (option: Option) => void;
  menuLabel: string;
}) => {


  return (
    <Select value={selected.value} onValueChange={(value) => setSelected(options.find(el => el.value === value))}>
      <SelectTrigger>
        <SelectValue placeholder="Select a network" />
      </SelectTrigger>
      <SelectContent className="border border-accent">
        <SelectGroup>
          <SelectLabel>{menuLabel}</SelectLabel>
          {options.map((option, index) => (
            <SelectItem key={index} value={option.value}>
              <div className="flex flex-row gap-1 items-center">
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )

};

export default OptionSelect;
