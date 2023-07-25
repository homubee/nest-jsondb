import { ApiProperty, PartialType, OmitType } from "@nestjs/swagger";

export class PostCreateRequestDTO {
  @ApiProperty()
  member_id: number

  @ApiProperty()
  board_id: number

  @ApiProperty()
  title: String

  @ApiProperty()
  content: String
}

export class PostUpdateRequestDTO extends PartialType(OmitType(PostCreateRequestDTO, ['board_id', 'member_id'])) {}