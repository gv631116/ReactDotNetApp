# 1. Base Image (Linux)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# 2. Build Image (Includes .NET SDK + Node.js)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
# Install Node.js (Standard Linux command)
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y libpng-dev libjpeg-dev curl libxi6 build-essential libgl1-mesa-glx
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

WORKDIR /src
COPY ["ReactDotNetApp.Server/ReactDotNetApp.Server.csproj", "ReactDotNetApp.Server/"]
COPY ["reactdotnetapp.client/reactdotnetapp.client.esproj", "reactdotnetapp.client/"]
RUN dotnet restore "./ReactDotNetApp.Server/ReactDotNetApp.Server.csproj"
COPY . .
WORKDIR "/src/ReactDotNetApp.Server"
RUN dotnet build "./ReactDotNetApp.Server.csproj" -c Release -o /app/build

# 3. Publish
FROM build AS publish
RUN dotnet publish "./ReactDotNetApp.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 4. Final Image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ReactDotNetApp.Server.dll"]