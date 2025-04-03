import { create } from 'zustand';
import { Course } from '@/types/coursesConfig';

interface Store {
    courses: Course[];
    setCourses: (courses: Course[]) => void;
    sortCourses: (newCourses: Course[]) => void;
}

export const sortCoursesFunction = (newCourses: Course[]): {} => {//also must update courses
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
    console.log(newCourseList)
    return newCourseList;
};
const useStore = create<Store>((set) => ({
    courses: [],
    setCourses: (courses: Course[]) => set(() => ({ courses })),
    sortCourses: (newCourses: Course[]) => set(() => sortCoursesFunction(newCourses)),
}));

export default useStore;
