var PedigreeExport = function () {
};

PedigreeExport.prototype = {
};

//===============================================================================================

/*
 *  PED format:
 *  (from http://pngu.mgh.harvard.edu/~purcell/plink/data.shtml#ped)
 *   Family ID
 *   Individual ID
 *   Paternal ID
 *   Maternal ID
 *   Sex (1=male; 2=female; other=unknown)
 *   Phenotype
 *
 *   Individual, Paternal, and Maternal IDs use the first external id available, or else the internal logical id
 *
 *   Phenotype, by default, should be coded as:
 *      -9 missing
 *       0 missing
 *       1 unaffected
 *       2 affected
 */
PedigreeExport.exportAsPED = function(pedigree) {
  var output = '';

  var getFirstIdentifier = function(protobufObj, fallback) {
    if (protobufObj.hasOwnProperty('identifiers') && protobufObj.identifiers.length > 0) {
      return protobufObj.identifiers[0].id;
    } else {
      return fallback;
    }
  };

  var getIndividualIdentifier = function(individualId) {
    var individual = pedigree.getIndividual(individualId);
    // Use first external id if available
    return getFirstIdentifier(individual, individualId);
  };

  var familyID = getFirstIdentifier(pedigree.pedigree, '1');

  for (var i = 0; i < pedigree.n; i++) {
    var individual = pedigree.getIndividual(i);

    output += familyID + ' ' + getIndividualIdentifier(i) + ' ';

    // mother & father
    var parents = pedigree.getParents(i);

    if (parents.length > 0) {
      var father = parents[0];
      var mother = parents[1];

      if (pedigree.isFemale(parents[0]) || pedigree.isMale(parents[1])) {
        father = parents[1];
        mother = parents[0];
      }
      output += getIndividualIdentifier(father) + ' ' + getIndividualIdentifier(mother) + ' ';
    } else {
      output += '0 0 ';
    }

    var sex = 3;
    if (pedigree.isMale(i)) {
      sex = 1;
    } else if (pedigree.isFemale(i)) {
      sex = 2;
    }
    output += (sex + ' ');

    var status = -9; //missing
    if (individual.hasOwnProperty('affected')) {
      if (individual.affected) {
        status = 2;
      } else {
        status = 1;
      }
    }
    output += status + '\n';
  }

  return output;
};

module.exports = PedigreeExport;
