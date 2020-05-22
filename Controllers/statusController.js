const Status = require('../Models/status');
const utils = require('../Util/utils');

exports.getStatusById = (req, res, next) => {
  const { statusId } = req.params;

  utils.checkIfIdIsValid(statusId, res, next);

  return Status.findById(statusId)
    .then((status) => {
      utils.checkNotFound(status, statusId, 'Status');
      res.status(200).json({ message: 'Status has been fetched', status });
      return status;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.addStatus = (req, res, next) => {
  const { name } = req.body;
  const { description } = req.body;

  const status = new Status({ name, description });

  utils.cleanObject(status);

  return status
    .save()
    .then((statusSaved) => {
      if (!statusSaved) {
        const error = new Error('The status has not been created');
        error.statusCode = 500;
        throw error;
      }

      res
        .status(201)
        .json({ message: 'Status inserted!', status: statusSaved });
      return statusSaved;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.updateStatus = (req, res, next) => {
  const { statusId } = req.params;

  const { name } = req.body;
  const { description } = req.body;

  utils.checkIfIdIsValid(statusId, res, next);

  return Status.findById(statusId)
    .then((status) => {
      utils.checkNotFound(status, statusId, 'Status');

      status.name = name || status.name;
      status.description = description || status.description;

      return status.save();
    })
    .then((status) => {
      res.status(200).json({ message: 'Status has been updated !', status });
      return status;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.deleteStatus = (req, res, next) => {
  const { statusId } = req.params;
  utils.checkIfIdIsValid(statusId, res, next);
  return Status.findByIdAndDelete(statusId)
    .then((status) => {
      utils.checkNotFound(status, statusId, 'status');

      res
        .status(200)
        .json({ message: `Status whith id: ${statusId} has been removed` });
    })
    .catch((err) => utils.errorHandler(err, res, next));
};

exports.findByFilter = (req, res, next) => {
  const { name } = req.body;
  const { description } = req.body;

  const filter = {
    name,
    description,
  };

  utils.cleanObject(filter);

  return Status.find(filter)
    .then((statuses) => {
      if (statuses) {
        res.status(200).json({
          message: ' Statuses has been fetched successfully',
          statuses,
        });
        return statuses;
      }

      const error = new Error('Something went wrong...');
      error.statusCode = 404;
      throw error;
    })
    .catch((err) => utils.errorHandler(err, res, next));
};
