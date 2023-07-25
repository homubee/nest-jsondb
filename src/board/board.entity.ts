import { Post } from "src/post/post.entity"

export class Board {
  id: number
  posts?: Post[]
  name: String
  createdAt: Date
}