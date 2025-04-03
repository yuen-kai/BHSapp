import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert, Animated, useAnimatedValue } from 'react-native';
import { Text, Button, TextInput, useTheme, Card, FAB, Modal } from 'react-native-paper';
import { supabase } from '../../lib/supabase'
import { Session } from "@supabase/supabase-js";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Profile } from '@/types/types';


type Announcement = {
    id: number;
    user_id: string;
    title: string;
    content: string;
    created_at: Date;
};

export default function Announcements() {
    const { colors } = useTheme();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [profiles, setProfiles] = useState({});
    const [addAnnouncementVisible, setAddAnnouncementVisible] = useState(true)

    /*type profile = {
        id: string,
        updated_at: Date,
        avatar_url: string,
        bio: string,
        full_name: string,
    };*/

    async function profileData(uID: string) {
        try {
            const { data, error } = await supabase.from('profiles')
            .select()
            .eq('id', uID);
            if (error) {
                throw error
            }
            return data[0]
        } catch (error) {
            console.error("profile data error: "+error)
            return error
        } 
    }
    //
    const [session, setSession] = useState<Session | null>(null)
    
      useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session)
        })
    
        supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session)
        })
      }, [])
    //
    useEffect(() => {
        const fetchAnnouncements = async () => {
            const { data, error } = await supabase
              .from('announcements')
              .select('*').order('id', { ascending: false });  // Select all fields, adjust if needed
      
            if (error) {
              console.error('Error fetching announcements:', error);
            } else {
              setAnnouncements(data);  // Set the fetched announcements
            }
          };
      
          fetchAnnouncements()

        const channel = supabase.channel("announcements")
        .on("postgres_changes", 
            { event: "INSERT", schema: "public", table: "announcements" }, 
            (payload) => {
                const newAnnouncement = payload.new as Announcement;
                setAnnouncements((prev) => [newAnnouncement, ...prev]);
            })
        .on("postgres_changes", 
            { event: "DELETE", schema: "public", table: "announcements" }, 
            (payload) => {
                const deletedAnnouncementId = payload.old.id;  // assuming the announcement has an 'id' field
                setAnnouncements((prev) => prev.filter(announcement => announcement.id !== deletedAnnouncementId));
            })
        .subscribe();
    }, []);


    async function addAnnouncement() {
        if (!newTitle.trim() || !newContent.trim()) return;
        try {
            const { error } = await supabase
                .from('announcements')
                .upsert({ created_at: new Date(), user_id: session?.user.id, title: newTitle.trim(), content: newContent.trim() });
            if (error) {
                console.log(error)
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

    useEffect(() => {//only used to be able to connect the async profile data function to load onto announcements
        const fetchProfiles = async () => {
            for (const announcement of announcements) {
                if (!profiles[announcement.user_id]) {
                    const profile = await profileData(announcement.user_id);
                    if (profile) {
                        setProfiles((prevProfiles) => ({
                            ...prevProfiles,
                            [announcement.user_id]: profile,
                        }));
                    }
                }
            }
        };
        fetchProfiles();
    }, [announcements, profiles]);
    
    return (
        <SafeAreaView style={styles.container}>
            <Text style={[styles.title, { color: colors.primary }]}>Announcements</Text>
            <FlatList
                data={announcements}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const profile = profiles[item.user_id]
                    
                    const created = new Date(item.created_at).toLocaleString('en-US', {weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'})
                    return (
                        <Card style={{backgroundColor: colors.background, marginBottom: 20, padding: 20, borderColor: colors.primary}}>
                            <Text style={[styles.title, {color: colors.primary, marginBottom: 8, flex: 1, textAlign: 'left'}]}>{item.title}</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 2}}>
                                <Text style={[styles.item, { color: colors.primary, marginBottom: 10, textAlign: 'left'}]}>{profile ? (profile.full_name)? profile.full_name:'Unknown' : 'Loading...'}</Text>
                                <Text style={[styles.item, { color: colors.primary,textAlign: 'right', fontSize: 12}]}>{item ? created : 'Loading...'}</Text>
                            </View>
                            <Text style={[styles.item, {flex: 3}]}>{item.content}</Text>
                        </Card>
                    )
                }}
            />
            <View>
            <FAB icon='plus' onPress={()=>setAddAnnouncementVisible(!addAnnouncementVisible)} style={{alignSelf: 'flex-end', position: 'absolute', bottom: 20, right: 20}}/>
            {addAnnouncementVisible && (
                <Card style={{padding: 7, marginTop: 10, position: 'absolute'}}>
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
                        multiline={true}
                    />
                    <Button mode="contained" onPress={addAnnouncement}>
                        Add
                    </Button>
                </Card>
            )}
            </View>
            
        </SafeAreaView>
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