import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme, Text, TextInput, Button, FAB } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import { FlashList } from "@shopify/flash-list";
import { Course } from "@/types/coursesConfig";
import CourseInfoCard from "@/components/CourseInfoCard";
import useStore, { sortCoursesFunction } from "@/store";

const AddCourseScreen = () => {
  const { colors } = useTheme();
  const [courseName, setCourseName] = useState("");
  const [courseTeacher, setCourseTeacher] = useState("");
  const [courseBlock, setCourseBlock] = useState("");
  const [courseLunch, setLunch] = useState(NaN);
  const [term, setTerm] = useState(NaN);
  const [roomNumber, setRoomNumber] = useState("");
  const [addedCourses, setAddedCourses] = useState<Course[]>([]);
  const { courses, setCourses } = useStore();

  const blockOptions = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
    { label: "E", value: "E" },
    { label: "F", value: "F" },
    { label: "G", value: "G" },
  ];

  const lunchOptions = [
    { label: "Lunch 1", value: "1" },
    { label: "Lunch 2", value: "2" },
  ];

  const termOptions = [
    { label: "Semester 1", value: "1" },
    { label: "Semester 2", value: "2" },
    { label: "Full Year", value: "3" },
  ];

  const handleAddCourse = () => {
    if (!courseName || !courseTeacher || !courseBlock || !roomNumber) {
      alert(
        "Please fill in the course name, teacher, main block, and room number."
      );
      return;
    }

    const newCourse: Course = {
      name: courseName,
      teacher: courseTeacher,
      block: courseBlock,
      lunch: courseLunch,
      term: term,
      roomNumber: roomNumber,
    };

    setAddedCourses([...addedCourses, newCourse]);
    setCourses(sortCoursesFunction([...addedCourses, newCourse]));
    console.log(courses);
    // Clear inputs
    setCourseName("");
    setCourseTeacher("");
    setCourseBlock("");
    setLunch(NaN);
    setTerm(NaN);
    setRoomNumber("");
  };
  const deleteCourse = (c: Course) => {
    console.log(c, courses);
	const newCourses = [...courses];
    const indexToRemove = newCourses.findIndex(
      (course) =>
        course.name === c.name &&
        course.block === c.block &&
        course.lunch === c.lunch &&
        course.roomNumber === c.roomNumber &&
        course.teacher === c.teacher &&
        course.term === c.term
    );

    if (indexToRemove !== -1) {
      newCourses.splice(indexToRemove, 1); // Remove the item if found
    }
    setAddedCourses(sortCoursesFunction(newCourses));
    setCourses(sortCoursesFunction(newCourses));
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={[styles.title, { color: colors.primary }]}>
          Add a Course
        </Text>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <TextInput
              label="Course Name"
              value={courseName}
              onChangeText={setCourseName}
              mode="outlined"
              style={styles.input}
              onSubmitEditing={Keyboard.dismiss}
            />

            <TextInput
              label="Course Teacher"
              value={courseTeacher}
              onChangeText={setCourseTeacher}
              mode="outlined"
              style={styles.input}
              onSubmitEditing={Keyboard.dismiss}
            />
          </>
        </TouchableWithoutFeedback>

        <View style={styles.input}>
          <Dropdown
            options={blockOptions}
            label="Main Block"
            placeholder="Select Main Block"
            value={courseBlock}
            onSelect={(value) => setCourseBlock(value || "")}
            mode={"outlined"}
            // style={[styles.input]}
            // placeholderStyle={styles.placeholderStyle}
            // selectedTextStyle={styles.selectedTextStyle}
          />
        </View>
        <View style={styles.input}>
          <Dropdown
            options={lunchOptions}
            label="Lunch"
            placeholder="Select Lunch"
            value={courseLunch.toString()}
            onSelect={(value) => setLunch(Number(value) || NaN)}
            mode={"outlined"}

            // style={[styles.input, styles.dropdown]}
            // placeholderStyle={styles.placeholderStyle}
            // selectedTextStyle={styles.selectedTextStyle}
          />
        </View>
        <View style={styles.input}>
          <Dropdown
            options={termOptions}
            label="Term"
            placeholder="Select Term"
            value={term.toString()}
            onSelect={(value) => setTerm(Number(value) || NaN)}
            mode={"outlined"}

            // style={[styles.input, styles.dropdown]}
            // placeholderStyle={styles.placeholderStyle}
            // selectedTextStyle={styles.selectedTextStyle}
          />
        </View>
        <TextInput
          label="Room Number"
          value={roomNumber}
          onChangeText={(text) => setRoomNumber(text)}
          mode="outlined"
          style={styles.input}
          onSubmitEditing={Keyboard.dismiss}
        />

        <Button
          mode="contained"
          onPress={handleAddCourse}
          style={styles.button}
        >
          Add Course
        </Button>
        <View style={styles.courseList}>
          <Text style={styles.subTitle}>Added Courses</Text>
          <FlashList
            data={courses}
            keyExtractor={(item) =>
              `${item.name}-${item.block}-${item.teacher}-${item.term}-${item.roomNumber}`
            }
            renderItem={({ item }) => (
              <CourseInfoCard
                name={item.name}
                teacher={item.teacher}
                block={item.block}
                lunch={item.lunch}
                term={item.term}
                roomNumber={item.roomNumber}
              >
                <FAB
                  style={{
                    backgroundColor: "red",
                    aspectRatio: 1,
                    alignSelf: "flex-end",
                    position: "absolute",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 5,
                  }}
                  icon="alpha-x"
                  size="medium"
                  onPress={() =>
                    deleteCourse({
                      block: item.block,
                      lunch: item.lunch,
                      name: item.name,
                      roomNumber: item.roomNumber,
                      teacher: item.teacher,
                      term: item.term,
                    })
                  }
                ></FAB>
              </CourseInfoCard>
            )}
            estimatedItemSize={100}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  placeholderStyle: {
    color: "#777",
    fontSize: 16,
  },
  selectedTextStyle: {
    color: "#000",
    fontSize: 16,
  },
  button: {
    marginTop: 10,
  },
  courseList: {
    marginTop: 30,
    flex: 1,
  },
  subTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default AddCourseScreen;
