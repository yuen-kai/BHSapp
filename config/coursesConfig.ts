export type Course = {
  name: string;
  teacher: string;
  block: string;
  lunch: number; // 1 = first lunch, 2 = 2nd lunch
  term: number;  // 0 = full year, 1 = first semester, 2 = 2nd semester
  roomNumber: string;
};

export let courses: Course[] = [];

export const sortCourses = (newCourses: Course[]) => {
  let newCourseList = [];
  let blockList = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  let blockIndex = 0;
  for (let i = 0; i < blockList.length; i++) {
    for (const course of newCourses) {
      if (course.block == blockList[blockIndex]) {
        newCourseList.push(course);
      }
    }
    blockIndex++;
  }
  courses = newCourseList;
};