public class LookupSearchDTO
{
    public string TableName
    {
        get;
        set;
    }

    public Dictionary<string, string>
        Filters
    {
        get;
        set;
    }
}