const protobuf = require('protobufjs');
const path = require('path');

var proto = protobuf.loadSync(path.resolve(__dirname, 'pedigree.proto'));

var Pedigree = proto.lookupType('org.ga4gh.pedigree.v1.Pedigree');
var Individual = proto.lookupType('org.ga4gh.pedigree.v1.Individual');
var Relationship = proto.lookupType('org.ga4gh.pedigree.v1.Relationship');
var Concept = proto.lookupType('org.ga4gh.pedigree.v1.Concept');
var Identifier = proto.lookupType('org.ga4gh.pedigree.v1.Identifier');

const Ontology = require('./ontology.js'); 

MOTHER = Concept.create({'id': Ontology.IS_BIOLOGICAL_MOTHER});
FATHER = Concept.create({'id': Ontology.IS_BIOLOGICAL_FATHER});


var Model = function(data) {
  this.pedigree = Pedigree.create(data);
  this.n = this.pedigree.individuals.length;
};

Model.prototype = {
  // returns id
  addIndividual: function(properties) {
    var id = this.n;
    var individual = Individual.create({
      id: id,
    })
    this.pedigree.individuals.push(individual);
    this.updateIndividual(id, properties);
    this.n++;
    return id;
  },

  // These two helper methods and the use of F/M concept ids is a placeholder
  isFemale: function(id) {
    var individual = this.getIndividual(id);
    return (individual && individual.hasOwnProperty('gender') && individual.gender.id === "F");
  },

  isMale: function(id) {
    var individual = this.getIndividual(id);
    return (individual && individual.hasOwnProperty('gender') && individual.gender.id === "M");
  },

  updateIndividual: function(id, properties) {
    /*
    properties:
    - name
    - gender
    - affected
    - externalID
    - lifeStatus (not yet supported)
    - disorders (not yet supported)
    - evaluated (not yet supported)
    */
    var individual = this.getIndividual(id);
    if (properties.hasOwnProperty('name')) {
      individual.name = properties.name;
    }
    if (properties.hasOwnProperty('gender')) {
      individual.gender = Concept.create({'id': properties.gender})
    }
    if (properties.hasOwnProperty('externalID')) {
      individual.identifiers = []
      individual.identifiers.push(Identifier.create({'id': properties.externalID}))
    }
    if (properties.hasOwnProperty('affected')) {
      individual.affected = properties.affected;
    }
  },

  getIndividual: function(id) {
    return this.pedigree.individuals[id];
  },

  // motherId or fatherId may be null
  addChild: function(motherId, fatherId, childId) {
    if (motherId !== null) {
      this.pedigree.relationships.push(Relationship.create({individual: childId, relation: MOTHER, relative: motherId}));
    }
    if (fatherId !== null) {
      this.pedigree.relationships.push(Relationship.create({individual: childId, relation: FATHER, relative: fatherId}));
    }
  },

  // [father, mother]
  getParents: function(id) {
    var fatherships = this.pedigree.relationships.filter(rel => rel.individual == id && rel.relation.id == FATHER.id);
    var motherships = this.pedigree.relationships.filter(rel => rel.individual == id && rel.relation.id == MOTHER.id);
    var father = null;
    var mother = null;
    if (fatherships.length === 1) {
      father = fatherships[0].relative;
    }
    if (motherships.length === 1) {
      mother = motherships[0].relative;
    }
    if (father !== null || mother !== null) {
      return [father, mother];
    } else {
      return [];
    }
  },

  toJSON: function() {
    return this.pedigree.toJSON();
  },
};

module.exports = Model;
