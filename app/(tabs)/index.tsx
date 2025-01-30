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
import { Course, courses } from '@/config/coursesConfig';
import { FlashList } from "@shopify/flash-list";
import { clamp } from "react-native-reanimated";

export default function HomeScreen() {
	type Schedule = {
		block: string;
		start: string;
		end: string;
		lunch: boolean
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

	let schedule: Schedule[] = [
		{ block: "A", start: "8:20 am", end: "9:15 am", lunch: false },
		{ block: "B", start: "9:22 am", end: "10:17 am", lunch: false },
		{ block: "C", start: "10:24 am", end: "11:19 am", lunch: false },
		{ block: "D", start: "11:26 am", end: "12:21 pm", lunch: false },
		{ block: "E", start: "12:24 pm", end: "12:51 pm", lunch: true },
		{ block: "F", start: "12:58 pm", end: "1:53 pm", lunch: false },
		{ block: "G", start: "2:00 pm", end: "2:55 pm", lunch: false },
	];

	const [timeRemaining, setTimeRemaining] = React.useState(0);

	const findCurrentBlock = (): Schedule | null => {
		const now = new Date();
		for (let i = 0; i < schedule.length; i++) {
			const startTime = convertToDate(schedule[i].start);
			const endTime = convertToDate(schedule[i].end);
			if (startTime < now && now < endTime) {
				return schedule[i]
			}
			if( i + 1 < schedule.length && endTime < now && now < convertToDate(schedule[i+1].start)) {
				return { block: "Transition", start: schedule[i].end, end: schedule[i+1].start, lunch: false };
			}
			if( i + 1 === schedule.length && endTime < now) {
				return { block: "After School", start: schedule[i].end, end: "No End Time", lunch: false };
			}
		}
		return { block: "No Class", start: "No Start Time", end: "No End Time", lunch: false };
	};

	const findCurrentClass = (): Course | null => {
		const now = new Date();
		for (let i = 0; i < courses.length; i++) {
			if (courses[i].block === findCurrentBlock()?.block) {
				return courses[i];
			}
		}
		return null;
	}

	function getDifferenceInMinutes(currentDate: Date, endTime: Date) {
		return Math.max(
			0,
			Math.floor((endTime.getTime() - currentDate.getTime()) / (1000 * 60))
		);
	}
	function secondsUntilNextMinute() {
		const now = new Date();
		return (60 - now.getSeconds()) - 1;
	}
	const [nearestStartTime, setNearestStartTime] = React.useState(findNearestStartTime())
	const [nearestEndTime, setNearestEndTime] = React.useState(findNearestFutureEndTime())
	const [progress, setProgress] = React.useState(0);
	useEffect(() => {
		const interval = setInterval(() => {
			setNearestStartTime(findNearestStartTime());
			setNearestEndTime(findNearestFutureEndTime());
			if (nearestEndTime && nearestStartTime && nearestStartTime < new Date()) {
				setTimeRemaining(getDifferenceInMinutes(new Date(), nearestEndTime));
			} else {//supposed to indicate non-block time such as transition and outside hours but i doubt it works, maybe introduce variable if its transition time or office hours or active block or something like that?
				if (nearestStartTime) {
					console.log(getDifferenceInMinutes(new Date(), nearestStartTime))
					setTimeRemaining(getDifferenceInMinutes(new Date(), nearestStartTime));
				}
			}
			if (nearestStartTime && nearestEndTime) {//still sometimes loss in precision in certain minutes, sometimes 55.00000001 or smth
				const totalMinutes = getDifferenceInMinutes(nearestStartTime, nearestEndTime);
				const remainingMinutes = getDifferenceInMinutes(new Date(), nearestEndTime);
				const progressValue = clamp((totalMinutes - remainingMinutes) / totalMinutes, 0, 1);
				setProgress(Number(progressValue.toFixed(2)));
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
					<Text style={styles.courseInfoTitle}>{findCurrentClass()?.name || 'No Class'}</Text>
					<Text style={styles.courseInfoSubTitle}>
						{findCurrentClass()?.teacher || 'No Teacher'} • Room {findCurrentClass()?.roomNumber || 'N/A'}
					</Text>
					<Text style={styles.courseInfoSubTitle}>
						{findCurrentBlock() ? findCurrentBlock() : 'No Block'} Block
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
						fontSize: 36,//formerly 28
						color: isDarkMode ? "white" : "black",
					}}
				>
					{timeRemaining}:{(secondsUntilNextMinute() >= 10) ? secondsUntilNextMinute() : '0' + secondsUntilNextMinute()} left
				</Text>
			</View>

			{/* Course List */}
			<FlashList
				data={courses}
				keyExtractor={(item, index) => `${item.name}-${index}`}//formerly for item.block but item.block is not unique
				estimatedItemSize={100}
				renderItem={({ item }) => {
					const times = schedule.find((s) => s.block === item.block);
					return (
						<Card style={styles.courseItemCard}>
							<Card.Title title={item.name} titleStyle={styles.courseItemTitle} />
							<Card.Content style={styles.courseItemContent}>
								<Text style={styles.courseItemSubtitle}>{item.teacher}</Text>
								<Text style={styles.courseItemSubtitle}>Room {item.roomNumber}</Text>
								<Text style={styles.courseItemSubtitle}>Block {item.block}</Text>
								<Text style={styles.courseItemSubtitle}>Term {item.term}</Text>
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
	courseInfoTitle: {//course names like American Studies Hsty H need to fit. initially font size 48
		fontSize: 36,
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
