import React, {useState} from 'react';
import { router } from 'expo-router';
import {Text, Image, Platform, StyleSheet, Modal, View, Pressable} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from 'react-native';
import { AppleSignIn } from "@/components/ui/SignInButtonApple";
import { GoogleSignIn } from "@/components/ui/SignInButtonGoogle";
import { WebSignIn } from "@/components/ui/SignInButtonWeb";
import LyrneLogo from '@/assets/images/lyrne-logo-clear.png';
import {fetchUserData, updateUserData} from "@/util/Backend";
import {useSession} from "@/components/Context";

export default function SignIn() {
    const { session } = useSession();
    const [modalVisible, setModalVisible] = useState(false);
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'light' ? '#e6e6e6' : undefined;

    // Create new user or redirect if already logged in
    React.useEffect(() => {
        fetchUserData(session).then(data => {
            if (data.role == "ANYONE") router.push('/onboarding');
            else router.replace('/');
        });
    }, [session]);
    // // Temporary Bypass to fetchUserData (for Android & Web testing)
    // React.useEffect(() => {
    //     if(session) router.replace('/');
    // }, [session]);

    return (
        <ThemedView style={styles.signinContainer}>
            <ThemedView style={[styles.topHalf, {backgroundColor: bgColor}]}>
                <Image source={LyrneLogo} style={styles.logo} />
            </ThemedView>
            <ThemedView style={[styles.bottomHalf, {backgroundColor: bgColor}]}>
                {Platform.OS === 'ios' ? (
                    <AppleSignIn />
                ) : Platform.OS === 'android' ? (
                    // Currently using a placeholder
                    <GoogleSignIn />
                ) : (
                    // Currently using a placeholder
                    <WebSignIn />
                )}
            </ThemedView>

            {/* <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Welcome to Lyrne!</Text>
                        <Text style={styles.modalText}>We just have a few questions before you get started.</Text>
                        <Text style={styles.modalText}>Are you a:</Text>
                        <View style={{ flexDirection:"row", gap: 10 }}>
                            <View>
                                <Pressable
                                    style={({ pressed }) => [
                                        { backgroundColor: pressed ? '#F194FF' : '#2196F3' },
                                        styles.button
                                    ]}
                                    onPress={async () => {
                                        setModalVisible(false);
                                        await updateUserData({role: "STUDENT"}, session);
                                    }}
                                    >
                                    <Text style={styles.textStyle}>Student</Text>
                                </Pressable>
                            </View>
                            <View>
                                <Pressable
                                    style={({ pressed }) => [
                                        { backgroundColor: pressed ? '#F194FF' : '#2196F3' },
                                        styles.button
                                    ]}
                                    onPress={async () => {
                                        setModalVisible(false);
                                        await updateUserData({ role: "TUTOR" }, session);
                                    }}
                                >
                                    <Text style={styles.textStyle}>Tutor</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal> */}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    signinContainer: {
        flex: 1,
    },
    topHalf: {
        flex: 0.5,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    bottomHalf: {
        flex: 0.5,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    logo: {
        justifyContent: 'inherit',
        width: 300, 
        height: 300,
        marginBottom: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});
