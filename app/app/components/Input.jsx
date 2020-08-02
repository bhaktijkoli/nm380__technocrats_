import React from 'react';
import { View, TextInput } from 'react-native';

export default Input = (props) => {
    return (
        <View style={{ width: '100%', paddingVertical: 5, paddingHorizontal: 10, backgroundColor: '#FFF', borderColor: '#eee', borderWidth: 1, marginBottom: 20 }}>
            <TextInput
                style={{
                    width: '100%',
                    padding: 0,
                    fontSize: 16,
                }}
                {...props}
            />
        </View>
    )
}