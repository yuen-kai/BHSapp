import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button, TextInput, useTheme } from 'react-native-paper';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = '<YOUR_SUPABASE_URL>';
const supabaseAnonKey = '<YOUR_SUPABASE_ANON_KEY>';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Announcement = {
    id: number;
    title: string;
};

export default function Announcements() {
    const { colors } = useTheme();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [newTitle, setNewTitle] = useState('');

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    async function fetchAnnouncements() {
        const { data, error } = await supabase
            .from<Announcement>('announcements')
            .select('*');
        if (!error && data) {
            setAnnouncements(data);
        }
    }

    async function addAnnouncement() {
        if (!newTitle.trim()) return;
        const { error } = await supabase
            .from('announcements')
            .insert([{ title: newTitle.trim() }]);
        if (!error) {
            setNewTitle('');
            fetchAnnouncements();
        }
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.primary }]}>Announcements</Text>
            <FlatList
                data={announcements}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Text style={styles.item}>{item.title}</Text>
                )}
            />
            <TextInput
                label="New Announcement"
                value={newTitle}
                onChangeText={setNewTitle}
                style={styles.input}
            />
            <Button mode="contained" onPress={addAnnouncement}>
                Add
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        fontWeight: 'bold',
    },
    item: {
        fontSize: 16,
        marginVertical: 4,
    },
    input: {
        marginVertical: 8,
    },
});