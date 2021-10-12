const protobuf = require('protobufjs');
const path = require('path');

var proto = protobuf.loadSync(path.resolve(__dirname, 'pedigree.proto'));

var Pedigree = proto.lookupType('org.ga4gh.pedigree.v1.Pedigree');
var Individual = proto.lookupType('org.ga4gh.pedigree.v1.Individual');
var Relationship = proto.lookupType('org.ga4gh.pedigree.v1.Relationship');
var Concept = proto.lookupType('org.ga4gh.pedigree.v1.Concept');
var Identifier = proto.lookupType('org.ga4gh.pedigree.v1.Identifier');

const Ontology = require('./ontology.js'); 

IS_MOTHER = Concept.create(Ontology.IS_BIOLOGICAL_MOTHER);
IS_FATHER = Concept.create(Ontology.IS_BIOLOGICAL_FATHER);
GENDER_FEMALE = Concept.create({id: 'female'});
GENDER_MALE = Concept.create({id: 'male'});
GENDER_OTHER = Concept.create({id: 'other'});
GENDER_UNKNOWN = Concept.create({id: 'unknown'});

var Model = function(data) {
  this.pedigree = Pedigree.create(data);
  this.n = this.pedigree.individuals.length;
};

Model.prototype = {
  setFamilyId: function(id) {
    this.pedigree.identifiers = [Identifier.create({'id': id})];
  },

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
    return (individual && individual.hasOwnProperty('gender') && individual.gender.id === GENDER_FEMALE.id);
  },

  isMale: function(id) {
    var individual = this.getIndividual(id);
    return (individual && individual.hasOwnProperty('gender') && individual.gender.id === GENDER_MALE.id);
  },

  updateIndividual: function(id, properties) {
    /*
    properties:
    - name
    - gender
    - affected
    - externalID
    - lifeStatus (not yet supported)
    */
    var individual = this.getIndividual(id);
    if (properties.hasOwnProperty('name')) {
      individual.name = properties.name;
    }
    if (properties.hasOwnProperty('gender')) {
      switch (properties.gender) {
        case 'F':
          individual.gender = GENDER_FEMALE;
          break;
        case 'M':
          individual.gender = GENDER_MALE;
          break;
        case 'O':
          individual.gender = GENDER_OTHER;
          break;
        default:
          individual.gender = GENDER_UNKNOWN;
      }
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
      this.pedigree.relationships.push(Relationship.create({individual: motherId, relation: IS_MOTHER, relative: childId}));
    }
    if (fatherId !== null) {
      this.pedigree.relationships.push(Relationship.create({individual: fatherId, relation: IS_FATHER, relative: childId}));
    }
  },

  // [father, mother]
  getParents: function(id) {
    var fatherships = this.pedigree.relationships.filter(rel => rel.relation.id == IS_FATHER.id && rel.relative == id);
    var motherships = this.pedigree.relationships.filter(rel => rel.relation.id == IS_MOTHER.id && rel.relative == id);
    var father = null;
    var mother = null;
    if (fatherships.length === 1) {
      father = fatherships[0].individual;
    }
    if (motherships.length === 1) {
      mother = motherships[0].individual;
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
