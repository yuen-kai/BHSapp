import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import {
	StyleSheet,
	View,
	Alert,
	TouchableOpacity,
	Keyboard,
	TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Button, Avatar, useTheme } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

export default function Account({ session }: { session: Session }) {
	const { colors } = useTheme();

	const [loading, setLoading] = useState(true);
	const [name, setName] = useState("");
	const [bio, setBio] = useState("");
	const [avatarUrl, setAvatarUrl] = useState("");
	const [profileImage, setProfileImage] = useState<string>("");

	useEffect(() => {
		if (avatarUrl) downloadImage(avatarUrl);
	}, [avatarUrl]);

	async function downloadImage(path) {
		try {
			const { data, error } = await supabase.storage
				.from("avatars")
				.download(path);
			if (error) {
				throw error;
			}
			const url = URL.createObjectURL(data);
			setAvatarUrl(url);
		} catch (error) {
			console.log("Error downloading image: ", error.message);
		}
	}

	useEffect(() => {
		if (session) getProfile();
	}, [session]);

	async function getProfile() {
		try {
			setLoading(true);
			if (!session?.user) throw new Error("No user on the session!");

			const { data, error, status } = await supabase
				.from("profiles")
				.select(`name, bio, avatar_url`)
				.eq("id", session?.user.id)
				.single();
			if (error && status !== 406) {
				throw error;
			}

			if (data) {
				setName(data.name);
				setBio(data.bio);
				setAvatarUrl(data.avatar_url);
			}
		} catch (error) {
			if (error instanceof Error) {
				Alert.alert(error.message);
			}
		} finally {
			setLoading(false);
		}
	}

	const pickImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (status !== "granted") {
			Alert.alert(
				"Permission required",
				"We need access to your photo library to choose a profile picture."
			);
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled) {
			setProfileImage(result.assets[0].uri);
		}
	};

	async function updateProfile({
		name,
		bio,
		avatar_url,
	}: {
		name: string;
		bio: string;
		avatar_url: string;
	}) {
		try {
			setLoading(true);
			if (!session?.user) throw new Error("No user on the session!");

			const updates = {
				id: session?.user.id,
				name,
				bio,
				avatar_url,
				updated_at: new Date(),
			};

			const { error } = await supabase.from("profiles").upsert(updates);

			if (error) {
				throw error;
			}
		} catch (error) {
			if (error instanceof Error) {
				Alert.alert(error.message);
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<SafeAreaProvider>
			<SafeAreaView
				style={[styles.container, { backgroundColor: colors.background }]}
			>
				<Text style={[styles.header, { color: colors.primary }]}>
					Edit Profile
				</Text>
				<View style={styles.avatarContainer}>
					<TouchableOpacity onPress={pickImage}>
						<Avatar.Image size={100} source={{ uri: profileImage }} />
					</TouchableOpacity>
					<Button
						mode="text"
						onPress={pickImage}
						style={styles.changePictureButton}
					>
						Change Picture
					</Button>
				</View>
				<View style={[styles.verticallySpaced, styles.mt20]}>
					<TextInput
						label="Email"
						mode={"outlined"}
						value={session?.user?.email}
						disabled
					/>
				</View>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<>
						<TextInput
							label="Name"
							value={name}
							onChangeText={setName}
							mode="outlined"
							style={styles.input}
							onSubmitEditing={Keyboard.dismiss}
						/>

						<TextInput
							label="Bio"
							value={bio}
							onChangeText={setBio}
							mode="outlined"
							style={styles.input}
							multiline
							onSubmitEditing={Keyboard.dismiss}
						/>
					</>
				</TouchableWithoutFeedback>

				<View style={[styles.verticallySpaced, styles.mt20]}>
					<Button
						onPress={() =>
							updateProfile({ name: name, bio: bio, avatar_url: avatarUrl })
						}
						disabled={loading}
					>
						{loading ? "Loading ..." : "Update"}
					</Button>
				</View>

				<View style={styles.verticallySpaced}>
					<Button onPress={() => supabase.auth.signOut()}>Sign Out</Button>
				</View>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	verticallySpaced: {
		paddingTop: 4,
		paddingBottom: 4,
		alignSelf: "stretch",
	},
	mt20: {
		marginTop: 20,
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 16,
	},
	avatarContainer: {
		alignItems: "center",
		marginBottom: 16,
	},
	changePictureButton: {
		marginTop: 8,
	},
	input: {
		marginBottom: 16,
	},
	button: {
		marginTop: 16,
	},
});
