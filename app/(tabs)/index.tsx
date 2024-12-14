import { Image, StyleSheet, Platform, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  let currentCourse;
  type Course = {
    name: string
    teacher: string
    block: (string[])[5]
    rmNum: number
  }
  let courses:Course[] = [{}, {}]
  const TimeLeftBar = ({timeLeft}: {timeLeft: number}) => {
    return <ThemedText style={{fontWeight: 'bold', fontSize: 25, textAlign: 'center'}}>Time Left: {timeLeft}</ThemedText>
  }
  const OuterBar = ({timeLeft}: {timeLeft: number}) => {
    return <View style={{backgroundColor: 'red', width: '120%', height: '120%', alignSelf: 'center', zIndex: -1, position: 'absolute', borderRadius: '50%'}}></View>
  }
  return (
    <SafeAreaView style={{paddingTop: 10}}>
      <View style={{backgroundColor: 'cyan', alignSelf: 'center', borderRadius: '50%', width: '200', height: '200', justifyContent: 'center', top: '125%'}}>
        <OuterBar timeLeft={0}/>
        <TimeLeftBar timeLeft={0}/>
      </View>
    </SafeAreaView>
  )
}
