import AsyncStorage from "@react-native-async-storage/async-storage"
import { AsyncStorageKeys } from "../../../enums/async-storage-keys"
import _ from "lodash";
import * as Keychain from "react-native-keychain"
import { JellifyServer } from "../../../types/JellifyServer";


export const fetchCredentials : () => Promise<Keychain.SharedWebCredentials> = () => new Promise(async (resolve, reject) => {

    console.log("Attempting to use stored credentials");

    let server = await fetchServer();

    console.debug(`REMOVE THIS::Server name ${server.name}`);

    if (_.isEmpty(server.url)) {
        console.warn("Server url was empty")
        throw new Error("Unable to retrieve credentials without a server URL");
    }

    const keychain = await Keychain.getInternetCredentials(server.url!);

    if (!keychain) {
        console.warn("No keychain for server address - signin required");
        throw new Error("Unable to retrieve credentials for server address from keychain");
    }

    resolve(keychain as Keychain.SharedWebCredentials)
});

export const fetchServer : () => Promise<JellifyServer> = () => new Promise(async (resolve, reject) => {

    console.log("Attempting to fetch server address from storage");
    
    let serverJson = await AsyncStorage.getItem(AsyncStorageKeys.ServerUrl);

    if (_.isNull(serverJson)) {
        throw new Error("No stored server address exists");
    }

    try {
        let server : JellifyServer = JSON.parse(serverJson) as JellifyServer;
        resolve(server);
    } catch(error: any) {
        throw new Error(error)
    }
});