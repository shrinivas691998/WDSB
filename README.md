# Work Order Management System

This project is a Work Order Management System that consists of a backend built with ASP.NET Core and a frontend built with React and TypeScript. Below are the instructions to set up and run both parts of the application.

## Prerequisites

Before you begin, ensure you have the following installed:

- [.NET SDK](https://dotnet.microsoft.com/download) (version 7.0 or higher)
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or any compatible database)

## Backend Setup

1. **Navigate to the Backend Directory:**
   ```bash
   cd Backend
   ```

2. **Restore NuGet Packages:**
   ```bash
   dotnet restore
   ```

3. **Update the Database Connection String:**
   Open `appsettings.json` and ensure the `DefaultConnection` string points to your SQL Server instance:
   ```json
   "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=WorkOrderDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
   }
   ```

4. **Run Migrations:**
   To create the database schema, run the following command:
   ```bash
   dotnet ef database update
   ```

5. **Start the Backend Server:**
   ```bash
   dotnet run
   ```

   The backend server should now be running at `http://localhost:5069`.

## Frontend Setup

1. **Navigate to the Frontend Directory:**
   ```bash
   cd frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Update Environment Variables:**
   Open the `.env` file and ensure the database connection details are correct:
   ```env
   DB_USER=root
   DB_PASSWORD=Order@12345
   DB_SERVER=http://localhost:3306
   DB_NAME=WorkOrderDB
   PORT=3000
   ```

4. **Start the Frontend Development Server:**
   ```bash
   npm run dev
   ```

   The frontend application should now be running at `http://localhost:3000`.

## Accessing the Application

- Open your web browser and navigate to `http://localhost:3000` to access the Work Order Management System.

## Additional Notes

- Ensure that your SQL Server is running and accessible.
- If you encounter any issues, check the console output for errors and ensure all dependencies are correctly installed.
- You can modify the backend and frontend code as needed to fit your requirements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
