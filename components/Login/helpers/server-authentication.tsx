import React from "react";
import { Button, TextInput, useColorScheme, View } from "react-native";
import { clearServer } from "../../../api/mutators/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { AsyncStorageKeys } from "../../../enums/async-storage-keys";


export default function ServerAuthentication(): React.JSX.Element {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const isDarkMode = useColorScheme() === 'dark';

    const clearServer = useMutation({
        mutationFn: async () => {
            return await AsyncStorage.setItem(AsyncStorageKeys.ServerUrl, "");
        }
    })

    return (
        <View>
            <Button
                title="Change Server"
                onPress={() => clearServer.mutate()}
                color={'purple'}
                />

            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={(value) => setUsername(value)}
                />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={(value) => setPassword(value)}
                secureTextEntry
                />

            <Button 
                title="Sign in" 
                color={'purple'}
                onPress={() => console.log("sign in pressed")}
                />
        </View>
    );
}