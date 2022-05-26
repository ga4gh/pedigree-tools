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
    if (i > 0) {
      output += '\n';
    }

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
    output += status;
  }

  return output;
};
/* ===============================================================================================
 *
 *  BOADICEA format:
 *  (from https://pluto.srl.cam.ac.uk/bd3/v3/docs/BWA_v3_user_guide.pdf)
 *
 *  line1: BOADICEA import pedigree file format 2.0
 *  line2: column titles
 *  line3+: one patient per line, with values separated by spaces or tabs, as follows:
 *
 *   FamID: Family/pedigree ID, character string (maximum 13 characters)
 *   Name: First name/ID of the family member, character string (maximum 8 characters)
 *   Target: The family member for whom the BOADICEA risk calculation is made, 1 = target for BOADICEA risk calculation, 0 = other family members. There must only be one BOADICEA target individual.
 *   IndivID: Unique ID of the family member, character string (maximum 7 characters)
 *   FathID: Unique ID of their father, 0 = no father, or character string (maximum 7 characters)
 *   MothID: Unique ID of their mother, 0 = unspecified, or character string (maximum 7 characters)
 *   Sex: M or F
 *   Twin: Identical twins, 0 = no identical twin, any non-zero character = twin.
 *   Dead: The current status of the family member, 0 = alive, 1 = dead
 *   Age: Age at last follow up, 0 = unspecified, integer = age at last follow up
 *   Yob: Year of birth, 0 = unspecified, or integer (consistent with Age if the person is alive)
 *   1BrCa: Age at first breast cancer diagnosis, 0 = unaffected, integer = age at diagnosis, AU = unknown age at diagnosis (affected unknown)
 *   2BrCa: Age at contralateral breast cancer diagnosis, 0 = unaffected, integer = age at diagnosis, AU = unknown age at diagnosis (affected unknown)
 *   OvCa: Age at ovarian cancer diagnosis, 0 = unaffected, integer = age at diagnosis, AU = unknown age at diagnosis (affected unknown)
 *   ProCa: Age at prostate cancer diagnosis 0 = unaffected, integer = age at diagnosis, AU = unknown age at diagnosis (affected unknown)
 *   PanCa: Age at pancreatic cancer diagnosis 0 = unaffected, integer = age at diagnosis, AU = unknown age at diagnosis (affected unknown)
 *   Gtest: Genetic test status, 0 = untested, S = mutation search, T = direct gene test
 *   Mutn: 0 = untested, N = no mutation, 1 = BRCA1 positive, 2 = BRCA2 positive, 3 = BRCA1 and BRCA2 positive
 *   Ashkn: 0 = not Ashkenazi, 1 = Ashkenazi
 *   ER: Estrogen receptor status, 0 = unspecified, N = negative, P = positive
 *   PR: Progestrogen receptor status, 0 = unspecified, N = negative, P = positive
 *   HER2: Human epidermal growth factor receptor 2 status, 0 = unspecified, N = negative, P = positive
 *   CK14: Cytokeratin 14 status, 0 = unspecified, N = negative, P = positive
 *   CK56: Cytokeratin 56 status, 0 = unspecified, N = negative, P = positive
 * ===============================================================================================
 */
PedigreeExport.exportAsBOADICEA = function(boadicea) {
  var output = '';
  
  output += 'BOADICEA import pedigree file format 2.0\n';
  output += 'FamID, NameTarget, IndivID, FathID, MothID, Sex, Twin, Dead, Age, Yob, 1BrCa, 2BrCa, OvCa, ProCa, PanCa, Gtest, Mutn, Ashkn, ER, PR, HER2, CK14, CK56';

  // todo: populate patients

  return output;
};

module.exports = PedigreeExport;
