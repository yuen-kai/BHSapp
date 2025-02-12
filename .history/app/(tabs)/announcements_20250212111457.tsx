import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Button, TextInput, useTheme } from 'react-native-paper';
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://mvfdwktreukpbcypbrvy.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


type Announcement = {
    id: number;
    title: string;
    content: string;
};

export default function Announcements() {
    const { colors } = useTheme();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const channel = supabase
            .channel("announcements")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "announcements" }, (payload) => {
                setAnnouncements((prev) => [payload.new, ...prev]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);


    async function addAnnouncement() {
        if (!newTitle.trim() || !newContent.trim()) return;
        try {
            const { error } = await supabase
                .from('announcements')
                .upsert({ user_id: session?.user.id, title: newTitle.trim(), content: newContent.trim() });
            if (error) {
                throw error
            }

            setNewTitle('');
            setNewContent('');
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        }
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.primary }]}>Announcements</Text>
            <FlatList
                data={announcements}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View>
                        <Text style={styles.item}>{item.title}</Text>
                        <Text style={styles.item}>{item.content}</Text>
                    </View>
                )}
            />
            <TextInput
                label="New Announcement"
                value={newTitle}
                onChangeText={setNewTitle}
                style={styles.input}
            />
            <TextInput
                label="Body"
                value={newContent}
                onChangeText={setNewContent}
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