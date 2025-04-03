export type Course = {
  name: string;
  teacher: string;
  block: string;
  lunch: number; // 1 = first lunch, 2 = 2nd lunch
  term: number;  // 0 = full year, 1 = first semester, 2 = 2nd semester
  roomNumber: string;
};