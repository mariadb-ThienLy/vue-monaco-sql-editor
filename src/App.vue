<template>
    <div id="app">
        <h1 class="title">Editor view using monaco editor</h1>
        <MonacoEditor class="editor" v-model="value" language="mysql" :dist="distArr" />
        <p>Query to be sent via API</p>
        <code>
            <pre>{{ value }}</pre>
        </code>
    </div>
</template>

<script>
import MonacoEditor from './components/MonacoEditor'

export default {
    name: 'App',
    components: {
        MonacoEditor,
    },
    data() {
        return {
            value: `CREATE TABLE dbo.EmployeePhoto\n(\n    EmployeeId INT NOT NULL PRIMARY KEY,\n    Photo VARBINARY(MAX) FILESTREAM NULL,\n    MyRowGuidColumn UNIQUEIDENTIFIER NOT NULL ROWGUIDCOL\n                    UNIQUE DEFAULT NEWID()\n);\n\nGO\n\n/*\ntext_of_comment\n/* nested comment */\n*/\n\n-- line comment\n\nCREATE NONCLUSTERED INDEX IX_WorkOrder_ProductID\n    ON Production.WorkOrder(ProductID)\n    WITH (FILLFACTOR = 80,\n        PAD_INDEX = ON,\n        DROP_EXISTING = ON);\nGO\n\nWHILE (SELECT AVG(ListPrice) FROM Production.Product) < $300\nBEGIN\n   UPDATE Production.Product\n      SET ListPrice = ListPrice * 2\n   SELECT MAX(ListPrice) FROM Production.Product\n   IF (SELECT MAX(ListPrice) FROM Production.Product) > $500\n      BREAK\n   ELSE\n      CONTINUE\nEND\nPRINT 'Too much for the market to bear';\n\nMERGE INTO Sales.SalesReason AS [Target]\nUSING (VALUES ('Recommendation','Other'), ('Review', 'Marketing'), ('Internet', 'Promotion'))\n       AS [Source] ([NewName], NewReasonType)\nON [Target].[Name] = [Source].[NewName]\nWHEN MATCHED\nTHEN UPDATE SET ReasonType = [Source].NewReasonType\nWHEN NOT MATCHED BY TARGET\nTHEN INSERT ([Name], ReasonType) VALUES ([NewName], NewReasonType)\nOUTPUT $action INTO @SummaryOfChanges;\n\nSELECT ProductID, OrderQty, SUM(LineTotal) AS Total\nFROM Sales.SalesOrderDetail\nWHERE UnitPrice < $5.00\nGROUP BY ProductID, OrderQty\nORDER BY ProductID, OrderQty\nOPTION (HASH GROUP, FAST 10);\n`,
        }
    },
    computed: {
        distArr: function () {
            //TODO: create a list of mariadb sql reserved keywords for auto completion feature
            const dist = {
                table1: ['col_A', 'col_B', 'col_C'],
                table2: ['other_columns1', 'other_columns2'],
            }
            let result = []
            const tableNames = Object.keys(dist)
            for (const name of tableNames) {
                result.push({
                    label: name,
                    detail: 'TABLE',
                    insertText: name,
                    type: 'table',
                })
                let cols = []
                for (const col of dist[name]) {
                    cols.push({
                        label: col,
                        insertText: col,
                        detail: 'COLUMN',
                        type: 'column',
                    })
                }
                result = [...result, ...cols]
            }
            return result
        },
    },
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 60px;
}
.title {
    text-align: center;
}
.editor {
    width: 1200px;
    height: 600px;
}
</style>
