import React, { useState } from 'react';
import { Image, StyleSheet, Platform, ScrollView, View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

// Currently, the ParallaxScrollView component crashes after authentication.

import { Agenda } from 'react-native-calendars';

export default function HomeScreen() {
  const today = new Date();
  const currentDateString = today.toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(currentDateString);

  const [items, setItems] = useState({
    '2025-02-09': [],
    '2025-02-10': [{name: 'Tutoring Session', data:'Ms. Johnson - 3:00 PM\nCourse: Mathematics\nLocation: Room 101', disabled: false}],
    '2025-02-11': [],
    '2025-02-12': [{name: 'Tutoring Session', data:'Mr. Stuart - 10:00 AM\nCourse: Physics\nLocation: Room 202'}],
    '2025-02-13': [{name: 'Tutoring Session', data:'Mr. Brown - 1:00 PM\nCourse: Chemistry\nLocation: Room 303'}],
    '2025-02-14': [{name: 'Tutoring Session', data:'Ms. Davis - 11:00 AM\nCourse: Biology\nLocation: Room 404'}],
    '2025-02-15': [{name: 'Tutoring Session', data:'Mr. Wilson - 2:00 PM\nCourse: English Literature\nLocation: Room 505'}]
  });

  return (
    <SafeAreaView style={styles.container}>
      <Agenda
        // Agenda Docs https://wix.github.io/react-native-calendars/docs/Components/Agenda
        items={items}

        markingType={'period'}
          markedDates={{
              '2025-02-10': {startingDay: true, color: '#FDFD96', textColor: 'black', endingDay: true},
              '2025-02-12': {startingDay: true, color: '#FDFD96', textColor: 'black', endingDay: true},
              '2025-02-13': {startingDay: true, color: '#FDFD96', textColor: 'black', endingDay: true},
              '2025-02-14': {startingDay: true, color: '#FDFD96', textColor: 'black', endingDay: true},
              '2025-02-15': {startingDay: true, color: '#FDFD96', textColor: 'black', endingDay: true},
              // [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
        }}
        
        showClosingKnob={true}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        minDate={'2025-02-09'} // Farthest back date that can be selected
        onDayChange={(day) => {
            setSelectedDate(currentDateString); // Always reset back to today
          }}

          selected={today}
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

          // TODO: Adapt this to colorScheme (dark and light mode). Currently matches dark.
          theme={{
            calendarBackground: '#141414', // #141414
            monthTextColor: 'lightblue',
            todayTextColor: '#e9c030', // #e9c030
            dayTextColor: '#d9e1e8', // #d9e1e8
            agendaKnobColor: '#a2a6a6', // #a2a6a6
            reservationsBackgroundColor: '#1E1E1E', // #1E1E1E
            agendaDayTextColor: 'white',
            agendaDayNumColor: 'white'
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
