import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";

export class CommentCreateRequestDTO {
  @ApiProperty()
  member_id: number;

  @ApiProperty()
  post_id: number;

  @ApiProperty()
  parent_comment_id: number;

  @ApiProperty()
  content: String;
}

export class CommentUpdateRequestDTO extends PartialType(
  OmitType(CommentCreateRequestDTO, ["member_id", "post_id", "parent_comment_id"])
) {}
