using Microsoft.EntityFrameworkCore;

public interface IBidRepository
{
    Task<List<BidDto>> Get(int houseId);
    Task<BidDto> Add(BidDto bid);
}

public class BidRepository: IBidRepository
{
    private readonly HouseDbContext context;

    public BidRepository(HouseDbContext context)
    {
        this.context = context;
    }

    //*
    public async Task<List<BidDto>> Get(int houseId)
    {
        //*we use a LINQ Where "Method" syntax using Lambda
        return await context.Bids.Where(b => b.HouseId == houseId) //*where the Bids.HouseId = houseId param
            //*after the Where we project the Bid entities into DTOs and convert result into a List
            .Select(b => new BidDto(b.Id, b.HouseId, b.Bidder, b.Amount))
            .ToListAsync(); 
    }

    //* The add method returns a BidDto and accept one too (dto to be added to database)
    public async Task<BidDto> Add(BidDto dto)
    {
        var entity = new BidEntity(); 
        entity.HouseId = dto.HouseId;
        entity.Bidder = dto.Bidder;
        entity.Amount = dto.Amount;
        context.Bids.Add(entity); //*Then entity is added to dbSet in-memort
        await context.SaveChangesAsync(); //*Then commit the new bud entity

        //*Finally a new BidDto is returned reflecting the values as they 
        //*were added to the database
        return new BidDto(entity.Id, entity.HouseId, 
            entity.Bidder, entity.Amount);
    }
}