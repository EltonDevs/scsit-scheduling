


import { createRoom, deleteRoom, getRooms, getRoomsByDepartmentId, Room, updateRoom } from "@/services/roomService";
import { useQuery,
     useMutation,
      useQueryClient 
    } from "@tanstack/react-query";


export function useRooms(departmentId? : string) {
  const queryClient = useQueryClient();

  // Fetch all sections
  const roomQuery = useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: getRooms,
    staleTime: 1000 * 60 * 5, 
  });

  //fetch all rooms my departmentid
     const roomQueryByDepartmentid = useQuery<Room[]>({
        queryKey: ["rooms", departmentId],
        queryFn: () => getRoomsByDepartmentId(departmentId!),
        enabled: !!departmentId, 
        staleTime: 1000 * 60 * 5,
      });

  // Create rooms
  const createRooms = useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  //update rooms
  const updateRooms = useMutation({
    mutationFn: ({ roomId, room }: { roomId: string; room: Partial<Room> }) =>
      updateRoom(roomId, room),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  //delete rooms
  const deleteRooms = useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

    
  




  return { roomQuery,
    roomQueryByDepartmentid,
    createRooms,
    updateRooms,
    deleteRooms
   
   
     };
}
