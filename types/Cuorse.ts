import type { TeachingCenter } from "@/lib/generated/prisma";
import User from "./user";

export default interface Cuorse {
  id: number;
  name: string;
  description: string;
  associatedCenter: TeachingCenter;
  enrolledStudents: User[];
}
