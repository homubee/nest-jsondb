import { Injectable } from '@nestjs/common';
import { JsonDBService } from 'src/util/jsondb.service';
import { Comment } from './comment.entity';
import { CommentCreateRequestDTO, CommentUpdateRequestDTO } from './dto/request/comment.request.dto';
import { Member } from 'src/member/member.entity';
import { Post } from 'src/post/post.entity';
import { SortType } from 'src/util/sort';

@Injectable()
export class CommentService {
  constructor(private jsonDBService: JsonDBService) {}

  async getComment(id: number): Promise<Comment> {
    const comments: Comment[] = await this.jsonDBService.getTable("comment");
    const members: Member[] = await this.jsonDBService.getTable("member");
    const posts: Post[] = await this.jsonDBService.getTable("post");
    
    let result: Comment = await this.jsonDBService.findById(comments, id);
    result.member = await this.jsonDBService.findRelatedObject(members, "id", result.member_id);
    result.post = await this.jsonDBService.findRelatedObject(posts, "id", result.post_id);
    result.comments = await this.jsonDBService.findRelatedObjects(comments, "comment_id", result.id);
    return result;
  }

  async getComments(depth: number): Promise<Comment[]> {
    const comments: Comment[] = await this.jsonDBService.getTable("comment");
    const members: Member[] = await this.jsonDBService.getTable("member");
    const posts: Post[] = await this.jsonDBService.getTable("post");

    let result: Comment[] = comments;
    if (depth) {
      result = await this.jsonDBService.findByField(comments, "depth", depth);
      for (var elem of result) {
        elem.member = await this.jsonDBService.findRelatedObject(members, "id", elem.member_id);
        elem.post = await this.jsonDBService.findRelatedObject(posts, "id", elem.post_id);
        elem.comments = await this.findChildComments(elem.id);
        elem.comments = await this.jsonDBService.sortItem(elem.comments, "createdAt", SortType.DESC);
      }
    }
    result = await this.jsonDBService.sortItem(result, "createdAt", SortType.DESC);
    return result;
  }

  async findChildComments(id: number): Promise<Comment[]> {
    const comments: Comment[] = await this.jsonDBService.getTable("comment");
    const members: Member[] = await this.jsonDBService.getTable("member");

    let result: Comment[] = await this.jsonDBService.findRelatedObjects(comments, "comment_id", id);
    for (var elem of result) {
      elem.member = await this.jsonDBService.findRelatedObject(members, "id", elem.member_id);
      elem.comments = await this.findChildComments(elem.id);
      elem.comments = await this.jsonDBService.sortItem(elem.comments, "createdAt", SortType.DESC);
    }
    return result;
  }

  async createComment(requestDTO: CommentCreateRequestDTO) {
    const comments: Comment[] = await this.jsonDBService.getTable("comment");
    this.jsonDBService.createItem("comment", comments, requestDTO);
  }

  async updateComment(id: number, requestDTO: CommentUpdateRequestDTO) {
    const comments: Comment[] = await this.jsonDBService.getTable("comment");
    this.jsonDBService.updateItem("comment", comments, id, requestDTO);
  }

  async deleteComment(id: number) {
    const comments: Comment[] = await this.jsonDBService.getTable("comment");
    const target: Comment = await this.jsonDBService.findById(comments, id);
    if (target.depth === 1) {
      let childComments: Comment[] = await this.jsonDBService.findRelatedObjects(comments, "comment_id", id);
      for (var elem of childComments) {
        await this.jsonDBService.deleteItem("comment", comments, elem.id);
      }
    }
    await this.jsonDBService.deleteItem("comment", comments, id);
  }
}
