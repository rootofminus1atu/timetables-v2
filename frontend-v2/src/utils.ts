export type DataReturn<Func extends (...args: any) => any> = Awaited<
	ReturnType<Func>
>