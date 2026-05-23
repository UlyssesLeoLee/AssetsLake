/*
```cypher
CREATE
  (f:File {name: "006_asset_code_storage_category.sql", type: "file", language: "sql"}),
  (m:Module {name: "asset_code_storage_category_schema", type: "module"}),
  (v1:Variable {name: "asset_type.code", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:USES]->(v1);
```
*/

-- AssetsLake Code Asset Storage Category
-- Adds source-code and config-as-code files as a first-class data lake asset type.

ALTER TYPE asset_type ADD VALUE IF NOT EXISTS 'code';
