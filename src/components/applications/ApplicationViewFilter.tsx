import React from "react";
import { Filter } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Define filter options - replace empty strings with specific values
const statusOptions = [
  { value: "all", label: "All Statuses" }, // Changed from "" to "all"
  { value: "pending", label: "Pending" },
  { value: "reviewed", label: "Reviewed" },
  { value: "rejected", label: "Rejected" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "hired", label: "Hired" },
  { value: "Applied", label: "Applied" },
];

const matchSortOptions = [
  { value: "default", label: "Default (Newest)" }, // Changed from "" to "default"
  { value: "desc", label: "Match % (High to Low)" },
  { value: "asc", label: "Match % (Low to High)" },
];

interface FilterProps {
  onApplyFilter: (filters: { status: string; matchSort: string }) => void;
  initialFilters: {
    status: string;
    matchSort: string;
  };
}

const ApplicationViewFilter: React.FC<FilterProps> = ({
  onApplyFilter,
  initialFilters,
}) => {
  // Convert empty strings to our special values for internal state
  const getInitialStatus = () => {
    return initialFilters.status || "all";
  };

  const getInitialMatchSort = () => {
    return initialFilters.matchSort || "default";
  };

  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState(getInitialStatus());
  const [matchSort, setMatchSort] = React.useState(getInitialMatchSort());

  const handleApply = () => {
    // Convert back to empty strings if needed for the API
    // Keep "Applied" as is rather than converting it to lowercase
    onApplyFilter({
      status: status === "all" ? "" : status,
      matchSort: matchSort === "default" ? "" : matchSort,
    });
    setOpen(false);
  };

  const handleReset = () => {
    setStatus("all");
    setMatchSort("default");
    onApplyFilter({ status: "", matchSort: "" });
    setOpen(false);
  };

  // Check if active filters are set
  const isFiltersActive =
    initialFilters.status !== "" || initialFilters.matchSort !== "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`ml-2 ${
            isFiltersActive ? "bg-blue-50 border-blue-300" : ""
          }`}
        >
          <Filter
            className={`h-4 w-4 mr-1 ${isFiltersActive ? "text-blue-500" : ""}`}
          />
          Filter
          {isFiltersActive && (
            <span className="ml-1 bg-blue-500 text-white rounded-full px-1.5 py-0.5 text-xs">
              !
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Applications</DialogTitle>
          <DialogDescription>
            Apply filters to find specific applicants.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <div className="col-span-3">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Application Status</SelectLabel>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="matchSort" className="text-right">
              Sort by
            </Label>
            <div className="col-span-3">
              <Select value={matchSort} onValueChange={setMatchSort}>
                <SelectTrigger id="matchSort">
                  <SelectValue placeholder="Sort by match percentage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Match Percentage</SelectLabel>
                    {matchSortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit" onClick={handleApply}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationViewFilter;
