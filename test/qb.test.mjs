import assert from 'assert'
import qb from '../dist/index.js'

describe('qb', () => {
    it('should actually work', async () => {
        const id = 'abc123'
        const [sql, params] = qb(
            'SELECT * FROM tableName WHERE',
            false,
            null,
            undefined,
            qb.t`primaryKey = ${id}`,
            'AND columnName IS NOT NULL',
            'LIMIT 1'
        )
        assert.strictEqual(sql, 'SELECT * FROM tableName WHERE primaryKey = ? AND columnName IS NOT NULL LIMIT 1')
        assert.strictEqual(params.length, 1)
        assert.strictEqual(params[0], 'abc123')
    })
})