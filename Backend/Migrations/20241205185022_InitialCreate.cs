using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace New_folder_2.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BOMs",
                columns: table => new
                {
                    ParentPart = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ChildPart = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    OpNo = table.Column<int>(type: "int", nullable: false),
                    RequiredQuantity = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BOMs", x => new { x.ParentPart, x.ChildPart });
                });

            migrationBuilder.CreateTable(
                name: "Demands",
                columns: table => new
                {
                    DemandNo = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PartNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DemandDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Demands", x => x.DemandNo);
                });

            migrationBuilder.CreateTable(
                name: "Supplies",
                columns: table => new
                {
                    SupplyNo = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PartNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SupplyDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Supplies", x => x.SupplyNo);
                });

            migrationBuilder.CreateTable(
                name: "WorkOrders",
                columns: table => new
                {
                    WorkOrderNo = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MachineNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OperatorName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OrderQty = table.Column<int>(type: "int", nullable: false),
                    CompletedQty = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkOrders", x => x.WorkOrderNo);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BOMs");

            migrationBuilder.DropTable(
                name: "Demands");

            migrationBuilder.DropTable(
                name: "Supplies");

            migrationBuilder.DropTable(
                name: "WorkOrders");
        }
    }
}
