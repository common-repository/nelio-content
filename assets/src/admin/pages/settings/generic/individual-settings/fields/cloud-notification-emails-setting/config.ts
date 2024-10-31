export const DEFAULT_ATTRS: Attrs = {
	status: 'loading',
};

export type Attrs = {
	readonly status: 'ready' | 'loading' | 'error';
};
