import React, { useState } from "react";
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

const EditProfileScreen: React.FC = () => {
	const { colors } = useTheme();

	// State for profile fields
	const [name, setName] = useState<string>("");
	const [bio, setBio] = useState<string>("");
	const [profileImage, setProfileImage] = useState<string>("");
	// require('./assets/default_profile_picture.png')

	const handleSave = () => {
		// Implement save functionality here (e.g., API call, state management)
		console.log("Profile saved:", { name, bio, profileImage });
	};

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
				<Button mode="contained" onPress={handleSave} style={styles.button}>
					Save
				</Button>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
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

export default EditProfileScreen;
