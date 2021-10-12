## GA4GH Pedigree Tool Suite


### Import formats

✓ GA4GH Pedigree
✓ PED/LINKAGE
✓ GEDCOM (Cyrillic)
✓ BOADICEA

### Export formats

✓ GA4GH Pedigree
✓ PED/LINKAGE

### Getting started

1. Install the tool
```
git clone git@github.com:GA4GH-Pedigree-Standard/pedigree-tools.git
cd nodejs/
npm install -g
cd ..
```

You can now use the `pedigree-tools` cli, for example:


2. Convert a pedigree into GA4GH pedigree format from another format
```
pedigree-tools import --from ped --file examples/simple.ped > test.json
```

3. Convert a pedigree from GA4GH pedigree format to another format
```
pedigree-tools export --to ped --file test.json > test.ped
```

It also supports streaming so the round-trip can be done in one line:

cat examples/simple.ped | pedigree-tools import --from ped --file - | pedigree-tools export --to ped --file -