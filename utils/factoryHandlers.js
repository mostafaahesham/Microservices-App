const asyncHandler = require("express-async-handler");

const checkDocExistence = require("./checkDocExistence");
const ApiFeatures = require("./apiFeatures");

const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.create(req.body);
    if (!doc) {
      next(new BadRequestError(`couldn't create ${Model.modelName}`));
    }
    res.status(201).json({
      status: 1,
      msg: `${Model.modelName} created successfully`,
      data: doc,
    });
  });

exports.getOneById = (Model, populationOptions) =>
  asyncHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populationOptions) {
      query = query.populate(populationOptions);
    }
    const doc = await query;
    if (!doc) {
      next(new NotFoundError(`couldn't find ${Model.modelName}`));
    }
    
    res.status(200).json({ status: 1, msg: "", data: doc });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const count = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(count)
      .filter()
      .limitFields()
      .sort()
      .search()
      .shuffle();
    const { mongooseQuery, paginationResult } = apiFeatures;

    const docs = await mongooseQuery;
    res.status(200).json({
      status: 1,
      msg: "",
      totalCount: count,
      paginationResult,
      data: docs,
    });
  });

exports.updateOneById = (Model) =>
  asyncHandler(async (req, res, next) => {
    let doc = await checkDocExistence(
      req,
      res,
      next,
      Model,
      "id",
      req.params.id
    );
    doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!doc) {
      next(new BadRequestError(`couldn't update ${Model.modelName}`));
    }
    res.status(200).json({
      status: 1,
      msg: `${Model.modelName} updated successfully`,
      data: doc,
    });
  });

exports.deleteOneById = (Model) =>
  asyncHandler(async (req, res, next) => {
    await checkDocExistence(req, res, next, Model, "id", req.params.id);
    await Model.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ status: 1, msg: `${Model.modelName} deleted successfully` });
  });
