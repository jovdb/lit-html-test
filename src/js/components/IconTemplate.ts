namespace components {

	export type IconName = "user" | "question";
	export function icon(options: {
		name: IconName;
		color?: string;
	}) {
		const {name, color} = options;

		let svgData = svg``;
		switch (name) {
			case "user":
				svgData = svg`<svg version="1.1" viewBox="0 0 248.349 248.349">
					<g>
						<path d="M9.954,241.305h228.441c3.051,0,5.896-1.246,7.805-3.416c1.659-1.882,2.393-4.27,2.078-6.723 c-5.357-41.734-31.019-76.511-66.15-95.053c-14.849,14.849-35.348,24.046-57.953,24.046s-43.105-9.197-57.953-24.046 C31.09,154.65,5.423,189.432,0.071,231.166c-0.315,2.453,0.424,4.846,2.078,6.723C4.058,240.059,6.903,241.305,9.954,241.305z" />
						<path d="M72.699,127.09c1.333,1.398,2.725,2.73,4.166,4.019c12.586,11.259,29.137,18.166,47.309,18.166 s34.723-6.913,47.309-18.166c1.441-1.289,2.834-2.622,4.166-4.019c1.327-1.398,2.622-2.828,3.84-4.329 c9.861-12.211,15.8-27.717,15.8-44.6c0-39.216-31.906-71.116-71.116-71.116S53.059,38.95,53.059,78.16 c0,16.883,5.939,32.39,15.8,44.6C70.072,124.262,71.366,125.687,72.699,127.09z" />
					</g>
				</svg>`;
				break;
			case "question":
				svgData = svg`<svg version="1.1" viewBox="0 0 365.442 365.442">
					<g>
						<path d="M212.994,274.074h-68.522c-3.042,0-5.708,1.149-7.992,3.429c-2.286,2.286-3.427,4.948-3.427,7.994v68.525 c0,3.046,1.145,5.712,3.427,7.994c2.284,2.279,4.947,3.426,7.992,3.426h68.522c3.042,0,5.715-1.144,7.99-3.426 c2.29-2.282,3.433-4.948,3.433-7.994v-68.525c0-3.046-1.14-5.708-3.433-7.994C218.709,275.217,216.036,274.074,212.994,274.074z" />
						<path d="M302.935,68.951c-7.806-14.378-17.891-26.506-30.266-36.406c-12.367-9.896-26.271-17.799-41.685-23.697 C215.567,2.952,200.246,0,185.016,0C127.157,0,83,25.315,52.544,75.946c-1.521,2.473-2.046,5.137-1.571,7.993 c0.478,2.852,1.953,5.232,4.427,7.135l46.824,35.691c2.474,1.52,4.854,2.281,7.139,2.281c3.427,0,6.375-1.525,8.852-4.57 c13.702-17.128,23.887-28.072,30.548-32.833c8.186-5.518,18.461-8.276,30.833-8.276c11.61,0,21.838,3.046,30.692,9.132 c8.85,6.092,13.271,13.135,13.271,21.129c0,8.942-2.375,16.178-7.135,21.698c-4.757,5.518-12.754,10.845-23.986,15.986 c-14.842,6.661-28.457,16.988-40.823,30.978c-12.375,13.991-18.558,28.885-18.558,44.682v12.847c0,3.62,0.994,7.187,2.996,10.708 c2,3.524,4.425,5.283,7.282,5.283h68.521c3.046,0,5.708-1.472,7.994-4.432c2.279-2.942,3.426-6.036,3.426-9.267 c0-4.757,2.617-11.14,7.847-19.13c5.235-7.994,11.752-14.186,19.562-18.565c7.419-4.186,13.219-7.56,17.411-10.133 c4.196-2.566,9.664-6.715,16.423-12.421c6.756-5.712,11.991-11.375,15.698-16.988c3.713-5.614,7.046-12.896,9.996-21.844 c2.956-8.945,4.428-18.558,4.428-28.835C314.639,98.397,310.734,83.314,302.935,68.951z"/>
					</g>
				</svg>`;
				break;
			default:
				return app.fail(name);
		}

		return html`<div class="icon" data-name$="${name}" style$="${color ? `fill: ${color}` : ""}">${svgData}</div>`;
	}
}
