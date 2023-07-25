import { PartialType, OmitType } from "@nestjs/swagger";
import { Board } from "src/board/board.entity";
import { Comment } from "src/comment/comment.entity";
import { Member } from "src/member/member.entity";

export class Post {
  id: number
  member_id: number
  member?: Member
  board_id: number
  board?: Board
  comments?: Comment[]
  title: String
  content: String
  createdAt: Date
}

export class PostSearch extends PartialType(OmitType(Post, ["id", "member_id", "member", "board_id", "board", "content", "comments"])) {}