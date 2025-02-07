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

export default function SignIn() {
    const [modalVisible, setModalVisible] = useState(false);
    const colorScheme = useColorScheme();

    // Create new user or redirect if already logged in
    fetchUserData().then(data => {
        if (data.role == "ANYONE") setModalVisible(true);
        else router.replace('/');
    })

    return (
        <ThemedView style={styles.signinContainer}>
            <ThemedView style={styles.topHalf}>
                <Image source={LyrneLogo} style={styles.logo} />
            </ThemedView>
            <ThemedView style={styles.bottomHalf}>
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
            <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.textStyle}>Show Modal</Text>
            </Pressable>

            <Modal
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
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        setModalVisible(false);
                                        updateUserData({ role: "STUDENT" });
                                    }}
                                    >
                                    <Text style={styles.textStyle}>Student</Text>
                                </Pressable>
                            </View>
                            <View>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        setModalVisible(false);
                                        updateUserData({ role: "TUTOR" });
                                    }}
                                >
                                    <Text style={styles.textStyle}>Tutor</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
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
