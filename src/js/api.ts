namespace api {
	// @ts-ignore
	export const loginUserAsync = async (userName: string, password: string) => {
		return new Promise<boolean>(resolve => {
			setTimeout(() => {
				resolve(true);
			}, 1000);
		});
	};
}