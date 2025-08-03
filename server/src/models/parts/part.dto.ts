import { IsString, IsInt, Min, IsDate, IsOptional, IsBoolean, MaxLength, IsNotEmpty, MinLength, ValidateIf, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import 'reflect-metadata';

class NotInFuture {
  validate(date: Date) {
    if (!date) return true;
    return date.getTime() <= Date.now();
  }
  defaultMessage() {
    return 'Last stock check date cannot be in the future';
  }
}

class CreatePartDto {
    @IsString({ message: 'Part number is required'})
    @IsNotEmpty({ message: 'Part number is required' })
    partNumber: string;

    @IsString({ message: 'Description is required'})
    @IsNotEmpty({ message: 'Description is required' })
    @MaxLength(200, { message: 'Description must be at most 200 characters long' })
    description: string;

    @IsInt({ message: 'Quantity on hand must be an integer'})
    @IsNotEmpty({ message: 'Quantity on hand is required' })
    @Min(0, { message: 'Quantity on hand must be at least 0'})
    quantityOnHand: number;

    @IsString({ message: 'Location code must be a string'})
    @IsNotEmpty({ message: 'Location code is required' })
    locationCode: string;

    @Type(() => Date)
    @IsOptional()
    @ValidateIf(o => o.lastStockCheckDate !== null)
    @IsDate({ message: 'Last stock check date must be a valid date'})
    @Validate(NotInFuture)
    lastStockCheckDate: Date | null;

    @IsBoolean()
    @IsOptional()
    isDeleted: boolean;
}

export default CreatePartDto;