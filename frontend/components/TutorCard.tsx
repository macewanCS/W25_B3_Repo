import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const UserCard = ({ user }) => {
    return (
        <View style={styles.card}>
            <View style={styles.container}>
                <Image source={{ uri: user.icon }} style={styles.avatar} />
                <View>
                    <Text style={styles.username}>{user.username}</Text>
                    <Text style={styles.text}>Some Random info</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 10,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#808080',
        elevation: 3,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 15,
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    text: {
        fontSize: 14,
        color: '#666',
    },
});

export default UserCard;
