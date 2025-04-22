import { IPagination, IPaginationQuery } from "../types";

export class PaginationService {
  static getPagination({
    pageNumber,
    pageSize,
  }: IPaginationQuery): IPagination {
    const skip = (pageNumber - 1) * pageSize;
    const take = pageSize;

    return { skip, take };
  }
}
