import { useState, useRef } from 'react'
import SoundFont, { InstrumentName, Player } from 'soundfont-player';
import { MidiValue } from '../../domain/note'
import { Optional } from '../../domain/types'
import { AudioNodesRegistry, DEFAULT_INSTRUMENT } from '../../domain/sound'

type Settings = {
	AudioContext: AudioContextType
}

interface Adapted {
	loading: boolean
	current: Optional<InstrumentName>

	load(instrument?: InstrumentName): Promise<void>
	play(note: MidiValue): Promise<void>
	stop(note: MidiValue): Promise<void>
}

export function useSoundFont({ AudioContext }: Settings): Adapted {
	let activeNodes: AudioNodesRegistry = {}
	// @ts-ignore
	const [current, setCurrent] = useState<Optional<InstrumentName>>(null)
	const [loading, setLoading] = useState<boolean>(false)

	// @ts-ignore
	const [player, setPlayer] = useState<Optional<Player>>(null)
	const audio = useRef(new AudioContext());

	async function load(instrument: InstrumentName = DEFAULT_INSTRUMENT) {
		setLoading(true);
		const player = await SoundFont.instrument(audio.current, instrument)
		setLoading(false)
		setCurrent(instrument)
		setPlayer(player)
	}

	async function resume() {
		return audio.current.state === 'suspended' ? await audio.current.resume() : Promise.resolve()
	}

	async function play(note: MidiValue) {
		await resume();
		if (!player) return;

		const node = player.play(note.toString())
		activeNodes = { ...activeNodes, [note]: node }
	}

	async function stop(note: MidiValue) {
		await resume();
		if (!activeNodes[note]) return;

		activeNodes[note]!.stop();
		// @ts-ignore
		activeNodes = { ...activeNodes, [note]: null }
	}

	return { loading, current, stop, load, play }
}