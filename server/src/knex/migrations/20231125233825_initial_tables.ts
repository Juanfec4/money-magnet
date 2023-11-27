import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").notNullable();
    table.string("username").notNullable();
    table.string("email").notNullable();
    table.string("password").notNullable();
  });

  await knex.schema.createTable("budgets", (table) => {
    table.increments("id").notNullable();
    table.string("name");
    table.string("unique_code").notNullable();
  });

  await knex.schema.createTable("budget_members", (table) => {
    table.increments("id").notNullable();
    table.enum("member_type", ["owner", "collaborator"]).notNullable();
    table
      .integer("member_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .notNullable();
    table
      .integer("budget_id")
      .unsigned()
      .references("id")
      .inTable("budgets")
      .onDelete("CASCADE")
      .notNullable();
  });

  await knex.schema.createTable("accounts", (table) => {
    table.increments("id").notNullable();
    table.string("name").notNullable();
    table
      .enum("account_type", ["income", "expense", "saving", "investment"])
      .notNullable();
    table.double("amount").notNullable();
    table
      .integer("budget_id")
      .unsigned()
      .references("id")
      .inTable("budgets")
      .onDelete("CASCADE")
      .notNullable();
  });

  await knex.schema.createTable("transactions", (table) => {
    table.increments("id").notNullable();
    table.double("amount").notNullable();
    table.string("name").notNullable();
    table.dateTime("transaction_date").notNullable();
    table.string("description").notNullable();
    table
      .integer("account_id")
      .unsigned()
      .references("id")
      .inTable("accounts")
      .onDelete("CASCADE")
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("transactions");
  await knex.schema.dropTable("accounts");
  await knex.schema.dropTable("budget_members");
  await knex.schema.dropTable("budgets");
  await knex.schema.dropTable("users");
}
