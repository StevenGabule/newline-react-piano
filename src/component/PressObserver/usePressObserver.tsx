import { useEffect, useState} from 'react'
import {Key as KeyLabel} from '../../domain/keyboard'

type IsPressed = boolean;
type EventCode = string;
type CallbackFunction = () => void;

type Settings = {
  watchKey: KeyLabel;
  onStartPress: CallbackFunction;
  onFinishPress: CallbackFunction;
};

export function usePressObserver({ watchKey, onStartPress, onFinishPress}: Settings) : IsPressed {
	const [pressed, setPressed] = useState<IsPressed>(false);

	function fromEventCode(code: EventCode) : KeyLabel {
		const prefixRegex = /Key|Digit/gi;
		return code.replace(prefixRegex, "");
	}

	function equal(watchKey: KeyLabel, eventCode: EventCode) : boolean {
		return fromEventCode(eventCode).toUpperCase() === watchKey.toUpperCase();
	}

	useEffect(() => {
		function handlePressStart({code}: KeyboardEvent) : void {
			if (pressed || !equal(watchKey, code)) return;
			setPressed(true);
			onStartPress()
		}

		function handlePressFinish({code}: KeyboardEvent) : void {
			if(!pressed || !equal(watchKey, code)) return;
			setPressed(false)
			onFinishPress()
		}

		document.addEventListener('keydown', handlePressStart);
		document.addEventListener('keyup', handlePressFinish);

		return () => {
			document.removeEventListener('keydown', handlePressStart);
			document.removeEventListener('keyup', handlePressFinish);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onFinishPress, onStartPress, pressed, watchKey, setPressed])

	return pressed;
}