export type Course = {
    name: string;
    teacher: string;
    block: string;
    term?: string;
    roomNumber: number;
  };
  
  export let courses: Course[] = [];
  
  export const updateCourses = (newCourses: Course[]) => {
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