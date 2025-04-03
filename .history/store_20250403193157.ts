import { create } from 'zustand';
import { Course } from '@/types/coursesConfig';

interface Store {
    courses: Course[];
    setCourses: (courses: Course[]) => void;
}

export const sortCoursesFunction = (newCourses: Course[]): Course[] => {//also must update courses
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
    return newCourseList;
};
const useStore = create<Store>((set) => ({
    courses: [],
    setCourses: (courses: Course[]) => set(() => ({ courses })),
}));

export default useStore;
