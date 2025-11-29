

export interface Department {
  id: number;
  code: string;
  name: string;
  created_at: string;
  status: "Active" | "Inactive";
}



export const departments = [
  {
    id: 1,
    code: "CS",
    name: "Computer Science",
    created_at: "2022-06-01T10:00:00Z",
    status: "Active",
  },
  {
    id: 2,
    code: "IT",
    name: "Information Technology",
    created_at: "2022-06-15T14:30:00Z",
    status: "Active",
  },
  {
    id: 3,
    code: "IS",
    name: "Information Systems",
    created_at: "2022-07-05T09:45:00Z",
    status: "Inactive",
  },
  {
    id: 4,
    code: "ENG",
    name: "Engineering",
    created_at: "2021-09-21T08:15:00Z",
    status: "Active",
  },
  {
    id: 5,
    code: "EDUC",
    name: "Education",
    created_at: "2021-11-11T16:00:00Z",
    status: "Inactive",
  },
];
