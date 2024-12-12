import assert from 'assert'
import qb from '../dist/index.js'

const id = 'abc123'
const sqlString = qb(
    'SELECT * FROM tableName WHERE',
    false,
    null,
    undefined,
    qb.t`primaryKey = ${id}`,
    'AND columnName IS NOT NULL',
    'LIMIT 1'
)

const sqlString2 = qb(
    'INSERT INTO tableName',
    qb.values([{ name: 'John', age: 25 }, { name: 'Mary', age: 40 }])
)

const sqlString3 = qb(
    'SELECT FROM tableName WHERE status',
    qb.in(['archived', 'draft']),
    qb.t`AND isHidden = ${false}`
)

const sqlString4 = qb(
    'UPDATE tableName',
    qb.set({ status: 'active', published: true }),
    qb.t`WHERE id = ${id}`
)

describe('SqlStringQB', () => {
    it('should work for general use', async () => {
        assert.strictEqual(sqlString.toString(), 'SELECT * FROM tableName WHERE primaryKey = ? AND columnName IS NOT NULL LIMIT 1')
        assert.strictEqual(sqlString.values.length, 1)
        assert.strictEqual(sqlString.values[0], 'abc123')
        const array = [...sqlString]
        assert.strictEqual(array[0], 'SELECT * FROM tableName WHERE primaryKey = ? AND columnName IS NOT NULL LIMIT 1')
        assert.strictEqual(array[1].length, 1)
        assert.strictEqual(array[1][0], 'abc123')
    })
    it('should work for Sequelize', async () => {
        assert.strictEqual(sqlString.query, 'SELECT * FROM tableName WHERE primaryKey = ? AND columnName IS NOT NULL LIMIT 1')
    })
    it('should work for MySQL/MySQL2', async () => {
        assert.strictEqual(sqlString.sql, 'SELECT * FROM tableName WHERE primaryKey = ? AND columnName IS NOT NULL LIMIT 1')
    })
    it('should work for Oracle', async () => {
        assert.strictEqual(sqlString.statement, 'SELECT * FROM tableName WHERE primaryKey = :1 AND columnName IS NOT NULL LIMIT 1')
    })
    it('should work for Postgres', async () => {
        assert.strictEqual(sqlString.text, 'SELECT * FROM tableName WHERE primaryKey = $1 AND columnName IS NOT NULL LIMIT 1')
    })
    it('should produce valid VALUES clauses', async () => {
        assert.strictEqual(sqlString2.toString(), 'INSERT INTO tableName (name, age) VALUES (?, ?), (?, ?)')
        assert.strictEqual(sqlString2.values.length, 4)
        assert.strictEqual(sqlString2.values[0], 'John')
        assert.strictEqual(sqlString2.values[1], 25)
        assert.strictEqual(sqlString2.values[2], 'Mary')
        assert.strictEqual(sqlString2.values[3], 40)

    })
    it('should produce valid IN clauses', async () => {
        assert.strictEqual(sqlString3.toString(), 'SELECT FROM tableName WHERE status IN (?, ?) AND isHidden = ?')
        assert.strictEqual(sqlString3.values.length, 3)
        assert.strictEqual(sqlString3.values[0], 'archived')
        assert.strictEqual(sqlString3.values[1], 'draft')
        assert.strictEqual(sqlString3.values[2], false)
    })
    it('should produce valid SET clauses', async () => {
        assert.strictEqual(sqlString4.toString(), 'UPDATE tableName SET status = ?, published = ? WHERE id = ?')
        assert.strictEqual(sqlString4.values.length, 3)
        assert.strictEqual(sqlString4.values[0], 'active')
        assert.strictEqual(sqlString4.values[1], true)
        assert.strictEqual(sqlString4.values[2], 'abc123')
    })
})