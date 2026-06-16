CREATE PROCEDURE USP_SearchLookup
(
    @TableName VARCHAR(50),
    @ColumnName VARCHAR(50),
    @SearchValue VARCHAR(100)
)
AS
BEGIN

    DECLARE @SQL NVARCHAR(MAX);

    SET @SQL =
    '
    SELECT TOP 100 *
    FROM ' + @TableName + '
    WHERE ' + @ColumnName + ' LIKE ''%' + @SearchValue + '%''
    ORDER BY InwardNo DESC
    ';

    EXEC(@SQL);

END