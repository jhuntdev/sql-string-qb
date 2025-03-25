const assert = require('assert')
const qb = require('../dist/index.cjs')

const id = 'abc123'
const sqlString = qb(
    'SELECT * FROM `tableName` WHERE',
    false,
    null,
    undefined,
    qb.t`\`primaryKey\` = ${id}`,
    'AND `columnName` IS NOT NULL',
    'LIMIT 1'
)

describe('SqlStringQB', () => {
    it('should work with CommonJS', async () => {
        assert.strictEqual(sqlString.toString(), 'SELECT * FROM `tableName` WHERE `primaryKey` = ? AND `columnName` IS NOT NULL LIMIT 1;')
        assert.strictEqual(sqlString.values.length, 1)
        assert.strictEqual(sqlString.values[0], 'abc123')
        const array = [...sqlString]
        assert.strictEqual(array[0], 'SELECT * FROM `tableName` WHERE `primaryKey` = ? AND `columnName` IS NOT NULL LIMIT 1;')
        assert.strictEqual(array[1].length, 1)
        assert.strictEqual(array[1][0], 'abc123')
    })
})