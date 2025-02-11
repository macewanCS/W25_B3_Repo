import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

import { Calendar, Agenda } from 'react-native-calendars';
// Agenda might be useful for implementing a week view based from the month view

export function StyledCalendar() {
    const [selected, setSelected] = useState('');

    return (
        <ThemedView style={[styles.container, { paddingTop: 0 }]}>
            <ThemedView style={styles.header}>
                <ThemedText style={styles.welcomeText}>Monthly Schedule:</ThemedText>
            </ThemedView>

            <Calendar
                // Calendar Docs: https://wix.github.io/react-native-calendars/docs/Components/Calendar

                // TODO: Set minDate to account creation date
                minDate={'2025-01-01'} // Dates before this date will be disabled
                style={{
                    // borderWidth: 1,
                    // borderColor: 'gray',
                    // height: 450,
                    width: '100%',
                    backgroundColor: '#141414',
                    // calendarBackground: 'black',
                }}


                // Hightlight Dates that have events
                markingType={'period'}
                markedDates={{
                    '2025-02-10': {startingDay: true, color: '#FDFD96', textColor: 'black', endingDay: true},
                    '2025-02-12': {startingDay: true, color: '#FDFD96', textColor: 'black', endingDay: true},
                    '2025-02-13': {startingDay: true, color: '#FDFD96', textColor: 'black', endingDay: true},
                    '2025-02-14': {startingDay: true, color: '#FDFD96', textColor: 'black', endingDay: true},
                    '2025-02-15': {startingDay: true, color: '#FDFD96', textColor: 'black', endingDay: true},
                    [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                }}

                // Copy of default colors #141414, #b6c1cd, #00adf5, #e5e7eb, #e9c030, #2d4150, #d9e1e8, #a4becf

                // Specify theme properties to override specific styles for calendar parts. Default = {}
                theme={{
                    // backgroundColor: 'blue',
                    calendarBackground: '#141414',
                    textSectionTitleColor: '#b6c1cd',
                    textSectionTitleDisabledColor: 'black',
                    selectedDayBackgroundColor: '#00adf5',
                    selectedDayTextColor: '#e5e7eb',
                    todayTextColor: '#e9c030',// Lyrne Yellow, old:' #00adf5',
                    dayTextColor: '#d9e1e8', // CURRENT MONTH TEXT COLOR
                    textDisabledColor: '#2d4150', // OTHER MONTH TEXT COLOR
                    dotColor: '#00adf5',
                    selectedDotColor: '#ffffff',
                    arrowColor: '#a4becf', // Arrows for switching months
                    disabledArrowColor: '#d9e1e8',
                    monthTextColor: '#a4becf',
                    indicatorColor: 'blue', // Not sure what this does
                    textDayFontFamily: 'monospace',
                    textMonthFontFamily: 'monospace',
                    textDayHeaderFontFamily: 'monospace',
                    textDayFontWeight: '300',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '300',
                    textDayFontSize: 16,
                    textMonthFontSize: 20,
                    textDayHeaderFontSize: 16
                }}
                onDayPress={day => {
                    setSelected(day.dateString);
                }}

            />

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { marginBottom: 16 },
    welcomeText: { fontSize: 24, fontWeight: "bold", textAlign: 'center', alignItems: 'center', justifyContent: 'center' },
});