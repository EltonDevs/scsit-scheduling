import {
  Schedule,
  createSchedule,
  deleteSchedule,
  getSchedules,
  updateSchedule,
  getSchedulesByDepartmentid,
} from "@/services/scheduleService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useSchedules(departmentId?: string) {
  const queryClient = useQueryClient();

  // Fetch all schedules or by department
  const scheduleQuery = useQuery<Schedule[]>({
    queryKey: departmentId ? ["schedules", departmentId] : ["schedules"],
    queryFn: () =>
      departmentId ? getSchedulesByDepartmentid(departmentId) : getSchedules(),
    staleTime: 1000 * 60 * 5,
  });

  //  Create schedule
  const createSchedules = useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast.success("Schedule created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create schedule");
    },
  });

  //  Update schedule
  const updateSchedules = useMutation({
    mutationFn: ({
      scheduleId,
      schedule,
    }: {
      scheduleId: string;
      schedule: Partial<Omit<Schedule, "scheduleId" | "createdAt" | "updatedAt">>;
    }) => updateSchedule(scheduleId, schedule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast.success("Schedule updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update schedule");
    },
  });

  // Delete schedule
  const deleteSchedules = useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast.success("Schedule deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete schedule");
    },
  });

  return { 
    scheduleQuery, 
    createSchedules, 
    updateSchedules, 
    deleteSchedules 
  };
}