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

function validateEmail(email: string) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

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
            Alert.alert('Error', error.message)     // Disconsole.error('Sign-up error:', error)  // Log the error for better visibilityplay the error message
        } else if (!session) {
            Alert.alert('Check your inbox for email verification!')
        }
        setLoading(false)
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
                <Button mode="contained" onPress={signUpWithEmail} loading={loading}>
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
