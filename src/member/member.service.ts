import { Injectable } from "@nestjs/common";
import { Member } from "./member.entity";
import { JsonDBService } from "src/util/jsondb.service";
import { MemberRequestQueryDTO, MemberRegisterRequestDTO } from "./dto/request/member.request.dto";
import { Page } from "src/util/page";
import { PostService } from "src/post/post.service";
import { Post } from "src/post/post.entity";

@Injectable()
export class MemberService {
  constructor(private jsonDBService: JsonDBService, private postService: PostService) {}

  async getMember(id: number): Promise<Member> {
    const members: Member[] = await this.jsonDBService.getTable("member");
    const posts: Post[] = await this.jsonDBService.getTable("post");

    let result: Member = await this.jsonDBService.findById(members, id);
    result.posts = await this.jsonDBService.findRelatedObjects(posts, "member_id", result.id);
    return result;
  }

  async getMembers(requestDTO: MemberRequestQueryDTO): Promise<Page<Member>> {
    const members: Member[] = await this.jsonDBService.getTable("member");
    let result: Member[] = members;
    for (let key in requestDTO.search) {
      if (requestDTO.search[key]) {
        result = await this.jsonDBService.findByStringField(result, key, requestDTO.search[key]);
      }
    }
    result = await this.jsonDBService.sortItem(result, "createdAt", requestDTO.orderby);
    return await this.jsonDBService.findWithPage(result, requestDTO.pageable);
  }

  async createMember(requestDTO: MemberRegisterRequestDTO) {
    const members: Member[] = await this.jsonDBService.getTable("member");
    this.jsonDBService.createItem("member", members, requestDTO);
  }

  async updateMember(id: number, requestDTO: MemberRegisterRequestDTO) {
    const members: Member[] = await this.jsonDBService.getTable("member");
    this.jsonDBService.updateItem("member", members, id, requestDTO);
  }

  async deleteMember(id: number) {
    const members: Member[] = await this.jsonDBService.getTable("member");
    const posts: Post[] = await this.jsonDBService.getTable("post");

    let result: Member = await this.jsonDBService.findById(members, id);
    result.posts = await this.jsonDBService.findRelatedObjects(posts, "member_id", result.id);
    for (let elem of result.posts) {
      await this.postService.deletePost(elem.id);
    }
    this.jsonDBService.deleteItem("member", members, id);
  }
}
