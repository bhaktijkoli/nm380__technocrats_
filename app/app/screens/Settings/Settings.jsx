import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Switch, FlatList, Button, Alert } from "react-native";

const Settings = () => {
  const [value, onChangeText] = React.useState('Default is 0');
  const [checked, setChecked] = React.useState('first');
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  return (
    <View>
      <Text style={styles.headerText}>Settings</Text>

      <Text style={styles.custText1}>Quality</Text>
      <View style={styles.custView} key="quality">
        <Button title="2160 p" color="#282828"
          onPress={() => Alert.alert('2160 p selected')} />
        <Button title="1080 p" color="#282828"
          onPress={() => Alert.alert('1080 p selected')} />
        <Button title="720 p" color="#282828"
          onPress={() => Alert.alert('720 p selected')} />
        <Button title="480 p" color="#282828"
          onPress={() => Alert.alert('480 p selected')} />
      </View>

      <Text style={styles.custText1}>Orientation</Text>
      <View style={styles.custView} key="orientation">
        <Button title="Potrait" color="#282828"
          onPress={() => Alert.alert('potrait mode selected')} />
        <Button title="Landscape" color="#282828"
          onPress={() => Alert.alert('landscape mode selected')} />
      </View>

      <View style={styles.custView} key="max-duration">
        <Text style={styles.custText2}>Max Duration (in secs)</Text>
        <TextInput
          style={{ height: 40, width: 150, textAlign: "center", borderColor: 'gray', borderWidth: 1 }}
          onChangeText1={text => onChangeText(text)}
          placeholder={value} keyboardType="numeric"
        />
      </View>

      <View style={styles.custView} key="max-file-size">
        <Text style={styles.custText2}>Max File Size (in bytes)</Text>
        <TextInput
          style={{ height: 40, width: 150, textAlign: "center", borderColor: 'gray', borderWidth: 1 }}
          onChangeText2={text => onChangeText(text)}
          placeholder={value} keyboardType="numeric"
        />
      </View>

      <View style={styles.custView} key="mirrorVid">
        <Text style={styles.custText2}>Mirror Video</Text>
        <Switch style={{ alignSelf: "center" }}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      <View style={styles.custView} key="mute">
        <Text style={styles.custText2}>Mute Audio</Text>
        <Switch style={{ alignSelf: "center" }}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      <View style={styles.custView} key="mute">
        <Button title="Cancel" color="#f00"
          onPress={() => Alert.alert('cancelled')} />
        <Button title="SAVE" color="#0f0"
          onPress={() => Alert.alert('changes saved')} />
      </View>

    </View>
  );

}

const styles = StyleSheet.create({
  headerText: {
    alignSelf: "center",
    marginVertical: 10,
    fontSize: 34
  },
  custView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingHorizontal: 5,
    marginVertical: 20
  },
  custText1: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    marginVertical: 15,
    fontSize: 20
  },
  custText2: {
    paddingHorizontal: 5,
    marginVertical: 5,
    fontSize: 20
  }

});

export default Settings
