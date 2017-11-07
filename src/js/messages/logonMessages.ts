namespace app {

	export type LogOnUserRequest = Request<"logOnUser", { userName: string; password: string }>;
	export type LogOnUserResponse = Response<LogOnUserRequest>;

	export type LogOffUserRequest = Request<"logOffUser">;
	export type LogOffUserResponse = Response<LogOffUserRequest>;

}