import { Router, ConboEvent, assign } from 'conbo';
import ViewNavigator from 'conbo-viewnavigator';

/**
 * RouteNavigator for ConboJS
 * @author	Mesmotronic Limited <https://www.mesmotronic.com/>
 * @fires	conbo.ConboEvent#FAULT
 */
export default class RouteNavigator extends ViewNavigator
{
	/**
	 * Reference to the Router instance currently in use
	 */
	public router:Router;

	/**
	 * An object containing path:viewClassName pairs, where the View class must be
	 * stored in the current application's Namespace
	 *
	 * @example		{'login':'LoginView', user/:name':'UserView'}
	 */
	public routes:any;

	/**
	 * @private
	 */
	protected __construct(options:any):void
	{
		super.__construct(options);

		let router:Router = options.router || new Router
		({
			context: this.context,
			routes: options.routes || this.routes
		});

		router
			.addEventListener(ConboEvent.FAULT, this.dispatchEvent, this)
			.addEventListener(ConboEvent.CHANGE, this.__changeHandler, this)
			;

		this.router = router;
	}

	/**
	 * @private
	 */
	private __changeHandler(event:ConboEvent):void
	{
		let viewClass = this.context.namespace[event.name];
		let options = assign({}, event.params, {context:this.context});

		this.replaceView(viewClass, options);
	}
}