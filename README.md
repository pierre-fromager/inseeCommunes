# inseeCommunes

## Generality

### Description

**inseeCommunes is nodeJs project using aggregation with Mongodb**

This illustrates how easy is dealing with mongo's datas.
Post import, a insee database will be created with a communes collections.
All datas are there.

### Purposes

* Various studies for french territories.
* Localization and maps drawings.
* Risk prevention based on altitude.
* Population evaluation per area.
* Up to you to suggest more...

### Limitations

INSEE (Our data provider) is so involved into opendata, we cant get relevant datas after year 2013.
If anyone has some update, pls let me know.

### For the sake

This not optimized for performance but for flexibility.
Keep in mind you can make better looking and faster but I propose a basement you can build on.
Just a single 80 lines of source code you can improve and play with.

## Technical part

### Requirement

* node >= v8.15.0
* npm >= 6.4.1

### Config and Credentials

Edit login,password,host...

```bash
vim fixtures/bash/mongoimport.sh
```

```bash
vim src/lib/Config.js
```

and change it according to your db credentials.

### Setup

* install dependencies.

```bash
npm i
```

* import datas fixtures into a INSEE db with commune collection.

```bash
npm run import
```

### Start

```bash
npm run start
```

### Linter

```bash
npm run lint
```