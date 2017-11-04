namespace api {
	// @ts-ignore
	export const loginUserAsync = async (userName: string, password: string) => {
		return new Promise<undefined>(resolve => {
			setTimeout(() => {
				resolve(undefined);
			}, 500);
		});
	};
}