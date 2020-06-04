class Analyzer {
	recognition: any;
	isFinish: boolean = false;
	constructor(onFinishRef, onInterimRef) {
		const recognition = ((klass) => {
			return new klass();
			// @ts-ignore Property 'webkitSpeechRecognition' does not exist on type 'Window & typeof globalThis'.
		})(window.webkitSpeechRecognition || SpeechRecognition);

		recognition.interimResults = (onInterimRef !== undefined);
		recognition.maxAlternatives = 1;
		recognition.continuous = false;

		recognition.onstart = () => {
			this.isFinish = false
		};

		recognition.onend = () => {
			this.start()
		};

		recognition.onerror = (e) => {
			if (e.error === 'no-speech') {
				this.start();
			}
		};

		recognition.onspeechend = () => {
			setTimeout(() => {
				if (this.isFinish) { return; }
				this.start();
			}, 500);
		};
		recognition.onresult = (event) => {
			const result = event.results[event.results.length - 1];
			const transcript = result[0].transcript;
			if (result.isFinal) {
				this.isFinish = true
				onFinishRef.current(transcript);
				this.start();
			}
			else {
				onInterimRef.current(transcript);
			}
		}
		this.recognition = recognition;
	}
	start() {
		try {
			this.recognition.start();
		} catch (e) {
			//			console.info("speech error", e)
		}
	}
	stop(): void {
		this.recognition.stop();
	}
}
export default Analyzer