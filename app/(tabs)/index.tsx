import { Image, StyleSheet, Platform, View, useColorScheme } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressBar, MD3Colors } from 'react-native-paper';
import React, { useEffect } from 'react';
import { Font } from 'react-native-paper/lib/typescript/types';

export default function HomeScreen() {
  let currentCourse;
  type Course = {
    name: string
    teacher: string
    block:string
    //  (string[])[5]
    rmNum: number
  }
  let courses:Course[] = [{name:"English",teacher:"teacherName", block: "A", rmNum: 324}, {name:"Math",teacher:"teacherName2", block: "B", rmNum: 124}]
  console.log()
  const [timeRemaining, setTimeRemaining] = React.useState(55);
  const [currentDate, setCurrentDate] = React.useState(new Date());
  let endTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 15, 30);
  function getDifferenceInMinutes(currentDate: Date, endTime: Date) {
    // Convert both dates to milliseconds
    const date1Ms = currentDate.getTime();
    const date2Ms = endTime.getTime();
  
    // Calculate the difference in milliseconds
    const differenceMs = date2Ms - date1Ms;
  
    // Convert milliseconds to minutes
    const differenceMinutes = Math.floor(differenceMs / (1000 * 60));
  
    return differenceMinutes;
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
      setTimeRemaining(Math.max(getDifferenceInMinutes(currentDate, endTime), 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaView style={{paddingTop: 10, flex: 1, width: '100%', height: '100%', backgroundColor: isDarkMode ? '#303d4b': 'white'}}>
      <View style={styles.headerContainer}>
        <Text style={{fontSize: 48, textAlign: 'center', marginTop: '10%', color: isDarkMode ? 'white':'dark'}}>{'Course'}</Text>//course name, max 14-16 characters with font size 48
        <Text style={{fontSize: 24, textAlign: 'center', marginTop: '10%', color: isDarkMode ? 'white':'dark'}}>{'Teacher'}          Room {'100'}</Text>//teacher name and room #, max 17 chaarcters for teacher name with font size 24 bc room # must be 3 digits
        <Text style={{fontSize: 24, textAlign: 'center', marginTop: '10%', color: isDarkMode ? 'white':'dark'}}>{'A Block'}</Text>//block
      </View>
      <View style={{position: 'relative', width: '80%', alignSelf: 'center', marginTop: '25%', height: '12.5%'}}>
        <ProgressBar progress={0.5} color={MD3Colors.error50} style={{height: '100%', borderRadius: 100, alignSelf: 'center', width: '100%'}}/>
        <Text style={{position: 'absolute', left: '50%', top: '50%', transform: [{ translateX: '-50%' }, { translateY: '-50%' }], fontSize: 28, color: isDarkMode ? 'white' : 'black'}}>{timeRemaining} minute{timeRemaining == 1? '': 's'} remaining</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    top: '5%',
    width: '100%',
    alignSelf: 'center',
    height: '31%'
  }
})
