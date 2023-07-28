import { useAudioContext } from '../AudioContextProvider';
import { useSoundFont } from '../../adapters/Soundfont';
import { Keyboard } from '../Keyboard';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useMount } from '../../utils/useMount';
import { useEffect } from 'react';
import { useInstrument } from '../../state/Instrument';

export const KeyboardWithInstrument = () => {
  const AudioContext = useAudioContext()!;
  const { instrument } = useInstrument();
  const { loading, play, stop, load, current } = useSoundFont({ AudioContext });

  // useMount(() => load())

  useEffect(() => {
    if (!loading && instrument !== current) load(instrument);
  }, [load, loading, current, instrument]);

  return <Keyboard loading={loading} play={play} stop={stop} />;
};
