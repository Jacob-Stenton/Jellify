import React from 'react';
import { Input as TamaguiInput, InputProps as TamaguiInputProps, XStack, YStack} from 'tamagui';

interface InputProps extends TamaguiInputProps {
    prependElement?: React.JSX.Element | undefined;
}

export default function Input(props: InputProps): React.JSX.Element {

    return (
        <XStack>

            
            <YStack 
                flex={1} 
                alignContent='flex-end' 
                justifyContent='center'
            >
                { props.prependElement && (
                    props.prependElement
                )}

            </YStack>

            <TamaguiInput 
                flexGrow={5}
                {...props}
                clearButtonMode="always"
            />
        </XStack>
    )
}