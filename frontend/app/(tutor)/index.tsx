import React, { useState } from 'react';
import { Image, StyleSheet, Platform, ScrollView, View, SafeAreaView, TouchableOpacity, Text, useColorScheme } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

// Currently, the ParallaxScrollView component crashes after authentication.

import { Agenda } from 'react-native-calendars';

export default function TutorHomeScreen() {
    const lightMode = useColorScheme() === 'light';
    const today = new Date();
    const currentDateString = today.toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(currentDateString);
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const formatDate = (date) => date.toISOString().split('T')[0];

    const [items, setItems] = useState({
        [formatDate(startOfWeek)]: [],
        [formatDate(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1)))]: [{name: 'Session', data:'Student 1 - 3:00 PM\nCourse: Mathematics\nLocation: Room 101', disabled: false}],
        [formatDate(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1)))]: [],
        [formatDate(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1)))]: [{name: 'Session', data:'Student 2 - 10:00 AM\nCourse: Mathematics\nLocation: Room 202'}],
        [formatDate(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1)))]: [{name: 'Session', data:'Student 3 - 1:00 PM\nCourse: Biology\nLocation: Room 303'}],
        [formatDate(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1)))]: [{name: 'Session', data:'Student 4 - 11:00 AM\nCourse: Biology\nLocation: Room 404'}],
        [formatDate(new Date(startOfWeek.setDate(startOfWeek.getDate() + 1)))]: [{name: 'Session', data:'Student 1 - 2:00 PM\nCourse: Mathematics\nLocation: Room 505'}]
    });

  return (
    <SafeAreaView style={styles.container}>
      <Agenda
        // Agenda Docs https://wix.github.io/react-native-calendars/docs/Components/Agenda
        items={items}

        markingType={'period'}
          markedDates={{
            [Object.keys(items)[1]]: {startingDay: true, color: '#FDFD96', textColor: 'black', endingDay: true},
            [Object.keys(items)[3]]: {startingDay: true, color: '#FDFD96', textColor: 'black', endingDay: true},
            [Object.keys(items)[4]]: {startingDay: true, color: '#FDFD96', textColor: 'black', endingDay: true},
            [Object.keys(items)[5]]: {startingDay: true, color: '#FDFD96', textColor: 'black', endingDay: true},
            [Object.keys(items)[6]]: {startingDay: true, color: '#FDFD96', textColor: 'black', endingDay: true},
              // [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
        }}
        
        showClosingKnob={true}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        minDate={'2025-02-09'} // Farthest back date that can be selected
        onDayChange={(day) => {
            setSelectedDate(currentDateString); // Always reset back to today
          }}

          selected={currentDateString}
          renderItem={(item, isFirst) => (
            <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemText}>{item.data}</Text>
            </TouchableOpacity>
          )}
          renderEmptyDate={() => (
            <ThemedView style={styles.item}>
            <Text style={styles.itemText}> </Text>
            </ThemedView>
          )}

          // *Meant to fix issues with elements displaying under bottom tab selector
          // Issue seen with ios (iPhone 13), possible that its not a problem on other devices.
          // Along with elements displaying under camera on android (Pixel 9)
          style={{
            ...(Platform.OS === 'ios' ? { bottom: 50, marginTop: 50 } : {}),
            ...(Platform.OS === 'android' ? { marginTop: 50 } : {})
          }} 

          theme={{
            calendarBackground: lightMode ? 'white' : '#141414', // #141414
            monthTextColor: lightMode ? '#007AFF' : 'lightblue',
            todayTextColor: '#e9c030', // #e9c030
            dayTextColor: lightMode ? 'black' : 'white', // #d9e1e8
            reservationsBackgroundColor: lightMode ? 'white' : '#1E1E1E',
            agendaKnobColor: '#a2a6a6', // #a2a6a6
            agendaDayTextColor: lightMode ? 'black' : 'white',
            agendaDayNumColor: lightMode ? 'black' : 'white'
          }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  item: {
    backgroundColor: '#a4becf',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 25,
    paddingBottom:20
  },
  itemText: {
    color: 'black',
    fontSize: 16,
  }
});
