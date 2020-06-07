import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

const InputBox = (props) => {
  // props.onChangeText
  // props.description
  //
  const description = props.description;
  const onChangeText = props.onChangeText;

  return (
    <View style={styles.view}>
      <View style={styles.input}>
        <TextInput
          placeholder={description}
          style={styles.text}
          onChangeText={(text) => onChangeText(text)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    alignSelf: "stretch",
    margin: 5,
  },
  input: {
    backgroundColor: "#ddd",
    alignItems: "center",
    borderRadius: 25,
    padding: 10,
  },
  text: {
    fontSize: 24,
    textAlign: "center",
    alignItems: "center",
    color: "#777",
  },
});

export default InputBox;
