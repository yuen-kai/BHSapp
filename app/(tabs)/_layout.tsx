import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { Icon } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs screenOptions={{ headerShown: false }}>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => (
						<Icon size={28} source="home" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="bhswebsite"
				options={{
					title: "Website",
					tabBarIcon: ({ color }) => (
						<Icon size={28} source="web" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="map"
				options={{
					title: "Map",
					tabBarIcon: ({ color }) => (
						<Icon source="map-marker" color={color} size={28} />
					),
				}}
			/>
			<Tabs.Screen
				name="addcourses"
				options={{
					title: "Courses", // Desired tab name
					tabBarIcon: ({ color }) => (
						<Icon size={28} source="book" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color }) => (
						<Icon source="account" color={color} size={28} />
					),
				}}
			/>
		</Tabs>
	);
}
