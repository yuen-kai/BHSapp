import React, { useState } from "react";
import {
	View,
	StyleSheet,
	Keyboard,
	TouchableWithoutFeedback,
} from "react-native";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme, Text, TextInput, FAB } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import { FlashList } from "@shopify/flash-list";
import { Course } from '@/types/coursesConfig';
import useStore, {sortCoursesFunction} from '@/store'

const CourseInfoCard: React.FC<Course> = ({
	name,
	teacher,
	block,
	lunch,
	term,
	roomNumber,
}) => {
	const { colors } = useTheme();
	const { courses, setCourses } = useStore() 

	const deleteCourse = (c:Course) => {
		console.log(courses)
		setCourses(sortCoursesFunction(courses.filter(course => course != c)))
	}
	return (
		<View style={[styles.courseCard, { borderColor: colors.primary }]}>
			<FAB style={{backgroundColor: 'red', aspectRatio: 1, width: 50, alignSelf: 'flex-end', position: 'absolute', alignItems: 'center'}} icon='alpha-x' onPress={() => deleteCourse({"block": block, "lunch": lunch, "name": name, "roomNumber": roomNumber, "teacher": teacher, "term": term})}></FAB>
			<Text style={styles.courseText}>
				<Text style={styles.bold}>Name:</Text> {name}
			</Text>
			<Text style={styles.courseText}>
				<Text style={styles.bold}>Teacher:</Text> {teacher}
			</Text>
			<Text style={styles.courseText}>
				<Text style={styles.bold}>Block:</Text> {block}
			</Text>
			<Text style={styles.courseText}>
				<Text style={styles.bold}>Lunch:</Text> {lunch}
			</Text>
			{term && (
				<Text style={styles.courseText}>
					<Text style={styles.bold}>Term:</Text> {term==3?"Full Year":term==1?"Semester 1":"Semester 2"}
				</Text>
			)}
			<Text style={styles.courseText}>
				<Text style={styles.bold}>Room Number:</Text> {roomNumber}
			</Text>
		</View>
	);
};

export default CourseInfoCard;

const styles = StyleSheet.create({
	courseCard: {
		marginBottom: 10,
		padding: 10,
		borderWidth: 1,
		borderRadius: 5,
	},
	courseText: {
		fontSize: 16,
	},
	bold: {
		fontWeight: "bold",
	},
});
