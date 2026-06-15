import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Category = {
  id: number;
  name: string;
};

class CategoryRepository {
  // The C of CRUD - Create operation

  async create(category: Omit<Category, "id">) {
    // Execute the SQL INSERT query to add a new category to the "category" table
    const [result] = await databaseClient.query<Result>(
      "insert into category (name) values (?)",
      [category.name],
    );

    // Return the ID of the newly inserted category
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async readAll() {
    // Execute the SQL SELECT query to retrieve all categories from the "category" table
    const [rows] = await databaseClient.query<Rows>("select * from category");

    // Return the array of categories
    return rows as Category[];
  }

  // The U of CRUD - Update operation

  async update(id: number, category: Omit<Category, "id">) {
    // Execute the SQL UPDATE query to modify an existing category
    const [result] = await databaseClient.query<Result>(
      "update category set name = ? where id = ?",
      [category.name, id],
    );

    // Return the number of affected rows (0 if no category matched this id)
    return result.affectedRows;
  }
}

export default new CategoryRepository();
