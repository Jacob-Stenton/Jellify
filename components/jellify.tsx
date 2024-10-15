import { useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./Login/component";
import Navigation from "./navigation";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { setupPlayer } from "react-native-track-player/lib/src/trackPlayer";
import { useCredentials } from "../api/queries/keychain";
import _ from "lodash";

export default function Jellify(): React.JSX.Element {

  const isDarkMode = useColorScheme() === 'dark';

  setupPlayer();

  // Attempt to create API instance, if it fails we aren't authenticated yet
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  let { data, isError, isSuccess } = useCredentials;


  return (
    <NavigationContainer>
        { (!isError && !_.isUndefined(data)) ? <Navigation /> : <Login /> }
    </NavigationContainer>
  );
}