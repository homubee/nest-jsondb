import { Injectable } from "@nestjs/common";
import { JsonDBService } from "src/util/jsondb.service";
import { Board } from "./board.entity";
import { BoardRequestDTO } from "./dto/request/board.request.dto";
import { OrderType } from "src/util/order";
import { PostService } from "src/post/post.service";
import { Post } from "src/post/post.entity";

@Injectable()
export class BoardService {
  constructor(private jsonDBService: JsonDBService, private postService: PostService) {}

  async getBoard(id: number): Promise<Board> {
    const boards: Board[] = await this.jsonDBService.getTable("board");
    const posts: Post[] = await this.jsonDBService.getTable("post");

    let result: Board = await this.jsonDBService.findById(boards, id);
    result.posts = await this.jsonDBService.findRelatedObjects(posts, "board_id", result.id);
    return result;
  }

  async getBoards(): Promise<Board[]> {
    const boards: Board[] = await this.jsonDBService.getTable("board");
    let result: Board[] = boards;
    result = await this.jsonDBService.sortItem(result, "createdAt", OrderType.DESC);
    return result;
  }

  async createBoard(requestDTO: BoardRequestDTO) {
    const boards: Board[] = await this.jsonDBService.getTable("board");
    this.jsonDBService.createItem("board", boards, requestDTO);
  }

  async updateBoard(id: number, requestDTO: BoardRequestDTO) {
    const boards: Board[] = await this.jsonDBService.getTable("board");
    this.jsonDBService.updateItem("board", boards, id, requestDTO);
  }

  async deleteBoard(id: number) {
    const boards: Board[] = await this.jsonDBService.getTable("board");
    const posts: Post[] = await this.jsonDBService.getTable("post");

    let result: Board = await this.jsonDBService.findById(boards, id);
    result.posts = await this.jsonDBService.findRelatedObjects(posts, "board_id", result.id);
    for (var elem of result.posts) {
      await this.postService.deletePost(elem.id);
    }
    this.jsonDBService.deleteItem("board", boards, id);
  }
}
