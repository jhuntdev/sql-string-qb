# SQL String QB🏈

## "A simple JavaScript/TypeScript library for assembling complex SQL queries. Miniscule, type-safe, and dependency-free.

Inspired by classNames and several SQL tagged template string libraries, this small but powerful SQL query builder allows you to elegantly craft complex SQL statements without compromising code readability or performance. Its output is an `SqlString` object which drops right into popular SQL database clients. The ``qb.t`...` `` function automatically breaks out values from template literals and can be unsed standalone or as an argument in `qb()`.

_WARNING: Exercise the same safety precautions you normally would when writing SQL. Variables outside of the `qb.t` function will go directly into the query and should be escaped first._

## Installation

Install SQL String QB🏈 from npm

With npm:
```bash
npm install --save sql-string-qb
```
or using yarn:
```bash
yarn add sql-string-qb
```

## Usage

```javascript
import qb from 'sql-string-qb' 

const showPrice = false
const category = 'sporting-goods'
const sortColumn = undefined
const sortOrder = undefined

const query = qb(
    'SELECT id, name',
    showPrice && ', price',
    'FROM products WHERE',
    category ? qb.t`category = ${category}` : 'category IS NULL',
    'ORDER BY',
    sortColumn || 'createdAt',
    sortOrder || 'DESC',
    'LIMIT 12'
)

typeof query     // => 'object'
query.toString() // => 'SELECT id, name FROM products WHERE category = ? ORDER BY createdAt DESC LIMIT 12'
query.sql        // => 'SELECT id, name FROM products WHERE category = ? ORDER BY createdAt DESC LIMIT 12'
query.text       // => 'SELECT id, name FROM products WHERE category = $1 ORDER BY createdAt DESC LIMIT 12'
query.statement  // => 'SELECT id, name FROM products WHERE category = :1 ORDER BY createdAt DESC LIMIT 12'
query.values     // => ['sporting-goods']

pg.query(query) // Uses query.text and query.values
mysql.query(query) // Uses query.sql and query.values
mysql2.query(query) // Uses query.sql and query.values
sequelize.query(query) // Uses query.query and query.values
oracledb.execute(query) // Uses query.statement and query.values
```

## License

This project is licensed under the [MIT License](LICENSE).