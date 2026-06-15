// Import access to data
import categoryRepository from "./categoryRepository";

// Some data to make the trick

const categories = [
  {
    id: 1,
    name: "Comédie",
  },
  {
    id: 2,
    name: "Science-Fiction",
  },
];

// Declare the actions

import type { RequestHandler } from "express";

const browse: RequestHandler = async (req, res) => {
  const categoriesFromDB = await categoryRepository.readAll();

  res.json(categoriesFromDB);
};

const read: RequestHandler = (req, res) => {
  const parsedId = Number.parseInt(req.params.id);

  const category = categories.find((category) => category.id === parsedId);
  if (category != null) {
    res.json(category);
  } else {
    res.sendStatus(404);
  }
};

// The E of BREAD - Edit (Update) operation
const edit: RequestHandler = async (req, res, next) => {
  try {
    const categoryId = Number(req.params.id);

    const updatedCategory = {
      name: req.body.name,
    };

    const affectedRows = await categoryRepository.update(
      categoryId,
      updatedCategory,
    );

    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    const newCategory = {
      name: req.body.name,
    };

    const insertId = await categoryRepository.create(newCategory);

    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

// Validation middleware, exécuté avant add et edit
const validate: RequestHandler = (req, res, next) => {
  type ValidationError = {
    field: string;
    message: string;
  };

  const errors: ValidationError[] = [];
  const { name } = req.body;

  if (name == null) {
    errors.push({ field: "name", message: "Le champ name est obligatoire" });
  } else if (typeof name !== "string") {
    errors.push({
      field: "name",
      message: "Le champ name doit être une chaîne de caractères",
    });
  } else if (name.trim().length === 0) {
    errors.push({
      field: "name",
      message: "Le champ name ne peut pas être vide",
    });
  } else if (name.length > 255) {
    errors.push({
      field: "name",
      message: "Le champ name doit contenir moins de 255 caractères",
    });
  }

  if (errors.length === 0) {
    next();
  } else {
    res.status(400).json({ validationErrors: errors });
  }
};

// Export them to import them somewhere else

export default { browse, read, edit, add, validate };
