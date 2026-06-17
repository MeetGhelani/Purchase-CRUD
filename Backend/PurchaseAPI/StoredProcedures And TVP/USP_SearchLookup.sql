CREATE PROCEDURE USP_SearchLookup
(
    @TableName VARCHAR(100),
    @WhereClause NVARCHAR(MAX),
    @OrderColumn VARCHAR(100)
)
AS
BEGIN

    SET NOCOUNT ON;

    DECLARE @SQL NVARCHAR(MAX);

    SET @SQL =
    '
    SELECT TOP 100 *
    FROM ' + @TableName + '
    WHERE 1 = 1
    ' + @WhereClause + '
    ORDER BY ' + @OrderColumn + ' DESC';

    EXEC(@SQL);

END