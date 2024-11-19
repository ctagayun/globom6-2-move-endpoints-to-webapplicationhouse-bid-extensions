public class BidEntity
{
    public int Id { get; set; }
    public int HouseId { get; set; }  //*Forign key  to HouseEntity
    public HouseEntity? House { get; set; } //*Navigation property
    public string Bidder { get; set; } = string.Empty;
    public int Amount { get; set; }
}