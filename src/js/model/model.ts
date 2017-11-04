/*
╭────────────────────────────────╮
│ Model                          │
├────────────────────────────────┤
│ loggedOnUserName               │
╰────────────────────────────────╯
*/

namespace app {
	export interface IModel {
		loggedOnUserName: string;
		shouldBlockUI: boolean;
	}

	export let model: IModel = {
		loggedOnUserName: "",
		shouldBlockUI: false
	};
}