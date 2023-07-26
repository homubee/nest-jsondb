import { ApiProperty, PartialType, OmitType } from "@nestjs/swagger";
import { PostSearch } from "src/post/post.entity";
import { Pageable } from "src/util/page";
import { SortType } from "src/util/sort";

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

export class PostRequestQueryDTO {
  @ApiProperty()
  search?: PostSearch

  @ApiProperty()
  sort?: SortType

  @ApiProperty()
  pageable: Pageable
}