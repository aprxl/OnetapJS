const Onetap = require( "./lib/api" );

const api = new Onetap(
	"d1a013b33e1f6ff9e238651d830c95ad.access",
	"4f6acce6fdfcc8d2b6651d93d0373af956059b9d8fa372b1180cc6d5040f1220",
	"xmzPy6kXqyqa3yHEj6aN00eqQfH7Ryry"
);

api.DeleteConfigSubscription(() => { console.log('deleted config subscription') }, 1364, 3965);

module.exports = { Onetap };