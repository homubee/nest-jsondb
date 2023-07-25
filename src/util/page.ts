import { ApiProperty } from "@nestjs/swagger"

export class Page<T> {
  @ApiProperty()
  totalCnt: number

  @ApiProperty()
  totalPages: number

  @ApiProperty()
  pageSize: number

  @ApiProperty()
  content: T[]
}

export class Pageable {
  @ApiProperty()
  page: number

  @ApiProperty()
  size: number
}