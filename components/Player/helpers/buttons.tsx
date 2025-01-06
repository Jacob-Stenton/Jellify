import { State } from "react-native-track-player";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Spinner } from "tamagui";
import Icon from "../../Global/icon";

export function playPauseButton(playbackState: State | undefined, play: Function, pause: Function) {

    let button : React.JSX.Element;

    switch (playbackState) {
        case (State.Playing) : {
            button = <Icon name="pause" large onPress={() => pause()} />;
            break;
        }
    
        case (State.Buffering) :
        case (State.Loading) : {
            button = <Spinner size="small" color={Colors.Primary}/>;
            break;
        }
        
        default : {
            button = <Icon name="play" large onPress={() => play()} />
            break;
        }
    }

    return button;
}