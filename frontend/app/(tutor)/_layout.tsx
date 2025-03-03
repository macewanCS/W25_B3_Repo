import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import {useSession} from "@/components/Context";
import { fetchUserData } from "@/util/Backend";

export default function TutorLayout() {
    const colorScheme = useColorScheme();
    const { signIn, session } = useSession();
    const [user, setUserData] = useState([]);

    useEffect(() => {
        const getData = async () => {
          let userData = await fetchUserData(session);
          setUserData(userData);
          if (userData.icon) {
            setImage({uri: userData.icon});
          } else {
            setImage(PlaceholderPhoto)
          }
          setCreated(new Date(userData.created).toDateString())
        }
        getData()
      }, [])

    // const userRoutes = [
    //   'user/account', 
    //   // 'user/courses',
    //   // 'user/availability',
    //   // 'user/privacy', 
    //   // 'user/security',
    //   // 'user/language',
    //   // 'user/notifications'
    // ];

    if (!session) {
    // If the user is not authenticated, return to sign-in.
    return <Redirect href="/sign-in" />;
    }

    if(user.role === 'STUDENT') {
        return <Redirect href="/(student)/" />;
    }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            backgroundColor: 'transparent',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="students"
        options={{
          title: 'My Students',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="graduationcap.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat_list"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="text.bubble.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="invoices"
        options={{
          title: 'Invoices',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="building.columns" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear" color={color} />,
        }}
      />
      {/* {userRoutes.map((route) => (
        <Tabs.Screen
          key={route}
          name={route}
          options={{
            href: null,
          }}
        />
      ))} */}
    </Tabs>
  );
}
