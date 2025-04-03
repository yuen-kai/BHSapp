import { create } from 'zustand';
import { Course } from '@/types/coursesConfig';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeCourses = async (value: Course[]) => {
    try {
        await AsyncStorage.setItem('courses', JSON.stringify(value));
    } catch (e) {
        // saving error
    }
};

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
    setCourses: (courses: Course[]) => {
        set(() => ({ courses }))
        storeCourses(courses)
    },
}));

/*const getCourses = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('courses');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      return []
    }
  };
const { setCourses } = useStore()
setCourses(await getCourses())*/

export default useStore;
