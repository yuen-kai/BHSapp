import { Image, StyleSheet, Platform, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressBar, MD3Colors } from 'react-native-paper';

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
  const TimeLeftText = ({timeLeft}: any) => {
    return <Text style={{fontSize: 18, zIndex: 3}}>{timeLeft} Minutes Remaining</Text>
  }
  return (
    <SafeAreaView style={{paddingTop: 10, flex: 1, width: '100%', height: '100%'}}>
      <ProgressBar progress={0.5} color={MD3Colors.error50} style={{position: 'absolute', flex: 1, height: 50, borderRadius: 30, alignSelf: 'center', top: 300, width: '75%'}}>
        <TimeLeftText timeLeft={0}></TimeLeftText>
      </ProgressBar>
    </SafeAreaView>
  )
}
