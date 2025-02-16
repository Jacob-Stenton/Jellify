import { runOnRuntime } from "react-native-reanimated";
import { convertRunTimeTicksToSeconds } from "../../../helpers/runtimeticks";
import { Text } from "./text";
import React from "react";
import { backgroundRuntime } from "../../../App";

export function RunTimeSeconds({ children }: { children: number }) : React.JSX.Element {
    return <Text bold>{ calculateRunTimeFromSeconds(children) }</Text>
}

export function RunTimeTicks({ children } : { children?: number | null | undefined }) : React.JSX.Element {
    if (!!!children) 
        return <Text>0:00</Text>

    let time = runOnRuntime(backgroundRuntime, (ticks : number) => {
        'worklet';
        return calculateRunTimeFromTicks(ticks)
    })(children);

    return (
        <Text 
            style={{display: "block"}} 
            color="$borderColor"
        >
            { time }
        </Text>
    )
}

function calculateRunTimeFromSeconds(seconds: number) : string {
    'worklet';
    const runTimeHours = Math.floor(seconds / 3600);
    const runTimeMinutes = Math.floor((seconds % 3600) / 60)
    const runTimeSeconds = Math.floor(seconds % 60);

    return (runTimeHours != 0 ? `${padRunTimeNumber(runTimeHours)}:` : "") + 
        (runTimeHours != 0 ? `${padRunTimeNumber(runTimeMinutes)}:` : `${runTimeMinutes}:`) +
        (padRunTimeNumber(runTimeSeconds));
}

function calculateRunTimeFromTicks(runTimeTicks: number) : string {
    'worklet';
    const runTimeTotalSeconds = convertRunTimeTicksToSeconds(runTimeTicks);
    return calculateRunTimeFromSeconds(runTimeTotalSeconds);
}

function padRunTimeNumber(number: number) : string {
    'worklet';
    if (number >= 10) {
        return `${number}`
    }

    return `0${number}`;
}