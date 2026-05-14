export type Branch = {
  slug: string;
  name: string;
  area: string;
  address: string;
  phone: string;
  email: string;
  established: string;
  facilities: string[];
};

export const branches: Branch[] = [
  {
    slug: "banjara-hills",
    name: "HCS Balkampet",
    area: "Balkampet",
    address: "Road No. 12, Balkampet, Hyderabad, Telangana 500034",
    phone: "+91 40 2354 1100",
    email: "info@hcschools.in",
    established: "1998",
    facilities: ["Smart Classrooms", "Science & Robotics Labs", "Olympic-Size Pool", "Auditorium", "Cafeteria", "Transport"],
  },
  {
    slug: "kukatpally",
    name: "HCS Kukatpally",
    area: "Kukatpally",
    address: "KPHB Phase 6, Kukatpally, Hyderabad, Telangana 500072",
    phone: "+91 40 2305 4400",
    email: "info@hcschools.in",
    established: "2005",
    facilities: ["Digital Library", "STEM Lab", "Indoor Sports Arena", "Music & Dance Studio", "Medical Room", "Transport"],
  },
  {
    slug: "fathenagar",
    name: "HCS Fathenagar",
    area: "Fathenagar",
    address: "SP Road, Near Clock Tower, Fathenagar, Telangana 500003",
    phone: "+91 40 2784 7700",
    email: "info@hcschools.in",
    established: "2012",
    facilities: ["AI & Coding Lab", "Library", "Cricket & Football Grounds", "Art Studio", "Counselling Center", "Transport"],
  },
];
