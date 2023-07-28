import { Injectable } from "@nestjs/common";
import { JsonDBService } from "src/util/jsondb.service";
import { Comment } from "./comment.entity";
import { CommentCreateRequestDTO, CommentUpdateRequestDTO } from "./dto/request/comment.request.dto";
import { Member } from "src/member/member.entity";
import { Post } from "src/post/post.entity";
import { OrderType } from "src/util/order";

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
    result.child_comments = await this.jsonDBService.findRelatedObjects(comments, "parent_comment_id", result.id);
    return result;
  }

  async getComments(): Promise<Comment[]> {
    const comments: Comment[] = await this.jsonDBService.getTable("comment");
    const members: Member[] = await this.jsonDBService.getTable("member");
    const posts: Post[] = await this.jsonDBService.getTable("post");

    let result: Comment[] = comments;
    for (let elem of result) {
      elem.member = await this.jsonDBService.findRelatedObject(members, "id", elem.member_id);
      elem.post = await this.jsonDBService.findRelatedObject(posts, "id", elem.post_id);
      elem.child_comments = await this.findChildComments(elem.id);
      elem.child_comments = await this.jsonDBService.sortItem(elem.child_comments, "createdAt", OrderType.DESC);
    }
    result = await this.jsonDBService.sortItem(result, "createdAt", OrderType.DESC);
    return result;
  }

  async findChildComments(id: number): Promise<Comment[]> {
    const comments: Comment[] = await this.jsonDBService.getTable("comment");
    const members: Member[] = await this.jsonDBService.getTable("member");

    let result: Comment[] = await this.jsonDBService.findRelatedObjects(comments, "parent_comment_id", id);
    for (let elem of result) {
      elem.member = await this.jsonDBService.findRelatedObject(members, "id", elem.member_id);
      elem.child_comments = await this.findChildComments(elem.id);
      elem.child_comments = await this.jsonDBService.sortItem(elem.child_comments, "createdAt", OrderType.DESC);
    }
    return result;
  }

  async createComment(requestDTO: CommentCreateRequestDTO) {
    const comments: Comment[] = await this.jsonDBService.getTable("comment");
    // 부모 댓글이 없는 경우에는 parent_comment_id를 0으로 지정
    if (!requestDTO.parent_comment_id) {
      requestDTO.parent_comment_id = 0;
    }
    this.jsonDBService.createItem("comment", comments, requestDTO);
  }

  async updateComment(id: number, requestDTO: CommentUpdateRequestDTO) {
    const comments: Comment[] = await this.jsonDBService.getTable("comment");
    this.jsonDBService.updateItem("comment", comments, id, requestDTO);
  }

  async deleteComment(id: number) {
    let changedComments: Comment[] = await this.jsonDBService.getTable("comment");
    let childComments: Comment[] = await this.jsonDBService.findRelatedObjects(
      changedComments,
      "parent_comment_id",
      id
    );
    for (let elem of childComments) {
      await this.deleteComment(elem.id);
      changedComments = await this.jsonDBService.getTable("comment");
    }
    await this.jsonDBService.deleteItem("comment", changedComments, id);
  }
}
