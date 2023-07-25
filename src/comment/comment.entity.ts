import { Member } from "src/member/member.entity"
import { Post } from "src/post/post.entity"

export class Comment {
  id: number
  member_id: number
  member?: Member
  post_id: number
  post?: Post
  comment_id?: number
  comments?: Comment[]
  depth: number
  content: String
  createdAt: Date
}