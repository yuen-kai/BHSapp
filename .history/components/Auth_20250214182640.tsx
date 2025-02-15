import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import { supabase } from '../lib/supabase'

AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

export default function Auth() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    async function signInWithEmail() {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) Alert.alert(error.message)
        setLoading(false)
    }

    async function signUpWithEmail() {
        setLoading(true)
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email,
            password,
        })
        if (error) {
            console.error('Signup Error:', error);
            if (error.code === 'auth/invalid-email') {
              Alert.alert('Error', 'Invalid email format');
            } else if (error.code === 'auth/email-already-in-use') {
              Alert.alert('Error', 'Email is already in use');
            } else {
              Alert.alert('Error', error.message);
            }
          } else {
            console.log('Signup Success:', session);
            if (session) {
              console.log('Session:', session);
            } else {
              Alert.alert('Check your inbox for email verification!');
            }
          }
        setLoading(false)
    }

    const handleSignUp = async () => {
        setLoading(true); // Set loading to true while making the request
    
        try {
          const response = await fetch('https://mvfdwktreukpbcypbrvy.supabase.co/auth/v1/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: "26ching@brooklinek12.org",
              password: "bhsiscool",
            }),
          });
          const data = await response.json();
          console.log(data)
        } catch (error) {
            console.error('Error during sign up:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
          } finally {
            setLoading(false); // Set loading to false once the request is completed
          }
    }

    return (
        <View style={styles.container}>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    mode="outlined"
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.verticallySpaced}>
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    mode="outlined"
                    secureTextEntry
                    autoCapitalize="none"
                />
            </View>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Button mode="contained" onPress={signInWithEmail} loading={loading}>
                    Sign in
                </Button>
            </View>
            <View style={styles.verticallySpaced}>
                <Button mode="contained" onPress={handleSignUp} loading={loading}>
                    Sign up
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 20,
    },
})
