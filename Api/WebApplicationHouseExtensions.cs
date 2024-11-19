using Microsoft.AspNetCore.Mvc;
using MiniValidation;
//*Create a static class to contain house related endpoints
public static class WebApplicationHouseExtensions 
{
  //*In it we define an extension method for the WebApplication type.
  //*the variable is "app" we have neen using all along in Program.cs is of that type.
  //*Copy MapGet, MapPost, MapPut, MapDelete from program.cs
  public static void MapHouseEndpoints(this WebApplication app)
  {
    
         //*Now we will access the HouseDBContext. The DI container 
//*will provide an instance for me. We use the Interface instead of the 
//concrete HouseRepository because our repo will not be dependent 
//on a specific database. No need to "await the task". That will be 
//handled by the framework
app.MapGet("/houses", (IHouseRepository repo) => repo.GetAll())
          .Produces<HouseDto[]>(StatusCodes.Status200OK);
                      //*this means access the Houses property
                      //*of the HouseDbContext which contains a collection 
                      //*HousesEntity. It will be automatically serialized to JSON

//*This means use only this EP when the second ppart of the EP is an integer.
//*now in the lambda we can determine that houseID is the FIRST parameter. ASP.Netcore
//*is smart enough to see that: {houseId:int} == int houseId.
//*The second parameter is IHouseRepository coming from the DEPENDENCY INJECTOR CONTAINER
app.MapGet("/house/{houseId:int}", async(int houseId,IHouseRepository repo) =>
   {
     var house = await repo.Get(houseId); //*now get the house
     if (house == null)
       //*to determine the problem the standard way of doing this is to use the "Results"
       //*object to determine the problem
       return Results.Problem($"House with ID {houseId} not found.",
              statusCode: 404);

     //*Use the result object to determine to the status code to return.
     return Results.Ok(house);
     //*This is the metadata forSwagger has to be added again so that it knows 
     //*EP producess a 404 and 200OK
   }).ProducesProblem(404).Produces<HouseDetailDto>(StatusCodes.Status200OK);

  //*Add house
  //*Tell the api to look for the dto in the body. this is the first parameter,
  //*second parameter is the IHouseRepository
  app.MapPost("/houses", async([FromBody] HouseDetailDto dto, IHouseRepository repo) =>
   {
    //*the type of "out var errors" is dictionary of string array. 
    //*the key will be the name of the property with a validation error
     if( !MiniValidator.TryValidate(dto, out var errors)) 
       //*If there are any problem dictionary of "errors" is returned
       return Results.ValidationProblem(errors);

     var newHouse = await repo.Add(dto); //*now get the house

     //*Use the result object to determine to the status code to return.
     //*The first param by REST convention we return the URL and ID where the newly 
     //*created house can be found. The second param is the house as it was added to the 
     //*database
     return Results.Created($"/houses/{newHouse.Id}", newHouse);
     //*This is the metadata forSwagger has to be added again so that it knows 
     //*EP produces a 404 and ProducesValidationProblem()
   }).ProducesProblem(404).Produces<HouseDetailDto>(StatusCodes.Status200OK)
     .ProducesValidationProblem();                               

  //*Update house
  //*Tell the api to look for the dto in the body. this is the first parameter,
  //*second parameter is the IHouseRepository
  app.MapPut("/houses", async([FromBody] HouseDetailDto dto, IHouseRepository repo) =>
   {
     if( !MiniValidator.TryValidate(dto, out var errors)) 
       //*If there are any problem dictionary of "errors" is returned
       return Results.ValidationProblem(errors);

     //*We need to make sure that the house in the request body actually exist 
     if(await repo.Get(dto.Id) == null) 
       return Results.Problem($"House with ID {dto.Id} not found.",
              statusCode: 404);

     var updatedHouse = await repo.Update(dto); //*now update the house
    
     return Results.Ok(updatedHouse);

     //*This is the metadata forSwagger has to be added again so that it knows 
     //*EP producess a 201
   }).ProducesValidationProblem().ProducesProblem(404).Produces<HouseDetailDto>(StatusCodes.Status200OK);        

    //* Delete House
    app.MapDelete("/houses/{houseId:int}", async(int houseId, IHouseRepository repo) =>
   {
     if(await repo.Get(houseId) == null) 
       return Results.Problem($"House with ID {houseId} not found.",
              statusCode: 404);

     //*Note no date to return
     await repo.Delete(houseId); //*now delete the house
    
     return Results.Ok();

     //*This is the metadata forSwagger has to be added again so that it knows 
     //*EP producess a 201
   }).ProducesProblem(404).Produces<HouseDetailDto>(StatusCodes.Status200OK);   


  }
}