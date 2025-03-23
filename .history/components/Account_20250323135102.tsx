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
import { decode } from 'base64-arraybuffer'

export default function Account({ session }: { session: Session }) {
	const { colors } = useTheme();

	const [loading, setLoading] = useState(true);
	const [name, setName] = useState("");
	const [bio, setBio] = useState("");
	const [storedAvatarUrl, setStoredAvatarUrl] = useState("");
	const [localAvatarUrl, setLocalAvatarUrl] = useState<string>("");
	const [avatarImage, setAvatarImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

	useEffect(() => {
		if (storedAvatarUrl){
			downloadImage(storedAvatarUrl);
		}
	}, [storedAvatarUrl]);

	async function getSignedUrl(path: string) {
		try {
		  const { data, error: signedUrlError } = await supabase.storage
			.from('avatars')
			.createSignedUrl(path, 20);
	  
		  if (signedUrlError) {
			throw signedUrlError;
		  }

		  return data?.signedUrl; // Access signed URL from data
		} catch (error) {
		  console.error('Error fetching signed URL:', error);
		}
	  }
	async function downloadImage(path: string) {
		try {
			/*const { data, error } = await supabase.storage
				.from("avatars")
				.download(path);
			if (error) {
				throw error;
			}*/
			const signedUrl = await getSignedUrl(path)
			setLocalAvatarUrl(signedUrl||'');
		} catch (error) {
			console.log("Error downloading image: ", error);
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
				.select(`full_name, bio, avatar_url`)
				.eq("id", session?.user.id)
				.single();
			if (error && status !== 406) {
				throw error;
			}
			if (data) {
				setName(data.full_name);
				setBio(data.bio);
				setStoredAvatarUrl(data.avatar_url);
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
			setLocalAvatarUrl(result.assets[0].uri);
			setAvatarImage(result.assets[0])
		}
	};
	const uriToBase64 = async (uri: any) => {
		const response = await fetch(uri);
		const imageBlob = await response.blob();
		const reader = new FileReader();
	  
		return new Promise<string>((resolve, reject) => {
		  reader.onloadend = () => {
			if (reader.result && typeof reader.result === "string") {
			  resolve(reader.result.split(',')[1]); // Extract Base64 string from data URL
			} else {
			  reject(new Error("Failed to read file or result is not a string"));
			}
		  };
		  reader.onerror = reject;
		  reader.readAsDataURL(imageBlob); // Convert image blob to Base64 string
		});
	  };


	async function updateProfile({
		name,
		bio,
		imagePath,
	}: {
		name: string;
		bio: string;
		imagePath: string;
	}) {
		try {
			setLoading(true);
			console.log(imagePath)
			if (!session?.user) throw new Error("No user on the session!");
			if (imagePath == "") {
				 throw new Error('You must select an image to upload.')
				 return;
			}

			// Upload the image to the server
			const fileExt = imagePath.split('.').pop();
			const filePath = `${Math.random()}.${fileExt}`;//randomly generate name for file

			const base64 = await uriToBase64(imagePath);
			
			const { data: uploadData, error: uploadError } = await supabase.storage.from('avatars').upload(filePath, decode(base64), {
				contentType: "image/"+fileExt,
				//maybe upsert: 'true' for overriding?
			  })
			  setStoredAvatarUrl(filePath);

			if (uploadError) {
				throw uploadError;
			}
			const updates = {
				id: session?.user.id,
				updated_at: new Date(),
				avatar_url: filePath,
				bio: bio,
				full_name: name,
			};
			//prints out updates fine
			const { data, error } = await supabase.from("profiles").upsert(updates);
			
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
						<Avatar.Image size={100} source={{ uri: localAvatarUrl }} />
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
							updateProfile({ name: name, bio: bio, imagePath: localAvatarUrl })
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
