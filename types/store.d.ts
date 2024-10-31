declare module 'store' {
	export type Store = {
		readonly set: < T >( key: string, value: StoreValue< T > ) => void;
		readonly get: < T >( key: string ) => StoreValue< T > | undefined;
		readonly remove: ( key: string ) => void;
		readonly each: ( fn: ( v: StoreValue, k: string ) => void ) => void;
	};

	export type StoreValue< T = unknown > = {
		readonly value: T;
		readonly expiration?: number;
	};

	const store: Store;
	export default store;
}
