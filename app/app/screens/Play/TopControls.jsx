import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Grid, Row, Col } from 'react-native-easy-grid';

const styles = StyleSheet.create({
    buttonStyle: {
        width: 40,
        height: 40,
        backgroundColor: '#1f1f1f',
        borderRadius: 40,
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginRight: 10,
        marginBottom: 10,
    },
    iconStyle: {
        fontSize: 26,
        color: '#fff',
    },
    gridStyle: {
        paddingVertical: 20,
    },
    leftIcons: {
        paddingLeft: 20,
    },
    rightIcons: {
        paddingLeft: 20,
    },
    speedIndicator: {
        marginLeft: 20,
        paddingRight: 10,
        backgroundColor: '#1f1f1f',
        height: 40,
        borderTopLeftRadius: 40,
        borderBottomLeftRadius: 40,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    speedIcon: {
        fontSize: 30,
        color: '#fff',
        paddingHorizontal: 8,
    },
    speedText: {
        flexGrow: 1,
        fontSize: 16,
        color: '#fff',
    },
});

const IconButton = ({ onPress, iconName = '', buttonStyle = {}, iconStyle = {} }) => {
    return (
        <TouchableOpacity style={[styles.buttonStyle, buttonStyle]} onPress={onPress}>
            <Icon name={iconName} style={[styles.iconStyle, iconStyle]} />
        </TouchableOpacity>
    );
};

const TopControls = ({ style, speed = '0 km/h', onExport, onShare, onOpenInfo, onDelete, onToggleDarkMode }) => {
    return (
        <React.Fragment>
            <View style={{ position: 'absolute', top: 10, right: 0 }}>
                <View style={{ width: '100%' }}>
                    <IconButton onPress={onExport} iconName="export" iconStyle={{ marginLeft: 4 }} />
                    <IconButton onPress={onShare} iconName="share" iconStyle={{ marginBottom: 4 }} />
                    <IconButton onPress={onOpenInfo} iconName="information-outline" iconStyle={{ fontSize: 28 }} />
                    <IconButton onPress={onDelete} iconName="delete" />
                </View>
            </View>
            <View style={{ position: 'absolute', bottom: 20, right: 0 }}>
                <View style={styles.speedIndicator}>
                    <Icon style={[styles.speedIcon, { marginBottom: 2 }]} name="speedometer-slow" />
                    <Text style={styles.speedText}>{speed}</Text>
                </View>
            </View>
        </React.Fragment>
    );
};

export default TopControls;