import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { Page, Pageable } from './page';
import { OrderType } from './order';

interface dbBaseField {
  id: number;
}

@Injectable()
export class JsonDBService {
  async getTable(tableName: string) {
    const json = await fs.readFile(`./db/${tableName}.json`, "utf-8");
    const table = JSON.parse(json);
    return table.data;
  }

  async findById<T extends dbBaseField>(table: T[], id: number): Promise<T> {
    let ret: T;
    for (var elem of table) {
      if (elem.id === id) {
        ret = elem;
        break;
      }
    }
    return ret;
  }

  async findByField<T extends dbBaseField>(table: T[], fieldName: string, field: any): Promise<T[]> {
    let ret: T[] = [];
    for (var elem of table) {
      if (elem[fieldName] === field) {
        ret.push(elem);
      }
    }
    return ret;
  }

  async findByStringField<T extends dbBaseField>(table: T[], fieldName: string, field: any): Promise<T[]> {
    let ret: T[] = [];
    for (var elem of table) {
      if (elem[fieldName].includes(field)) {
        ret.push(elem);
      }
    }
    return ret;
  }

  async findRelatedObject<T extends dbBaseField>(table: T[], fkFieldName: string, id: number): Promise<T> {
    let ret: T;
    for (var elem of table) {
      if (elem[fkFieldName] === id) {
        ret = elem;
        break;
      }
    }
    return ret;
  }

  async findRelatedObjects<T extends dbBaseField>(table: T[], fkFieldName: string, id: number): Promise<T[]> {
    let ret: T[] = [];
    for (var elem of table) {
      if (elem[fkFieldName] === id) {
        ret.push(elem);
      }
    }
    return ret;
  }

  async findWithPage<T extends dbBaseField>(table: T[], pageable: Pageable): Promise<Page<T>> {
    let ret: Page<T> = {
      totalCnt: table.length,
      pageSize: pageable.size,
      totalPages: pageable.size > 0 ? Math.ceil(table.length/pageable.size) : 0,
      content: table.slice((pageable.page-1)*pageable.size, pageable.page*pageable.size)
    }
    return ret;
  }

  async sortItem<T extends dbBaseField>(table: T[], fieldName: string, orderby: OrderType): Promise<T[]> {
    let ret: T[] = table;
    switch (orderby) {
      case OrderType.ASC:
        ret.sort((a, b) => {
          return a[fieldName] < b[fieldName] ? -1 : a[fieldName] > b[fieldName] ? 1 : 0;
        });
        break;
      case OrderType.DESC:
        ret.sort((a, b) => {
          return a[fieldName] > b[fieldName] ? -1 : a[fieldName] < b[fieldName] ? 1 : 0;
        });
        break;
      default:
        break;
    }
    return ret;
  }

  async createItem<T extends dbBaseField>(tableName: string, table: T[], data: any) {
    let id: number;
    if (table.length > 0) {
      id = table.at(-1).id+1;
    } else {
      id = 1;
    }
    table.push({
      id: id,
      ...data,
      createdAt: new Date()
    });
    const newData = {
      data: table
    }
    await fs.writeFile(`./db/${tableName}.json`, JSON.stringify(newData));
  }

  async updateItem<T extends dbBaseField>(tableName: string, table: T[], id: number, data: any) {
    for (const [index, elem] of table.entries()) {
      if (elem.id === id) {
        table[index] = {
          ...elem,
          ...data
        };
        break;
      }
    }
    const newData = {
      data: table
    }
    await fs.writeFile(`./db/${tableName}.json`, JSON.stringify(newData));
  }

  async deleteItem<T extends dbBaseField>(tableName: string, table: T[], id: number) {
    for (const [index, elem] of table.entries()) {
      if (elem.id === id) {
        table.splice(index, 1);
        break;
      }
    }
    const newData = {
      data: table
    }
    await fs.writeFile(`./db/${tableName}.json`, JSON.stringify(newData));
  }
}
