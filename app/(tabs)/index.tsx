import {
	Image,
	StyleSheet,
	Platform,
	View,
	useColorScheme,
} from "react-native";
import { Text, Card } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProgressBar, MD3Colors } from "react-native-paper";
import React, { useEffect } from "react";
import { Font } from "react-native-paper/lib/typescript/types";
import { FlashList } from "@shopify/flash-list";
import { clamp } from "react-native-reanimated";

export default function HomeScreen() {
	let currentCourse;
	type Course = {
		name: string;
		teacher: string;
		block: string;
		//  (string[])[5]
		rmNum: number;
	};

	type Schedule = {
		block: string;
		start: string;
		end: string;
	};

	const convertToDate = (time: string): Date => {
		const [timePart, modifier] = time.split(" ");
		let [hours, minutes] = timePart.split(":").map(Number);
		if (modifier === "pm" && hours < 12) {
			hours += 12;
		}
		if (modifier === "am" && hours === 12) {
			hours = 0;
		}
		const date = new Date();
		date.setHours(hours, minutes, 0, 0);
		return date;
	};

	let courses: Course[] = [
		{ name: "English", teacher: "Mr. McGarry", block: "A", rmNum: 324 },
		{ name: "Math", teacher: "Ms. Smith", block: "B", rmNum: 124 },
		{ name: "Science", teacher: "Mr. Johnson", block: "C", rmNum: 204 },
		{ name: "History", teacher: "Ms. Lee", block: "D", rmNum: 304 },
		{ name: "Art", teacher: "Mr. Brown", block: "E", rmNum: 404 },
		{
			name: "Physical Education",
			teacher: "Ms. Davis",
			block: "F",
			rmNum: 504,
		},
		{ name: "Music", teacher: "Mr. Wilson", block: "G", rmNum: 604 },
	];

	let schedule: Schedule[] = [
		{ block: "A", start: "8:20 am", end: "9:15 am" },
		{ block: "B", start: "9:22 am", end: "10:17 am" },
		{ block: "C", start: "10:24 am", end: "11:19 am" },
		{ block: "D", start: "11:26 am", end: "12:21 pm" },
		{ block: "E", start: "12:24 pm", end: "12:51 pm" },
		{ block: "F", start: "12:58 pm", end: "1:53 pm" },
		{ block: "G", start: "2:00 pm", end: "2:55 pm" },
	];

	const [timeRemaining, setTimeRemaining] = React.useState(55);

	const findNearestStartTime = (): Date | null => {
		const now = new Date();
		for (let i = 0; i < schedule.length; i++) {
		  const startTime = convertToDate(schedule[i].start);
		  if (startTime > now) {
			return convertToDate(schedule[i].start);
		  } else if (i === schedule.length-1) {
			return convertToDate(schedule[schedule.length-1].start);
		  }
		}
		return null;
	};

	const findNearestFutureEndTime = (): Date | null => {
		const now = new Date();
		for (let i = 0; i < schedule.length; i++) {
		  const endTime = convertToDate(schedule[i].end);
		  if (endTime > now) {
			return endTime;
		  }
		}
		return null;
	};
	function getDifferenceInMinutes(currentDate: Date, endTime: Date) {
		return Math.max(
			0,
			Math.round((endTime.getTime() - currentDate.getTime()) / (1000 * 60))
		);
	}

	const [nearestStartTime, setNearestStartTime] = React.useState(findNearestStartTime())
	const [nearestEndTime, setNearestEndTime] = React.useState(findNearestFutureEndTime())
	const [progress, setProgress] = React.useState(0);
	useEffect(() => {
		const interval = setInterval(() => {
			setNearestStartTime(findNearestStartTime());
			setNearestEndTime(findNearestFutureEndTime());
     		if (nearestEndTime) {
        		setTimeRemaining(getDifferenceInMinutes(new Date(), nearestEndTime));
      		}
			// console.log(progress)
			if (nearestStartTime && nearestEndTime) {
				setProgress(parseFloat(clamp(((getDifferenceInMinutes(nearestStartTime, nearestEndTime) - getDifferenceInMinutes(new Date(), nearestEndTime)) / getDifferenceInMinutes(nearestStartTime, nearestEndTime)), 0, 1).toFixed(2)));
			}
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const isDarkMode = useColorScheme() === "dark";
	return (
		<SafeAreaView
			style={{
				paddingTop: 10,
				flex: 1,
				width: "100%",
				height: "100%",
				backgroundColor: isDarkMode ? "#303d4b" : "white",
			}}
		>
			{/* Course Info Card */}
			<Card style={styles.courseCard}>
				<Card.Content>
					<Text style={styles.courseInfoTitle}>{courses[0].name}</Text>
					<Text style={styles.courseInfoSubTitle}>
						{courses[0].teacher} • Room {courses[0].rmNum}
					</Text>
					<Text style={styles.courseInfoSubTitle}>
						{courses[0].block} Block
					</Text>
				</Card.Content>
			</Card>

			{/* Progress Bar */}
			<View
				style={{
					position: "relative",
					width: "80%",
					alignSelf: "center",
					marginTop: "5%",
					marginBottom: "5%",
					height: "12.5%",
				}}
			>
				<ProgressBar
					progress={progress}
					color={MD3Colors.error50}
					style={{
						height: "100%",
						borderRadius: 100,
						alignSelf: "center",
						width: "100%",
					}}
				/>
				<Text
					style={{
						position: "absolute",
						left: "50%",
						top: "50%",
						transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
						fontSize: 28,
						color: isDarkMode ? "white" : "black",
					}}
				>
					{timeRemaining} minute{timeRemaining == 1 ? "" : "s"} remaining
				</Text>
			</View>

      {/* Course List */}
			<FlashList
				data={courses}
				keyExtractor={(item) => item.block}
				estimatedItemSize={80}
				renderItem={({ item }) => {
					const times = schedule.find((s) => s.block === item.block);
					return (
						<Card style={styles.courseItemCard}>
							<Card.Title title={item.name} titleStyle={styles.courseItemTitle} />
							<Card.Content style={styles.courseItemContent}>
								<Text style={styles.courseItemSubtitle}>{item.teacher}</Text>
								<Text style={styles.courseItemSubtitle}>Room {item.rmNum}</Text>
								<Text style={styles.courseItemSubtitle}>Block {item.block}</Text>
								<Text style={styles.courseItemSubtitle}>Starts {times?.start}</Text>
								<Text style={styles.courseItemSubtitle}>Ends {times?.end}</Text>
							</Card.Content>
						</Card>
					);
				}}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	headerContainer: {
		top: "5%",
		width: "100%",
		alignSelf: "center",
		height: "31%",
	},
	courseInfoTitle: {
		fontSize: 48,
		textAlign: "center",
		marginTop: "10%",
	},
	courseInfoSubTitle: {
		fontSize: 24,
		textAlign: "center",
		marginTop: "10%",
	},
	courseCard: {
		margin: 16,
		padding: 16,
		elevation: 4,
		backgroundColor: "#424c5e",
		borderRadius: 8,
	},
	courseItemCard: {
		margin: 8,
		borderRadius: 12,
		elevation: 4,
		backgroundColor: "#607d8b"
	},
	courseItemTitle: {
		fontSize: 22,
		color: "white"
	},
	courseItemContent: {
		marginTop: -8
	},
	courseItemSubtitle: {
		color: "#ddd",
		marginBottom: 4
	},
});
