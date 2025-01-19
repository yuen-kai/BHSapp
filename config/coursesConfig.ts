export type Course = {
    name: string;
    teacher: string;
    block: string;
    term?: string;
    roomNumber: number;
  };
  
  export let courses: Course[] = [];
  
  export const updateCourses = (newCourses: Course[]) => {
    courses = newCourses;
  };