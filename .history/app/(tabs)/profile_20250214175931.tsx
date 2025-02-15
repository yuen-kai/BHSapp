import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Auth from '@/components/Auth'
import Account from '@/components/Account'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import React from 'react'

export default function App() {
  const checkSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('your_public_table')  // Replace with your public table name
        .select('*')               // Get all columns from the table
        .limit(1);                 // Limit the result to 1 row for a quick test
  
      if (error) {
        console.error("Error fetching data:", error);
        return;
      }
  
      console.log("Data from Supabase:", data); // Log the data to check if the connection works
    } catch (err) {
      console.error("Error with Supabase client:", err);
    }
  };
  
  // Run the check
  checkSupabaseConnection();
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <View style={{flex:1}}>
      {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
    </View>
  )
}