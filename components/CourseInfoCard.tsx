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
import { Course } from '@/config/coursesConfig';

const CourseInfoCard: React.FC<Course> = ({
	name,
	teacher,
	block,
	lunch,
	term,
	roomNumber,
}) => {
	const { colors } = useTheme();

	return (
		<View style={[styles.courseCard, { borderColor: colors.primary }]}>
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
