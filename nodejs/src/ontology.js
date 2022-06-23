 const request = require('sync-request');

// define constants
const KIN_OWL_URL = 'http://purl.org/ga4gh/kin.owl';
const RE = /# Object Property: <http:\/\/purl.org\/ga4gh\/kin.owl#(KIN_[0-9]{3})> \(([A-Za-z]+)\)/;
const CODE_TO_CONCEPT = {
	'KIN:027': 'IS_BIOLOGICAL_MOTHER',
	'KIN:028': 'IS_BIOLOGICAL_FATHER',
};


// define ontology
const Ontology = {};

// send http request
const response = request('GET', KIN_OWL_URL);

// parse owl
const data = response.getBody('UTF-8');
const lines = data.split('\n');
lines.forEach(line => {
	if (line.startsWith('# Object Property:')) {
		let [objProp, code, display] = line.match(RE);
		code = code.replace('_', ':');
		const concept = CODE_TO_CONCEPT[code]
		if (concept) {
			Ontology[concept] = { id: code, label: display };
		}
	}
});

module.exports = Ontology;
