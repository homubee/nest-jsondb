import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class Page<T> {
  @ApiProperty()
  totalCnt: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  content: T[];
}

export class Pageable {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  page: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  size: number;
}
