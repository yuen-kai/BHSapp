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

	const weekDaySchedule = [
		[//sunday temp, had to add so app still works, 
			{ block: "Sunday", start: "12:00 am", end: "11:59 pm", lunch: false }//11:31-32 am sunday with sunday 11:10am-11:49am
		],
		[//monday
			{ block: "A", start: "8:20 am", end: "9:15 am", lunch: false },
			{ block: "B", start: "9:22 am", end: "10:17 am", lunch: false },
			{ block: "D", start: "10:24 am", end: "11:19 am", lunch: false },
			{ block: "E", start: "11:26 am", end: "12:21 pm", lunch: true },
			{ block: "E", start: "11:56 am", end: "12:51 pm", lunch: true },
			{ block: "F", start: "12:58 pm", end: "1:53 pm", lunch: false },
			{ block: "G", start: "2:00 pm", end: "2:55 pm", lunch: false }
		],
		[//tuesday
			{ block: "C", start: "8:20 am", end: "9:15 am", lunch: false },
			{ block: "B", start: "9:22 am", end: "10:17 am", lunch: false },
			{ block: "D", start: "10:24 am", end: "11:19 am", lunch: false },
			{ block: "E", start: "11:26 am", end: "12:21 pm", lunch: true },
			{ block: "E", start: "11:56 am", end: "12:51 pm", lunch: true },
			{ block: "F", start: "12:58 pm", end: "1:53 pm", lunch: false },
			{ block: "G", start: "2:00 pm", end: "2:55 pm", lunch: false }
		],
		[//wednesday
			{ block: "A", start: "8:20 am", end: "9:15 am", lunch: false },
			{ block: "T", start: "9:20 am", end: "9:57 am", lunch: false },
			{ block: "C", start: "10:03 am", end: "10:58 am", lunch: false },
			{ block: "X", start: "11:05 am", end: "11:42 am", lunch: false },
			{ block: "D", start: "11:49 am", end: "1:14 pm", lunch: true },
			{ block: "E", start: "1:21 pm", end: "2:16 pm", lunch: false }
		],
		[//thursday
			{ block: "A", start: "8:20 am", end: "9:15 am", lunch: false },
			{ block: "B", start: "9:22 am", end: "10:17 am", lunch: false },
			{ block: "C", start: "10:24 am", end: "11:19 am", lunch: false },
			{ block: "G", start: "11:26 am", end: "12:50 pm", lunch: false },
			{ block: "E", start: "12:51 pm", end: "1:53 pm", lunch: true },
			{ block: "F", start: "2:00 pm", end: "2:55 pm", lunch: false }
		],
		[//friday
			{ block: "A", start: "8:20 am", end: "9:15 am", lunch: false },
			{ block: "B", start: "9:22 am", end: "10:17 am", lunch: false },
			{ block: "C", start: "10:24 am", end: "11:19 am", lunch: false },
			{ block: "D", start: "11:26 am", end: "12:51 pm", lunch: true },
			{ block: "F", start: "12:51 pm", end: "1:53 pm", lunch: false },
			{ block: "G", start: "2:00 pm", end: "2:55 pm", lunch: false }
		],
		[//saturday, had to add so app still works, 
			{ block: "Saturday", start: "12:00 am", end: "11:59 pm", lunch: false }
		]
	];

	let schedule: Schedule[] = weekDaySchedule[new Date().getDay()];
	
	const [timeRemaining, setTimeRemaining] = React.useState(0);

	const findCurrentBlock = (): Schedule => {
		const now = new Date();
		for (let i = 0; i < schedule.length; i++) {
			const startTime = convertToDate(schedule[i].start);
			const endTime = convertToDate(schedule[i].end);
			if (startTime < now && now < endTime) {//
				return schedule[i]
			}
			if( i === 0 && now < startTime) {
				return { block: "Before School", start: "No Start Time", end: schedule[i].start, lunch: false };
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

	const findCurrentClass = (): Course => {
		for (let i = 0; i < courses.length; i++) {
			if (courses[i].block === findCurrentBlock().block) {//also at some point add a check for s1 or s2
				return courses[i];
			}
		}
		return { name: "No Class", teacher: "No Teacher", block: "No Block", lunch: 0, term: 0, roomNumber: "N/A" };
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

	const [useStateCurrentBlock, setUseStateCurrentBlock] = React.useState(findCurrentBlock())
	const [nearestStartTime, setNearestStartTime] = React.useState<Date>(convertToDate(findCurrentBlock()?.start || "8:20 am"))
	//theoretically might be good to get rid of neareststarttime and nearestendtime usestates
	//but progress and time left stop changing even though neareststarttime or nearestendtime not used
	const [nearestEndTime, setNearestEndTime] = React.useState<Date>(convertToDate(findCurrentBlock()?.end || "2:55 pm"))//placeholder default values
	const [progress, setProgress] = React.useState(0);
	useEffect(() => {
		const interval = setInterval(() => {
			let currentBlock = findCurrentBlock()
			setUseStateCurrentBlock(currentBlock)
			if(currentBlock.block == "After School" || currentBlock.block == "No Class") {
				setTimeRemaining(0);
				return;
			}
			const nearestStart = convertToDate(currentBlock.start || "2:55 pm");
			setNearestStartTime(nearestStart);

			const nearestEnd = convertToDate(currentBlock.end || "2:55 pm");
			setNearestEndTime(nearestEnd);
			setTimeRemaining(getDifferenceInMinutes(new Date(), nearestEnd));

			if(currentBlock.block == "Before School") {
				return;
			}
			if (nearestStart && nearestEnd) {//still sometimes loss in precision in certain minutes, sometimes 55.00000001 or smth
				const totalMinutes = Math.round(getDifferenceInMinutes(nearestStart, nearestEnd))
				const minutesPast = Math.round(getDifferenceInMinutes(nearestStart, new Date()))
				console.log((minutesPast / totalMinutes).toFixed(2))
				const progressValue = Number(clamp(Math.round(minutesPast / totalMinutes * 100)/100, 0, 1))//11:26AM
				setProgress(progressValue);
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
						{findCurrentBlock() ? useStateCurrentBlock.block : 'No Block'} Block
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
					{(findCurrentBlock()?.block != "After School" && findCurrentBlock()?.block != "Transition") ? `${timeRemaining}:${(secondsUntilNextMinute() >= 10) ? secondsUntilNextMinute() : '0' + secondsUntilNextMinute()} left` : findCurrentBlock()?.block}
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
								<Text style={styles.courseItemSubtitle}>Lunch {item.lunch}</Text>
								<Text style={styles.courseItemSubtitle}>Term {(item.term == 3) ? 'Full Year': item.term}</Text>
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
