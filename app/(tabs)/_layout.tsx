import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Icon } from "react-native-paper";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import BlurTabBarBackground from "@/components/ui/TabBarBackground.ios";
import { BlurView } from "expo-blur";

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint, //icon color when selected
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarBackground: TabBarBackground,
				tabBarStyle: Platform.select({
					ios: {
						// Use a transparent background on iOS to show the blur effect
						position: "absolute",
					},
					default: {},
				}),
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name="house.fill" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="bhswebsite"
				options={{
					title: "Website",
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name="paperplane.fill" color={color} />
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
				name="settings"
				options={{
					title: "Settings",
					tabBarIcon: ({ color }) => (
						<Icon source="account-settings" color={color} size={28} />
					),
				}}
			/>
		</Tabs>
	);
}
