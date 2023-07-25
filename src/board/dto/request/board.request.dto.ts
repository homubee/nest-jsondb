import { ApiProperty } from "@nestjs/swagger";

export class BoardRequestDTO {
  @ApiProperty()
  name: String
}