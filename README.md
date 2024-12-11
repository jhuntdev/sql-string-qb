# SQLQB🏈

## A simple tool for assembling complex SQL queries. Miniscule, type-safe, and dependency-free.

Inspired by classNames and Drizzle, this small but powerful library allows you to elegantly craft complex SQL statements without compromising readability or performance. The `qb.t` tagged template function allows you to use template literals to automatically break out variables for escaping, prepared statements, etc.

_WARNING: Exercise the same safety precautions you normally would when writing SQL._

## Installation

Install SQLQB🏈 from npm

With npm:
```bash
npm install --save sqlqb
```
or using yarn:
```bash
yarn add sqlqb
```

## Usage

```javascript
import qb from 'sqlqb' 

// Basic
const [sql] = qb(
    'SELECT id, name',
    showPrice && ', price'
    'FROM products WHERE',
    category ? 'category = ' + category : 'category IS NULL',
    'ORDER BY ',
    sortColumn || 'createdAt',
    sortOrder || 'DESC',
    'LIMIT ' + (limit || 12)
)
// Output: ["SELECT id, name FROM products WHERE category IS NULL ORDER BY createdAt DESC LIMIT 12"]

// Advanced
const productId = 'abc123'
const [sql, params] = qb(
    'SELECT id, name, price FROM products WHERE',
    qb.t`id = ${productId}`,
    'AND isHidden = FALSE',
    'LIMIT 1'
)
// Output: ["SELECT id, name, price FROM products WHERE id = ? AND isHidden = FALSE LIMIT 1", ["abc123"]]
```

## License

This project is licensed under the [MIT License](LICENSE).