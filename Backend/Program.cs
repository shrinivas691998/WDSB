using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using OfficeOpenXml;
using System.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure EPPlus to use non-commercial license
ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Add DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Removed HTTPS redirection
// app.UseHttpsRedirection();

app.UseCors("AllowAll");
app.UseAuthorization();

// Work Order endpoints
app.MapGet("/api/workorder", async (AppDbContext db) =>
    await db.WorkOrders.ToListAsync());

app.MapGet("/api/workorder/{workOrderNo}", async (string workOrderNo, AppDbContext db) =>
{
    var workOrder = await db.WorkOrders.FindAsync(workOrderNo);
    return workOrder is null ? Results.NotFound() : Results.Ok(workOrder);
});

app.MapPost("/api/workorder", async (AppDbContext db, WorkOrder workOrder) =>
{
    db.WorkOrders.Add(workOrder);
    await db.SaveChangesAsync();
    return Results.Created($"/api/workorder/{workOrder.WorkOrderNo}", workOrder);
});

app.MapPut("/api/workorder/{workOrderNo}", async (string workOrderNo, WorkOrder workOrder, AppDbContext db) =>
{
    var existingWorkOrder = await db.WorkOrders.FindAsync(workOrderNo);
    if (existingWorkOrder is null) return Results.NotFound();

    existingWorkOrder.MachineNo = workOrder.MachineNo;
    existingWorkOrder.OperatorName = workOrder.OperatorName;
    existingWorkOrder.OrderQty = workOrder.OrderQty;
    existingWorkOrder.CompletedQty = workOrder.CompletedQty;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/api/workorder/{workOrderNo}", async (string workOrderNo, AppDbContext db) =>
{
    var workOrder = await db.WorkOrders.FindAsync(workOrderNo);
    if (workOrder is null) return Results.NotFound();

    db.WorkOrders.Remove(workOrder);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Excel upload endpoint for Work Orders
app.MapPost("/api/workorder/upload", async (HttpContext context, AppDbContext db) =>
{
    try
    {
        var file = context.Request.Form.Files[0];
        using var stream = new MemoryStream();
        await file.CopyToAsync(stream);

        using var package = new ExcelPackage(stream);
        var worksheet = package.Workbook.Worksheets[0];
        var rowCount = worksheet.Dimension.Rows;

        var workOrders = new List<WorkOrder>();
        for (int row = 2; row <= rowCount; row++) // Skip header row
        {
            var workOrder = new WorkOrder
            {
                WorkOrderNo = worksheet.Cells[row, 1].Value?.ToString() ?? "",
                MachineNo = worksheet.Cells[row, 2].Value?.ToString() ?? "",
                OperatorName = worksheet.Cells[row, 3].Value?.ToString() ?? "",
                OrderQty = int.Parse(worksheet.Cells[row, 4].Value?.ToString() ?? "0"),
                CompletedQty = int.Parse(worksheet.Cells[row, 5].Value?.ToString() ?? "0")
            };
            workOrders.Add(workOrder);
        }

        await db.WorkOrders.AddRangeAsync(workOrders);
        await db.SaveChangesAsync();

        return Results.Ok(new { message = "File uploaded successfully", count = workOrders.Count });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { message = "Error processing file", error = ex.Message });
    }
});

// BOM endpoints
app.MapGet("/api/bom", async (AppDbContext db) =>
    await db.BOMs.ToListAsync());

app.MapGet("/api/bom/{parentPart}/{childPart}", async (string parentPart, string childPart, AppDbContext db) =>
{
    var bom = await db.BOMs.FindAsync(parentPart, childPart);
    return bom is null ? Results.NotFound() : Results.Ok(bom);
});

app.MapPost("/api/bom", async (AppDbContext db, BOM bom) =>
{
    db.BOMs.Add(bom);
    await db.SaveChangesAsync();
    return Results.Created($"/api/bom/{bom.ParentPart}/{bom.ChildPart}", bom);
});

app.MapPut("/api/bom/{parentPart}/{childPart}", async (string parentPart, string childPart, BOM bom, AppDbContext db) =>
{
    var existingBom = await db.BOMs.FindAsync(parentPart, childPart);
    if (existingBom is null) return Results.NotFound();

    existingBom.OpNo = bom.OpNo;
    existingBom.RequiredQuantity = bom.RequiredQuantity;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/api/bom/{parentPart}/{childPart}", async (string parentPart, string childPart, AppDbContext db) =>
{
    var bom = await db.BOMs.FindAsync(parentPart, childPart);
    if (bom is null) return Results.NotFound();

    db.BOMs.Remove(bom);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Excel upload endpoint for BOM
app.MapPost("/api/bom/upload", async (HttpContext context, AppDbContext db) =>
{
    try
    {
        var file = context.Request.Form.Files[0];
        using var stream = new MemoryStream();
        await file.CopyToAsync(stream);

        using var package = new ExcelPackage(stream);
        var worksheet = package.Workbook.Worksheets[0];
        var rowCount = worksheet.Dimension.Rows;

        var boms = new List<BOM>();
        for (int row = 2; row <= rowCount; row++) // Skip header row
        {
            var bom = new BOM
            {
                ParentPart = worksheet.Cells[row, 1].Value?.ToString() ?? "",
                ChildPart = worksheet.Cells[row, 2].Value?.ToString() ?? "",
                OpNo = int.Parse(worksheet.Cells[row, 3].Value?.ToString() ?? "0"),
                RequiredQuantity = decimal.Parse(worksheet.Cells[row, 4].Value?.ToString() ?? "0")
            };
            boms.Add(bom);
        }

        await db.BOMs.AddRangeAsync(boms);
        await db.SaveChangesAsync();

        return Results.Ok(new { message = "File uploaded successfully", count = boms.Count });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { message = "Error processing file", error = ex.Message });
    }
});

// Supply endpoints
app.MapGet("/api/supply", async (AppDbContext db) =>
    await db.Supplies.ToListAsync());

app.MapGet("/api/supply/{supplyNo}", async (string supplyNo, AppDbContext db) =>
{
    var supply = await db.Supplies.FindAsync(supplyNo);
    return supply is null ? Results.NotFound() : Results.Ok(supply);
});

app.MapPost("/api/supply", async (AppDbContext db, Supply supply) =>
{
    db.Supplies.Add(supply);
    await db.SaveChangesAsync();
    return Results.Created($"/api/supply/{supply.SupplyNo}", supply);
});

app.MapPut("/api/supply/{supplyNo}", async (string supplyNo, Supply supply, AppDbContext db) =>
{
    var existingSupply = await db.Supplies.FindAsync(supplyNo);
    if (existingSupply is null) return Results.NotFound();

    existingSupply.PartNo = supply.PartNo;
    existingSupply.SupplyDate = supply.SupplyDate;
    existingSupply.Quantity = supply.Quantity;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/api/supply/{supplyNo}", async (string supplyNo, AppDbContext db) =>
{
    var supply = await db.Supplies.FindAsync(supplyNo);
    if (supply is null) return Results.NotFound();

    db.Supplies.Remove(supply);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Excel upload endpoint for Supply
app.MapPost("/api/supply/upload", async (HttpContext context, AppDbContext db) =>
{
    try
    {
        var file = context.Request.Form.Files[0];
        using var stream = new MemoryStream();
        await file.CopyToAsync(stream);

        using var package = new ExcelPackage(stream);
        var worksheet = package.Workbook.Worksheets[0];
        var rowCount = worksheet.Dimension.Rows;

        var supplies = new List<Supply>();
        for (int row = 2; row <= rowCount; row++) // Skip header row
        {
            var supply = new Supply
            {
                SupplyNo = worksheet.Cells[row, 1].Value?.ToString() ?? "",
                PartNo = worksheet.Cells[row, 2].Value?.ToString() ?? "",
                SupplyDate = DateTime.Parse(worksheet.Cells[row, 3].Value?.ToString() ?? DateTime.Now.ToString()),
                Quantity = decimal.Parse(worksheet.Cells[row, 4].Value?.ToString() ?? "0")
            };
            supplies.Add(supply);
        }

        await db.Supplies.AddRangeAsync(supplies);
        await db.SaveChangesAsync();

        return Results.Ok(new { message = "File uploaded successfully", count = supplies.Count });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { message = "Error processing file", error = ex.Message });
    }
});

// Demand endpoints
app.MapGet("/api/demand", async (AppDbContext db) =>
    await db.Demands.ToListAsync());

app.MapGet("/api/demand/{demandNo}", async (string demandNo, AppDbContext db) =>
{
    var demand = await db.Demands.FindAsync(demandNo);
    return demand is null ? Results.NotFound() : Results.Ok(demand);
});

app.MapPost("/api/demand", async (AppDbContext db, Demand demand) =>
{
    db.Demands.Add(demand);
    await db.SaveChangesAsync();
    return Results.Created($"/api/demand/{demand.DemandNo}", demand);
});

app.MapPut("/api/demand/{demandNo}", async (string demandNo, Demand demand, AppDbContext db) =>
{
    var existingDemand = await db.Demands.FindAsync(demandNo);
    if (existingDemand is null) return Results.NotFound();

    existingDemand.PartNo = demand.PartNo;
    existingDemand.DemandDate = demand.DemandDate;
    existingDemand.Quantity = demand.Quantity;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/api/demand/{demandNo}", async (string demandNo, AppDbContext db) =>
{
    var demand = await db.Demands.FindAsync(demandNo);
    if (demand is null) return Results.NotFound();

    db.Demands.Remove(demand);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Excel upload endpoint for Demand
app.MapPost("/api/demand/upload", async (HttpContext context, AppDbContext db) =>
{
    try
    {
        var file = context.Request.Form.Files[0];
        using var stream = new MemoryStream();
        await file.CopyToAsync(stream);

        using var package = new ExcelPackage(stream);
        var worksheet = package.Workbook.Worksheets[0];
        var rowCount = worksheet.Dimension.Rows;

        var demands = new List<Demand>();
        for (int row = 2; row <= rowCount; row++) // Skip header row
        {
            var demand = new Demand
            {
                DemandNo = worksheet.Cells[row, 1].Value?.ToString() ?? "",
                PartNo = worksheet.Cells[row, 2].Value?.ToString() ?? "",
                DemandDate = DateTime.Parse(worksheet.Cells[row, 3].Value?.ToString() ?? DateTime.Now.ToString()),
                Quantity = decimal.Parse(worksheet.Cells[row, 4].Value?.ToString() ?? "0")
            };
            demands.Add(demand);
        }

        await db.Demands.AddRangeAsync(demands);
        await db.SaveChangesAsync();

        return Results.Ok(new { message = "File uploaded successfully", count = demands.Count });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { message = "Error processing file", error = ex.Message });
    }
});

// Test data generation endpoint
app.MapGet("/api/generate-test-files", async () =>
{
    try
    {
        var testDataPath = Path.Combine(Directory.GetCurrentDirectory(), "TestData");
        Directory.CreateDirectory(testDataPath);

        using (var package = new ExcelPackage())
        {
            // Demand Excel
            var demandSheet = package.Workbook.Worksheets.Add("Demand");
            demandSheet.Cells["A1"].Value = "Demand No.";
            demandSheet.Cells["B1"].Value = "Part No.";
            demandSheet.Cells["C1"].Value = "Demand Date";
            demandSheet.Cells["D1"].Value = "Quantity";

            var demandData = new[]
            {
                new { DemandNo = "D001", PartNo = "P100", DemandDate = "2024-02-20 10:00:00", Quantity = 100 },
                new { DemandNo = "D002", PartNo = "P101", DemandDate = "2024-02-21 11:00:00", Quantity = 150 },
                new { DemandNo = "D003", PartNo = "P102", DemandDate = "2024-02-22 12:00:00", Quantity = 200 },
                new { DemandNo = "D004", PartNo = "P103", DemandDate = "2024-02-23 13:00:00", Quantity = 250 },
                new { DemandNo = "D005", PartNo = "P104", DemandDate = "2024-02-24 14:00:00", Quantity = 300 }
            };

            for (int i = 0; i < demandData.Length; i++)
            {
                demandSheet.Cells[i + 2, 1].Value = demandData[i].DemandNo;
                demandSheet.Cells[i + 2, 2].Value = demandData[i].PartNo;
                demandSheet.Cells[i + 2, 3].Value = demandData[i].DemandDate;
                demandSheet.Cells[i + 2, 4].Value = demandData[i].Quantity;
            }

            await package.SaveAsAsync(Path.Combine(testDataPath, "Demand.xlsx"));
        }

        using (var package = new ExcelPackage())
        {
            // Supply Excel
            var supplySheet = package.Workbook.Worksheets.Add("Supply");
            supplySheet.Cells["A1"].Value = "Supply No.";
            supplySheet.Cells["B1"].Value = "Part No.";
            supplySheet.Cells["C1"].Value = "Supply Date";
            supplySheet.Cells["D1"].Value = "Quantity";

            var supplyData = new[]
            {
                new { SupplyNo = "S001", PartNo = "P100", SupplyDate = "2024-02-20 09:00:00", Quantity = 120 },
                new { SupplyNo = "S002", PartNo = "P101", SupplyDate = "2024-02-21 10:00:00", Quantity = 160 },
                new { SupplyNo = "S003", PartNo = "P102", SupplyDate = "2024-02-22 11:00:00", Quantity = 180 },
                new { SupplyNo = "S004", PartNo = "P103", SupplyDate = "2024-02-23 12:00:00", Quantity = 270 },
                new { SupplyNo = "S005", PartNo = "P104", SupplyDate = "2024-02-24 13:00:00", Quantity = 320 }
            };

            for (int i = 0; i < supplyData.Length; i++)
            {
                supplySheet.Cells[i + 2, 1].Value = supplyData[i].SupplyNo;
                supplySheet.Cells[i + 2, 2].Value = supplyData[i].PartNo;
                supplySheet.Cells[i + 2, 3].Value = supplyData[i].SupplyDate;
                supplySheet.Cells[i + 2, 4].Value = supplyData[i].Quantity;
            }

            await package.SaveAsAsync(Path.Combine(testDataPath, "Supply.xlsx"));
        }

        using (var package = new ExcelPackage())
        {
            // BOM Excel
            var bomSheet = package.Workbook.Worksheets.Add("BOM");
            bomSheet.Cells["A1"].Value = "Parent Part";
            bomSheet.Cells["B1"].Value = "Child Part";
            bomSheet.Cells["C1"].Value = "Operation No.";
            bomSheet.Cells["D1"].Value = "Required Quantity";

            var bomData = new[]
            {
                new { ParentPart = "P100", ChildPart = "C001", OpNo = 10, RequiredQuantity = 2 },
                new { ParentPart = "P100", ChildPart = "C002", OpNo = 20, RequiredQuantity = 3 },
                new { ParentPart = "P101", ChildPart = "C003", OpNo = 10, RequiredQuantity = 1 },
                new { ParentPart = "P102", ChildPart = "C001", OpNo = 10, RequiredQuantity = 4 },
                new { ParentPart = "P103", ChildPart = "C002", OpNo = 20, RequiredQuantity = 2 }
            };

            for (int i = 0; i < bomData.Length; i++)
            {
                bomSheet.Cells[i + 2, 1].Value = bomData[i].ParentPart;
                bomSheet.Cells[i + 2, 2].Value = bomData[i].ChildPart;
                bomSheet.Cells[i + 2, 3].Value = bomData[i].OpNo;
                bomSheet.Cells[i + 2, 4].Value = bomData[i].RequiredQuantity;
            }

            await package.SaveAsAsync(Path.Combine(testDataPath, "BOM.xlsx"));
        }

        using (var package = new ExcelPackage())
        {
            // Work Order Excel
            var workOrderSheet = package.Workbook.Worksheets.Add("WorkOrder");
            workOrderSheet.Cells["A1"].Value = "Work Order No.";
            workOrderSheet.Cells["B1"].Value = "Machine No.";
            workOrderSheet.Cells["C1"].Value = "Operator Name";
            workOrderSheet.Cells["D1"].Value = "Order Qty";
            workOrderSheet.Cells["E1"].Value = "Completed Qty";

            var workOrderData = new[]
            {
                new { WorkOrderNo = "WO001", MachineNo = "M001", OperatorName = "John Doe", OrderQty = 100, CompletedQty = 80 },
                new { WorkOrderNo = "WO002", MachineNo = "M002", OperatorName = "Jane Smith", OrderQty = 150, CompletedQty = 150 },
                new { WorkOrderNo = "WO003", MachineNo = "M003", OperatorName = "Bob Wilson", OrderQty = 200, CompletedQty = 220 },
                new { WorkOrderNo = "WO004", MachineNo = "M001", OperatorName = "Alice Brown", OrderQty = 300, CompletedQty = 280 },
                new { WorkOrderNo = "WO005", MachineNo = "M002", OperatorName = "Charlie Davis", OrderQty = 250, CompletedQty = 260 }
            };

            for (int i = 0; i < workOrderData.Length; i++)
            {
                workOrderSheet.Cells[i + 2, 1].Value = workOrderData[i].WorkOrderNo;
                workOrderSheet.Cells[i + 2, 2].Value = workOrderData[i].MachineNo;
                workOrderSheet.Cells[i + 2, 3].Value = workOrderData[i].OperatorName;
                workOrderSheet.Cells[i + 2, 4].Value = workOrderData[i].OrderQty;
                workOrderSheet.Cells[i + 2, 5].Value = workOrderData[i].CompletedQty;
            }

            await package.SaveAsAsync(Path.Combine(testDataPath, "WorkOrder.xlsx"));
        }

        return Results.Ok(new { message = "Test Excel files generated successfully in TestData folder" });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = ex.Message });
    }
});

app.MapControllers();

app.Run(); 