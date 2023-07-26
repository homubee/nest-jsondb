import { Injectable } from '@nestjs/common';
import { JsonDBService } from 'src/util/jsondb.service';
import { Post } from './post.entity';
import { PostCreateRequestDTO, PostRequestQueryDTO, PostUpdateRequestDTO } from './dto/request/post.request.dto';
import { Page } from 'src/util/page';
import { Comment } from 'src/comment/comment.entity';
import { Member } from 'src/member/member.entity';
import { Board } from 'src/board/board.entity';
import { CommentService } from 'src/comment/comment.service';

@Injectable()
export class PostService {
  constructor(
    private jsonDBService: JsonDBService,
    private commentService: CommentService
  ) {}

  async getPost(id: number): Promise<Post> {
    const posts: Post[] = await this.jsonDBService.getTable("post");
    const members: Member[] = await this.jsonDBService.getTable("member");
    const boards: Board[] = await this.jsonDBService.getTable("board");
    const comments: Comment[] = await this.jsonDBService.getTable("comment");

    let result: Post = await this.jsonDBService.findById(posts, id);
    result.member = await this.jsonDBService.findRelatedObject(members, "id", result.member_id);
    result.board = await this.jsonDBService.findRelatedObject(boards, "id", result.board_id);
    result.comments = await this.jsonDBService.findRelatedObjects(comments, "post_id", result.id);
    return result;
  }

  async getPosts(requestDTO: PostRequestQueryDTO): Promise<Page<Post>> {
    const posts: Post[] = await this.jsonDBService.getTable("post");
    let result: Post[] = posts;
    for (let key in requestDTO.search) {
      if (requestDTO.search[key]) {
        result = await this.jsonDBService.findByStringField(result, key, requestDTO.search[key]);
      }
    }
    result = await this.jsonDBService.sortItem(result, "createdAt", requestDTO.sort);
    return await this.jsonDBService.findWithPage(result, requestDTO.pageable);
  }

  async createPost(requestDTO: PostCreateRequestDTO) {
    const posts: Post[] = await this.jsonDBService.getTable("post");
    this.jsonDBService.createItem("post", posts, requestDTO);
  }

  async updatePost(id: number, requestDTO: PostUpdateRequestDTO) {
    const posts: Post[] = await this.jsonDBService.getTable("post");
    this.jsonDBService.updateItem("post", posts, id, requestDTO);
  }

  async deletePost(id: number) {
    const posts: Post[] = await this.jsonDBService.getTable("post");
    const comments: Comment[] = await this.jsonDBService.getTable("comment");

    let result: Post = await this.jsonDBService.findById(posts, id);
    result.comments = await this.jsonDBService.findRelatedObjects(comments, "post_id", result.id);
    for (var elem of result.comments) {
      if (elem.depth === 1) {
        await this.commentService.deleteComment(elem.id);
      }
    }
    await this.jsonDBService.deleteItem("post", posts, id);
  }
}
