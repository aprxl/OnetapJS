const Onetap = require( "./lib/api" );

const api = new Onetap(
	"67d057bdb5100d90d8ca0c0fb176b924.access",
	"d6e247e474835d2608ffa83e50962ac529cf60f41850fe71ee7b5301eb749390",
	"tyxHSKa2nZvLp1EbwYNwDgjqTHg0FBfq"
);

api.GetConfigByName((cfg) => {
	console.log( "Found" );
}, "rage");

module.exports = { Onetap };