const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

require("dotenv").config();
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const JWT_SECRET = process.env.JWT_SECRET;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let books = await Book.find();
      if (args.author !== undefined) {
        const author = await Author.findOne({ name: args.author });
        books = books.filter(
          (book) => book.author.toString() === author._id.toString()
        );
      }
      if (args.genre !== undefined) {
        books = books.filter((book) => book.genres.includes(args.genre));
      }
      books = books.map((book) => book.populate("author"));
      return books;
    },
    allAuthors: async (root, args) => {
      return await Author.find({});
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root._id });
      return books.length;
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
    },
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("no permission");
      }

      let author = await Author.findOne({ name: { $in: [args.author] } });
      if (author === null) {
        author = new Author({ name: args.author });
        await author.save();
      }

      try {
        const book = new Book({ ...args, author: author });
        await book.save();
        pubsub.publish("BOOK_ADDED", { bookAdded: book });
        return book.populate("author");
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("no permission");
      }
      const author = await Author.findOne({ name: args.name });
      if (!author) throw new UserInputError(`${args.name} not found`);
      author.born = args.setBornTo;
      return author.save();
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new UserInputError("wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
};

module.exports = resolvers;
