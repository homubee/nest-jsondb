import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { Post } from "src/post/post.entity";

export class Member {
  id: number;
  posts: Post[];
  @ApiProperty()
  email: String;
  password: String;
  createdAt: Date;
}

export class MemberSearch extends PartialType(OmitType(Member, ["id", "password"])) {}
