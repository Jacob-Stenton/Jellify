import React from "react";
import { SliderProps as TamaguiSliderProps, SliderVerticalProps, Slider as TamaguiSlider } from "tamagui";

interface SliderProps {
    value?: number | undefined;
    max: number;
    width?: number | undefined
    props: TamaguiSliderProps
}

export function HorizontalSlider({ 
    value, 
    max,
    width, 
    props 
}: { 
    value?: number | undefined, 
    max: number;
    width?: number | undefined, 
    props?: TamaguiSliderProps | undefined
}) : React.JSX.Element {
    
    return (
        <TamaguiSlider 
            size="$4" 
            width={width} 
            value={value ? [value] : []}
            max={max} 
            step={1}
            orientation="horizontal"
            marginHorizontal={5}
            { ...props }
        >
            <TamaguiSlider.Track>
                <TamaguiSlider.TrackActive />
            </TamaguiSlider.Track>
            <TamaguiSlider.Thumb circular index={0} size={"$3"} />
        </TamaguiSlider>
    )
}
  
export function VerticalSlider(props: SliderVerticalProps) : React.JSX.Element {

    return ( 
        <TamaguiSlider 
            size="$3" 
            width={200} 
            defaultValue={[0]} 
            max={100} 
            step={1}
            orientation="vertical"
            marginVertical={5}
        >
            <TamaguiSlider.Track>
                <TamaguiSlider.TrackActive />
            </TamaguiSlider.Track>
            <TamaguiSlider.Thumb circular index={0} />
        </TamaguiSlider>
    )
}