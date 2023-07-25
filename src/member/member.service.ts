import { Injectable } from '@nestjs/common';
import { Member, MemberSearch } from './member.entity';
import { JsonDBService } from 'src/util/jsondb.service';
import { MemberRegisterRequestDTO } from './dto/request/member.request.dto';
import { Page, Pageable } from 'src/util/page';
import { SortType } from 'src/util/sort';
import { PostService } from 'src/post/post.service';
import { Post } from 'src/post/post.entity';

@Injectable()
export class MemberService {
  constructor(
    private jsonDBService: JsonDBService,
    private postService: PostService
  ) {}

  async getMember(id: number): Promise<Member> {
    const members: Member[] = await this.jsonDBService.getTable("member");
    const posts: Post[] = await this.jsonDBService.getTable("post");

    let result: Member = await this.jsonDBService.findById(members, id);
    result.posts = await this.jsonDBService.findRelatedObjects(posts, "member_id", result.id);
    return result;
  }

  async getMembers(memberSearch: MemberSearch, pageable: Pageable, sort: SortType): Promise<Page<Member>> {
    const members: Member[] = await this.jsonDBService.getTable("member");
    let result: Member[] = members;
    if (memberSearch.email) {
      result = await this.jsonDBService.findByStringField(result, "email", memberSearch.email);
    }
    result = await this.jsonDBService.sortItem(result, "createdAt", sort);
    return await this.jsonDBService.findWithPage(result, pageable);
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
    for (var elem of result.posts) {
      await this.postService.deletePost(elem.id);
    }
    this.jsonDBService.deleteItem("member", members, id);
  }
}
