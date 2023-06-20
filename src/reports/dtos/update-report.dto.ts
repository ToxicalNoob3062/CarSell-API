import { IsLatitude, IsLongitude, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class UpdateReportDto {
    @IsOptional()
    @IsString()
    make: string;
    @IsOptional()
    @IsString()
    model: string;
    @IsOptional()
    @IsNumber()
    @Min(1930)
    @Max(2050)
    year: number;
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number;
    @IsOptional()
    @IsLongitude()
    lng: number;
    @IsOptional()
    @IsLatitude()
    lat: number;
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(1000000)
    price: number;
}