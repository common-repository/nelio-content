interface Array< T > {
	filter< A >( cb: ( x: T ) => x is A ): Array< A >;
}

interface ReadonlyArray< T > {
	filter< A >( cb: ( x: T ) => x is A ): ReadonlyArray< A >;
}
