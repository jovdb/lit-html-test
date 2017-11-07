namespace api {
	// @ts-ignore
	export const loginUserAsync = async (userName: string, password: string) => {
		return new Promise<undefined>((resolve, reject) => {
			setTimeout(() => {
				if (Math.random() > 0.3) {
					resolve(undefined);
				} else {
					reject(new Error("Invalid user or password. Please try again."));
				}
			}, (Math.random() * 1000) + 100);
		});
	};
}