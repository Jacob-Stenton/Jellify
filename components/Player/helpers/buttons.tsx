import { State } from "react-native-track-player";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Spinner } from "tamagui";
import Icon from "../../Global/helpers/icon";
import { usePlayerContext } from "@/player/provider";

export default function PlayPauseButton() : React.JSX.Element {

    const { playbackState, useTogglePlayback } = usePlayerContext();

    let button : React.JSX.Element;

    switch (playbackState) {
        case (State.Playing) : {
            button = <Icon name="pause" large onPress={() => useTogglePlayback.mutate(undefined)} />;
            break;
        }
    
        case (State.Buffering) :
        case (State.Loading) : {
            button = <Spinner size="small" color={Colors.Primary}/>;
            break;
        }
        
        default : {
            button = <Icon name="play" large onPress={() => useTogglePlayback.mutate(undefined)} />
            break;
        }
    }

    return button;
}