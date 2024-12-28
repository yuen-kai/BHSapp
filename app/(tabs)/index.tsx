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
  const TimeLeftText = ({timeLeft}: any) => {//position and top are placeholders
    return <Text style={{fontSize: 18, zIndex: 3, position: 'absolute', top: 348, alignSelf: 'center'}}>{timeLeft} Minutes Remaining</Text>
  }
  const CourseDataText = ({ valueName = 'N/A', val = 'N/A' }: { valueName?: string; val?: string }) => {
    let leftPos = '15%'
    let topPos = '60%'
    if (valueName == 'Block' || valueName == 'Room') {
      leftPos = '70%'
    }
    if (valueName == 'Teacher' || valueName == 'Room') {
      topPos = '75%'
    }
    return <Text style={{fontSize: 18, left: leftPos, position: 'absolute', top: topPos, textAlign: 'center'}}>{valueName}{'\n'}{val}</Text>
  }
  return (
    <SafeAreaView style={{paddingTop: 10, flex: 1, width: '100%', height: '100%', backgroundColor: 'blue'}}>
      <View style={styles.headerContainer}>

      </View>
      <ProgressBar progress={0.5} color={MD3Colors.error50} style={{position: 'absolute', height: 50, borderRadius: 30, alignSelf: 'center', width: '75%', marginTop: '20%'}}></ProgressBar>
      <TimeLeftText timeLeft={0}></TimeLeftText>
      
      <CourseDataText valueName={'Block'} val={'B'}></CourseDataText>
      <CourseDataText valueName={'Teacher'} val={'placeholder'}></CourseDataText>
      <CourseDataText valueName={'Room'} val={'200'}></CourseDataText>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'yellow',
    top: '5%',
    width: '75%',
    alignSelf: 'center',
    height: '31%'
  }
})
