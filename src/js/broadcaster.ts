/*
╭────────────────────────────────╮
│ Broadcaster                    │
├────────────────────────────────┤
│ subscribe()                    │
│ publish()                      │
╰────────────────────────────────╯
*/

// tslint:disable-next-line
interface IMessage {}

interface IReadonlyBroadcaster {
	subscribe(onMessage: (message: IMessage) => void): () => void;
}

interface IBroadcaster extends IReadonlyBroadcaster {
	publish<TMessage extends IMessage>(message: TMessage): TMessage;
}


class Broadcaster implements IBroadcaster {
	private _listeners: ((action: IMessage) => void)[];

	constructor() {
		this._listeners = [];
	}

	/** Get notificaions of executed (root) commands */
	public subscribe(onMessage: (message: IMessage) => void): () => void {
		const copiedFunction = onMessage.bind(undefined);
		this._listeners.push(copiedFunction);
		return () => {
			const index = this._listeners.indexOf(copiedFunction);
			if (index >= 0) this._listeners.splice(index, 1);
		};
	}

	public publish<TMessage extends IMessage>(message: TMessage): TMessage {
		// First copy so unsubscribers don't manipulate the list iterating
		this._listeners.slice(0).forEach(listener => { listener(message); });
		return message;
	}

}
