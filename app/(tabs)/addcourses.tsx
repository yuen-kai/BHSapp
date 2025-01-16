import React, { useState } from "react";
import {
	View,
	StyleSheet,
	Keyboard,
	TouchableWithoutFeedback,
} from "react-native";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme, Text, TextInput, Button } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import { FlashList } from "@shopify/flash-list";
import CourseInfoCard from "@/components/CourseInfoCard";

type Course = {
	name: string;
	teacher: string;
	block: string;
	term?: string;
	roomNumber: string;
};

const AddCourseScreen = () => {
	const { colors } = useTheme();
	const [courseName, setCourseName] = useState("");
	const [courseTeacher, setCourseTeacher] = useState("");
	const [courseBlock, setCourseBlock] = useState("");
	const [term, setTerm] = useState("");
	const [roomNumber, setRoomNumber] = useState("");
	const [addedCourses, setAddedCourses] = useState<Course[]>([]);

	const blockOptions = [
		{ label: "A", value: "A" },
		{ label: "B", value: "B" },
		{ label: "C", value: "C" },
		{ label: "D", value: "D" },
		{ label: "E", value: "E" },
		{ label: "F", value: "F" },
		{ label: "G", value: "G" },
	];

	const termOptions = [
		{ label: "Semester 1", value: "S1" },
		{ label: "Semester 2", value: "S2" },
		{ label: "Full Year", value: "FY" },
	];

	const handleAddCourse = () => {
		if (!courseName || !courseTeacher || !courseBlock || !roomNumber) {
			alert("Please fill in the course name, teacher, main block, and room number.");
			return;
		}

		const newCourse: Course = {
			name: courseName,
			teacher: courseTeacher,
			block: courseBlock,
			term: term || undefined,
			roomNumber,
		};

		setAddedCourses([...addedCourses, newCourse]);

		// Clear inputs
		setCourseName("");
		setCourseTeacher("");
		setCourseBlock("");
		setTerm("");
		setRoomNumber("");
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
						options={termOptions}
						label="Term"
						placeholder="Select Term"
						value={term}
						onSelect={(value) => setTerm(value || "")}
						mode={"outlined"}

						// style={[styles.input, styles.dropdown]}
						// placeholderStyle={styles.placeholderStyle}
						// selectedTextStyle={styles.selectedTextStyle}
					/>
				</View>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<>
						<TextInput
							label="Room Number"
							value={roomNumber}
							onChangeText={setRoomNumber}
							mode="outlined"
							style={styles.input}
							onSubmitEditing={Keyboard.dismiss}
						/>
					</>
				</TouchableWithoutFeedback>
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
						data={addedCourses}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item }) => (
							<CourseInfoCard
								name={item.name}
								teacher={item.teacher}
								block={item.block}
								term={item.term}
								roomNumber={item.roomNumber}/>
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
