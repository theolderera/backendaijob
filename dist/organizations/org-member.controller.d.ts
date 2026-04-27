import { Repository } from 'typeorm';
import { OrgMember } from './entities/org-member.entity';
export declare class OrgMemberController {
    private readonly repo;
    constructor(repo: Repository<OrgMember>);
    findByOrg(orgId: number): Promise<OrgMember[]>;
}
