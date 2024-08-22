 const request = require('sync-request');

// define constants
const KIN_OWL_URL = 'http://purl.org/ga4gh/kin.owl';
const RE = /# Object Property: <http:\/\/purl.org\/ga4gh\/kin.owl#(KIN_[0-9]{3})> \(([A-Za-z]+)\)/;
const CODE_TO_CONCEPT = {
	'KIN:001': 'IS_RELATIVE',
	'KIN:002': 'IS_BIOLOGICAL_RELATIVE',
	'KIN:003': 'IS_BIOLOGICAL_PARENT',
	'KIN:004': 'IS_SPERM_DONOR',
	'KIN:005': 'IS_GESTATIONAL_CARRIER',
	'KIN:006': 'IS_SURROGATE_OVUM_DONOR',
	'KIN:007': 'IS_BIOLOGICAL_SIBLING',
	'KIN:008': 'IS_FULL_SIBLING',
	'KIN:009': 'IS_TWIN',
	'KIN:010': 'IS_MONOZYGOTIC_TWIN',
	'KIN:011': 'IS_POLYZYGOTIC_TWIN',
	'KIN:012': 'IS_HALF_SIBLING',
	'KIN:013': 'IS_PARENTAL_SIBLING',
	'KIN:014': 'IS_COUSIN',
	'KIN:015': 'IS_MATERNAL_COUSIN',
	'KIN:016': 'IS_PATERNAL_COUSIN',
	'KIN:017': 'IS_GRANDPARENT',
	'KIN:018': 'IS_GREAT_GRANDPARENT',
	'KIN:019': 'IS_SOCIAL_LEGAL_RELATIVE',
	'KIN:020': 'IS_PARENT_FIGURE',
	'KIN:021': 'IS_FOSTER_PARENT',
	'KIN:022': 'IS_ADOPTIVE_PARENT',
	'KIN:023': 'IS_STEP_PARENT',
	'KIN:024': 'IS_SIBLING_FIGURE',
	'KIN:025': 'IS_STEP_SIBLING',
	'KIN:026': 'IS_PARTNER',
	'KIN:027': 'IS_BIOLOGICAL_MOTHER',
	'KIN:028': 'IS_BIOLOGICAL_FATHER',
	'KIN:029': 'IS_MITOCHONDRIAL_DONOR',
	'KIN:030': 'IS_CONSANGUINEOUS_PARTNER',
	'KIN:031': 'HAS_SEX',
	'KIN:032': 'IS_BIOLOGICAL_CHILD',
	'KIN:033': 'HAS_BIOLOGICAL_CHILD',
	'KIN:034': 'HAS_BIOLOGICAL_PARENT',
	'KIN:035': 'HAS_GRANDPARENT',
	'KIN:036': 'IS_GRANDCHILD',
	'KIN:037': 'HAS_GRANDCHILD',
	'KIN:038': 'IS_OVUM_DONOR',
	'KIN:039': 'HAS_GESTATIONAL_CARRIER',
	'KIN:040': 'HAS_BIOLOGICAL_FATHER',
	'KIN:041': 'HAS_BIOLOGICAL_MOTHER',
	'KIN:042': 'HAS_OVUM_DONOR',
	'KIN:043': 'HAS_SURROGATE_OVUM_DONOR',
	'KIN:044': 'HAS_SPERM_DONOR',
	'KIN:045': 'HAS_GREAT_GRANDPARENT',
	'KIN:046': 'HAS_PARENTAL_SIBLING',
	'KIN:047': 'IS_GREAT_GRANDCHILD_OF',
	'KIN:050': 'IS_SEPARATED_PARTNER_OF',
	'KIN:051': 'IS_SEPARATED_CONSANGUINEOUS_PARTNER_OF',
	'KIN:052': 'IS_MATERNAL_GRANDPARENT_OF',
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
		if (!concept) {
			throw new Error(
				`${code} not found in the concept object.\n`
				+ 'Please update the concept object.'
			);
		}
		Ontology[concept] = { id: code, label: display };
	}
});

module.exports = Ontology;
