declare module 'ical-expander' {
	export default class IcalExpander {
		constructor ( args: Args ): IcalExpander;

		between( from: Date, end: Date ): {
			readonly events: ReadonlyArray< IcalEvent >;
			readonly occurrences: ReadonlyArray< IcalEvent >;
		};
	};

	export type Args = {
		readonly ics: string;
		readonly maxIterations: number;
	};

	export type IcalEvent = {
		readonly startDate: string;
		readonly endDate: string;
		readonly summary: string;
		readonly description: string;
		readonly item?: {
			readonly summary: string;
			readonly description: string;
		};
	};
}
