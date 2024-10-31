declare module 'uuid' {
	export type Uuid = string & { __type__: 'Uuid'; __witness__: unknown };
	export const v4: () => Uuid;
}
