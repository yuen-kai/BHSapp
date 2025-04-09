import { create } from 'zustand';
import { Course } from '@/types/coursesConfig';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeCourses = async (value: Course[]) => {
    try {
        await AsyncStorage.setItem('courses', JSON.stringify(value));
    } catch (e) {
        // saving error
    }
};
const getCourses = async (): Promise<Course[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem('courses');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      // error reading value
      return []
    }
  };
interface Store {
    courses: Course[];
    setCourses: (courses: Course[]) => void;
}

const initializeStore = async (set: any) => {
    const savedCourses = await getCourses();
    const sortedCourses = sortCoursesFunction(savedCourses);
    set({ courses: sortedCourses });
    storeCourses(sortedCourses); // Save sorted courses back to AsyncStorage
};

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

initializeStore(useStore.setState);

export default useStore;
