import { Step } from 'intro.js';

declare module 'intro.js' {
	interface IntroJs {
		readonly onstart: ( fn: () => void ) => void;
		readonly _options: {
			readonly steps: ReadonlyArray< Step >;
		};
	}
}
